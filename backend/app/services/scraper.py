import asyncio
from typing import TypedDict

import httpx
import trafilatura


class ScrapeResult(TypedDict):
    title: str
    text: str


_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
}


def _fetch_html(url: str) -> tuple[str, str]:
    """Returns (html, page_title)."""
    with httpx.Client(follow_redirects=True, timeout=20, headers=_HEADERS) as client:
        resp = client.get(url)
        resp.raise_for_status()
        html = resp.text

    # Quick title extraction from <title> tag
    page_title = url
    lower = html.lower()
    start = lower.find("<title")
    if start != -1:
        end_tag = lower.find(">", start)
        close = lower.find("</title>", end_tag)
        if end_tag != -1 and close != -1:
            page_title = html[end_tag + 1:close].strip() or url

    return html, page_title


async def scrape_article(url: str) -> ScrapeResult:
    html, page_title = await asyncio.to_thread(_fetch_html, url)

    text = trafilatura.extract(
        html,
        include_comments=False,
        include_tables=False,
        favor_precision=True,
    ) or ""

    # Prefer h1 extracted by trafilatura metadata
    meta = trafilatura.extract_metadata(html)
    title = (meta.title if meta and meta.title else None) or page_title

    return {"title": title, "text": text}
