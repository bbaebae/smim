import asyncio
import json
import re
from typing import TypedDict

import httpx
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import NoTranscriptFound, TranscriptsDisabled


class YoutubeResult(TypedDict):
    video_id: str
    title: str
    transcript: str
    thumbnail_url: str


def _extract_video_id(url: str) -> str | None:
    match = re.search(r"(?:v=|youtu\.be/)([^&\n?#]+)", url)
    return match.group(1) if match else None


def _fetch_transcript(video_id: str) -> str:
    # 1) 선호 언어 순서로 시도
    for lang in (["ko"], ["ja"], ["en"], None):
        try:
            kwargs = {"languages": lang} if lang else {}
            segments = YouTubeTranscriptApi.get_transcript(video_id, **kwargs)
            return " ".join(s["text"] for s in segments)
        except (NoTranscriptFound, TranscriptsDisabled):
            continue
        except Exception:
            continue

    # 2) 자동 생성 자막 포함 모든 자막 시도
    try:
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        for t in transcript_list:
            try:
                segments = t.fetch()
                return " ".join(s["text"] for s in segments)
            except Exception:
                continue
    except Exception:
        pass

    return ""  # 자막 없음 → 설명란 폴백으로 이어짐


def _fetch_page_metadata(video_id: str) -> tuple[str, str]:
    """YouTube 페이지에서 제목·설명란 추출 (자막 없을 때 폴백)."""
    url = f"https://www.youtube.com/watch?v={video_id}"
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
    }
    with httpx.Client(follow_redirects=True, timeout=15) as client:
        resp = client.get(url, headers=headers)
        resp.raise_for_status()
        html = resp.text

    title, description = "", ""

    # ytInitialPlayerConfig 안의 videoDetails 파싱
    m = re.search(r"ytInitialPlayerConfig\s*=\s*(\{.+?\});\s*(?:var |</script>)", html, re.DOTALL)
    if m:
        try:
            data = json.loads(m.group(1))
            vd = data.get("videoDetails", {})
            title = vd.get("title", "")
            description = vd.get("shortDescription", "")
        except Exception:
            pass

    # 못 찾으면 og 태그에서 제목만
    if not title:
        m2 = re.search(r'<meta property="og:title" content="([^"]+)"', html)
        if m2:
            title = m2.group(1)

    return title, description


async def get_youtube_info(url: str) -> YoutubeResult:
    video_id = _extract_video_id(url)
    if not video_id:
        raise ValueError(f"유효하지 않은 YouTube URL: {url}")

    thumbnail_url = f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg"

    transcript = await asyncio.to_thread(_fetch_transcript, video_id)

    if transcript:
        title = url  # 자막 있으면 제목은 AI가 요약에서 추출
        return {"video_id": video_id, "title": title, "transcript": transcript, "thumbnail_url": thumbnail_url}

    # 자막 없음 → 페이지 메타데이터로 폴백
    title, description = await asyncio.to_thread(_fetch_page_metadata, video_id)
    if not description:
        raise ValueError("자막과 영상 설명을 모두 찾을 수 없습니다")

    text = f"{title}\n\n{description}" if title else description
    return {"video_id": video_id, "title": title, "transcript": text, "thumbnail_url": thumbnail_url}
