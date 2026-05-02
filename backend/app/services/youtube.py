import asyncio
import base64
import glob
import os
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


def _get_cookies_file() -> str | None:
    """YOUTUBE_COOKIES_B64 env var에서 cookies.txt를 /tmp에 디코딩해 경로 반환."""
    b64 = settings.youtube_cookies_b64
    if not b64:
        return None
    path = "/tmp/youtube_cookies.txt"
    if not os.path.exists(path):
        with open(path, "wb") as f:
            f.write(base64.b64decode(b64))
    return path


def _format_transcript_with_timestamps(segments: list) -> str:
    """Segment 리스트를 60초 단위로 그룹화해 '[MM:SS] text' 형식으로 반환."""
    if not segments:
        return ""
    groups: dict[int, list[str]] = {}
    for s in segments:
        minute_start = (int(s["start"]) // 60) * 60
        if minute_start not in groups:
            groups[minute_start] = []
        groups[minute_start].append(s["text"])
    lines = []
    for start_sec in sorted(groups.keys()):
        text = " ".join(groups[start_sec])
        lines.append(f"[{start_sec // 60:02d}:00] {text}")
    return "\n".join(lines)


def _fetch_transcript(video_id: str) -> str:
    proxies = {"https": settings.youtube_proxy} if settings.youtube_proxy else None
    cookies = _get_cookies_file()

    for lang in (["ko"], ["ja"], ["en"], None):
        try:
            kwargs: dict = {"languages": lang} if lang else {}
            if proxies:
                kwargs["proxies"] = proxies
            if cookies:
                kwargs["cookies"] = cookies
            segments = YouTubeTranscriptApi.get_transcript(video_id, **kwargs)
            return _format_transcript_with_timestamps(segments)
        except (NoTranscriptFound, TranscriptsDisabled):
            continue
        except Exception:
            continue

    try:
        list_kwargs: dict = {}
        if proxies:
            list_kwargs["proxies"] = proxies
        if cookies:
            list_kwargs["cookies"] = cookies
        for t in YouTubeTranscriptApi.list_transcripts(video_id, **list_kwargs):
            try:
                return _format_transcript_with_timestamps(t.fetch())
            except Exception:
                continue
    except Exception:
        pass

    return ""


def _parse_vtt(content: str) -> str:
    """VTT 자막 파싱. 타임스탬프 포함 60초 단위 그룹화."""
    segments: list[dict] = []
    lines = content.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if "-->" in line:
            time_str = line.split("-->")[0].strip()
            parts = time_str.replace(",", ".").split(":")
            try:
                if len(parts) == 3:
                    start_sec = int(parts[0]) * 3600 + int(parts[1]) * 60 + float(parts[2])
                elif len(parts) == 2:
                    start_sec = int(parts[0]) * 60 + float(parts[1])
                else:
                    start_sec = 0.0
            except (ValueError, IndexError):
                start_sec = 0.0
            i += 1
            text_parts = []
            while i < len(lines) and lines[i].strip():
                text_line = re.sub(r"<[^>]+>", "", lines[i].strip()).strip()
                if text_line:
                    text_parts.append(text_line)
                i += 1
            if text_parts:
                segments.append({"start": start_sec, "text": " ".join(text_parts)})
        else:
            i += 1

    # Rolling window 중복 제거
    deduped = []
    for idx, seg in enumerate(segments):
        if idx < len(segments) - 1 and segments[idx + 1]["text"].startswith(seg["text"]):
            continue
        deduped.append(seg)

    return _format_transcript_with_timestamps(deduped)


def _build_ydl_base_opts(extra: dict | None = None) -> dict:
    opts = {
        "quiet": True,
        "no_warnings": True,
    }
    if settings.youtube_proxy:
        opts["proxy"] = settings.youtube_proxy
    cookies = _get_cookies_file()
    if cookies:
        opts["cookiefile"] = cookies
    if extra:
        opts.update(extra)
    return opts


def _fetch_subtitle_ytdlp(video_id: str) -> str:
    """yt-dlp로 자막 다운로드 (자동 생성 포함). API 키 불필요."""
    import yt_dlp

    with tempfile.TemporaryDirectory() as tmpdir:
        ydl_opts = _build_ydl_base_opts({
            "skip_download": True,
            "writesubtitles": True,
            "writeautomaticsub": True,
            "subtitleslangs": ["ko", "en", "ja"],
            "subtitlesformat": "vtt",
            "outtmpl": f"{tmpdir}/sub",
        })
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([f"https://www.youtube.com/watch?v={video_id}"])
        except Exception:
            return ""

        # 한국어 우선, 없으면 다른 언어
        for lang in ["ko", "en", "ja"]:
            files = glob.glob(f"{tmpdir}/sub.{lang}.vtt") + glob.glob(f"{tmpdir}/sub.{lang}-*.vtt")
            if files:
                try:
                    with open(files[0], encoding="utf-8") as f:
                        return _parse_vtt(f.read())
                except Exception:
                    continue

        # 언어 구분 없이 첫 번째 VTT
        all_vtt = glob.glob(f"{tmpdir}/sub.*.vtt")
        if all_vtt:
            try:
                with open(all_vtt[0], encoding="utf-8") as f:
                    return _parse_vtt(f.read())
            except Exception:
                pass

    return ""


def _whisper_transcribe(video_id: str) -> tuple[str, str]:
    """yt-dlp로 오디오 다운로드 후 OpenAI Whisper API로 음성인식."""
    import yt_dlp
    from openai import OpenAI

    if not settings.openai_api_key:
        raise ValueError("OPENAI_API_KEY가 설정되지 않았습니다")

    client = OpenAI(api_key=settings.openai_api_key)

    with tempfile.TemporaryDirectory() as tmpdir:
        ydl_opts = _build_ydl_base_opts({
            "format": "bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio[ext=mp3]/bestaudio/best",
            "outtmpl": f"{tmpdir}/audio.%(ext)s",
        })
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(
                    f"https://www.youtube.com/watch?v={video_id}", download=True
                )
                title = info.get("title", "") if info else ""
        except Exception as e:
            raise ValueError(f"YouTube 오디오 다운로드 실패: {e}") from e

        files = glob.glob(f"{tmpdir}/audio.*")
        if not files:
            raise ValueError("오디오 파일을 찾을 수 없습니다")

        with open(files[0], "rb") as f:
            result = client.audio.transcriptions.create(model="whisper-1", file=f)

    return title, result.text


async def get_youtube_info(url: str) -> YoutubeResult:
    video_id = _extract_video_id(url)
    if not video_id:
        raise ValueError(f"유효하지 않은 YouTube URL: {url}")

    thumbnail_url = f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg"

    # 1단계: youtube_transcript_api (빠름)
    transcript = await asyncio.to_thread(_fetch_transcript, video_id)
    if transcript:
        return {"video_id": video_id, "title": "", "transcript": transcript, "thumbnail_url": thumbnail_url}

    # 2단계: yt-dlp 자막 다운로드 (자동 생성 포함, API 키 불필요)
    transcript = await asyncio.to_thread(_fetch_subtitle_ytdlp, video_id)
    if transcript:
        return {"video_id": video_id, "title": "", "transcript": transcript, "thumbnail_url": thumbnail_url}

    # 3단계: Whisper 음성인식 (OPENAI_API_KEY 필요)
    if not settings.openai_api_key:
        raise ValueError("자막을 가져올 수 없는 영상입니다. 자막(자동생성 포함)이 있는 영상을 사용해주세요.")

    title, transcript = await asyncio.to_thread(_whisper_transcribe, video_id)
    if not transcript:
        raise ValueError("음성 인식 결과가 없습니다")

    return {"video_id": video_id, "title": title, "transcript": transcript, "thumbnail_url": thumbnail_url}
