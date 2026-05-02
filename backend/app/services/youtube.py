import asyncio
import glob
import re
import tempfile
from typing import TypedDict

from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import NoTranscriptFound, TranscriptsDisabled

from app.config import settings


class YoutubeResult(TypedDict):
    video_id: str
    title: str
    transcript: str
    thumbnail_url: str


def _extract_video_id(url: str) -> str | None:
    match = re.search(r"(?:v=|youtu\.be/)([^&\n?#]+)", url)
    return match.group(1) if match else None


def _fetch_transcript(video_id: str) -> str:
    # 선호 언어 순서로 시도 (수동 + 자동생성 모두 포함)
    for lang in (["ko"], ["ja"], ["en"], None):
        try:
            kwargs = {"languages": lang} if lang else {}
            segments = YouTubeTranscriptApi.get_transcript(video_id, **kwargs)
            return " ".join(s["text"] for s in segments)
        except (NoTranscriptFound, TranscriptsDisabled):
            continue
        except Exception:
            continue

    # 어떤 언어든 있으면 사용
    try:
        for t in YouTubeTranscriptApi.list_transcripts(video_id):
            try:
                return " ".join(s["text"] for s in t.fetch())
            except Exception:
                continue
    except Exception:
        pass

    return ""


def _whisper_transcribe(video_id: str) -> tuple[str, str]:
    """yt-dlp로 오디오 다운로드 후 OpenAI Whisper로 음성 인식."""
    import yt_dlp
    from openai import OpenAI

    client = OpenAI(api_key=settings.openai_api_key)

    with tempfile.TemporaryDirectory() as tmpdir:
        output_template = f"{tmpdir}/audio"
        ydl_opts = {
            # m4a 오디오만 다운로드 (ffmpeg 불필요)
            "format": "140/139/bestaudio[ext=m4a]/bestaudio",
            "outtmpl": output_template + ".%(ext)s",
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

        with open(files[0], "rb") as audio_file:
            result = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
            )

    return title, result.text


async def get_youtube_info(url: str) -> YoutubeResult:
    video_id = _extract_video_id(url)
    if not video_id:
        raise ValueError(f"유효하지 않은 YouTube URL: {url}")

    thumbnail_url = f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg"

    # 1단계: 자막 시도
    transcript = await asyncio.to_thread(_fetch_transcript, video_id)
    if transcript:
        return {
            "video_id": video_id,
            "title": "",
            "transcript": transcript,
            "thumbnail_url": thumbnail_url,
        }

    # 2단계: Whisper 음성 인식 (OpenAI API 키 필요)
    if not settings.openai_api_key:
        raise ValueError("자막이 없는 영상입니다. 음성 인식을 사용하려면 OPENAI_API_KEY 환경변수를 설정하세요.")

    title, transcript = await asyncio.to_thread(_whisper_transcribe, video_id)
    if not transcript:
        raise ValueError("음성 인식 결과가 없습니다")

    return {
        "video_id": video_id,
        "title": title,
        "transcript": transcript,
        "thumbnail_url": thumbnail_url,
    }
