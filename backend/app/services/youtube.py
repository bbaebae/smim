import asyncio
import glob
import re
import tempfile
from typing import TypedDict

from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import NoTranscriptFound, TranscriptsDisabled

# 모델은 한 번만 로드해서 재사용
_whisper_model = None


class YoutubeResult(TypedDict):
    video_id: str
    title: str
    transcript: str
    thumbnail_url: str


def _extract_video_id(url: str) -> str | None:
    match = re.search(r"(?:v=|youtu\.be/)([^&\n?#]+)", url)
    return match.group(1) if match else None


def _fetch_transcript(video_id: str) -> str:
    for lang in (["ko"], ["ja"], ["en"], None):
        try:
            kwargs = {"languages": lang} if lang else {}
            segments = YouTubeTranscriptApi.get_transcript(video_id, **kwargs)
            return " ".join(s["text"] for s in segments)
        except (NoTranscriptFound, TranscriptsDisabled):
            continue
        except Exception:
            continue

    try:
        for t in YouTubeTranscriptApi.list_transcripts(video_id):
            try:
                return " ".join(s["text"] for s in t.fetch())
            except Exception:
                continue
    except Exception:
        pass

    return ""


def _get_whisper_model():
    global _whisper_model
    if _whisper_model is None:
        from faster_whisper import WhisperModel
        # base 모델: 145MB, CPU int8 최적화
        _whisper_model = WhisperModel("base", device="cpu", compute_type="int8")
    return _whisper_model


def _whisper_transcribe(video_id: str) -> tuple[str, str]:
    """yt-dlp로 오디오 다운로드 후 faster-whisper로 로컬 음성인식."""
    import yt_dlp

    with tempfile.TemporaryDirectory() as tmpdir:
        ydl_opts = {
            "format": "140/139/bestaudio[ext=m4a]/bestaudio",
            "outtmpl": f"{tmpdir}/audio.%(ext)s",
            "quiet": True,
            "no_warnings": True,
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(
                f"https://www.youtube.com/watch?v={video_id}", download=True
            )
            title = info.get("title", "") if info else ""

        files = glob.glob(f"{tmpdir}/audio.*")
        if not files:
            raise ValueError("오디오 다운로드 실패")

        model = _get_whisper_model()
        segments, _ = model.transcribe(files[0], beam_size=5)
        transcript = " ".join(seg.text for seg in segments)

    return title, transcript


async def get_youtube_info(url: str) -> YoutubeResult:
    video_id = _extract_video_id(url)
    if not video_id:
        raise ValueError(f"유효하지 않은 YouTube URL: {url}")

    thumbnail_url = f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg"

    # 1단계: 자막 시도 (빠름)
    transcript = await asyncio.to_thread(_fetch_transcript, video_id)
    if transcript:
        return {"video_id": video_id, "title": "", "transcript": transcript, "thumbnail_url": thumbnail_url}

    # 2단계: 자막 없으면 Whisper 음성인식 (느리지만 확실)
    title, transcript = await asyncio.to_thread(_whisper_transcribe, video_id)
    if not transcript:
        raise ValueError("음성 인식 결과가 없습니다")

    return {"video_id": video_id, "title": title, "transcript": transcript, "thumbnail_url": thumbnail_url}
