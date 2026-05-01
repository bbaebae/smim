import asyncio
import re
from typing import TypedDict

from youtube_transcript_api import YouTubeTranscriptApi


class YoutubeResult(TypedDict):
    video_id: str
    transcript: str
    thumbnail_url: str


def _extract_video_id(url: str) -> str | None:
    match = re.search(r"(?:v=|youtu\.be/)([^&\n?#]+)", url)
    return match.group(1) if match else None


def _fetch_transcript(video_id: str) -> str:
    # try Korean first, then Japanese, then default
    for lang in (["ko"], ["ja"], None):
        try:
            kwargs = {"languages": lang} if lang else {}
            segments = YouTubeTranscriptApi.get_transcript(video_id, **kwargs)
            return " ".join(s["text"] for s in segments)
        except Exception:
            continue
    raise ValueError("자막을 찾을 수 없습니다")


async def get_youtube_info(url: str) -> YoutubeResult:
    video_id = _extract_video_id(url)
    if not video_id:
        raise ValueError(f"유효하지 않은 YouTube URL: {url}")

    transcript = await asyncio.to_thread(_fetch_transcript, video_id)
    thumbnail_url = f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg"

    return {"video_id": video_id, "transcript": transcript, "thumbnail_url": thumbnail_url}
