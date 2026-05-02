import asyncio
import re
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

_NOTION_BLOCK_TYPES = {
    "text", "heading_1", "heading_2", "heading_3",
    "sub_header", "sub_sub_header",  # 구버전 Notion 헤딩
    "bulleted_list", "numbered_list", "toggle",
    "quote", "callout", "to_do",
}


def _is_notion_url(url: str) -> bool:
    return "notion.site" in url or "notion.so" in url


def _extract_notion_page_id(url: str) -> str | None:
    match = re.search(r"([a-f0-9]{32})(?:[?#]|$)", url)
    if not match:
        return None
    raw = match.group(1)
    return f"{raw[:8]}-{raw[8:12]}-{raw[12:16]}-{raw[16:20]}-{raw[20:]}"


def _rich_text_to_str(rich_text: list) -> str:
    parts = []
    for chunk in rich_text:
        if isinstance(chunk, list) and chunk:
            parts.append(str(chunk[0]))
    return "".join(parts)


def _fetch_notion(page_id: str) -> tuple[str, str]:
    """Fetch public Notion page content via unofficial API. Returns (text, title)."""
    payload = {
        "page": {"id": page_id},
        "limit": 200,
        "cursor": {"stack": []},
        "chunkNumber": 0,
        "verticalColumns": False,
    }
    with httpx.Client(timeout=20) as client:
        resp = client.post(
            "https://www.notion.so/api/v3/loadCachedPageChunk",
            json=payload,
            headers={"Content-Type": "application/json", **_HEADERS},
        )
        resp.raise_for_status()
        data = resp.json()

    blocks = data.get("recordMap", {}).get("block", {})
    title = ""
    lines: list[str] = []

    for block_data in blocks.values():
        # v3 API wraps value in value.value
        block = block_data.get("value", {})
        if "value" in block:
            block = block["value"]
        btype = block.get("type", "")
        props = block.get("properties", {})

        if btype == "page" and not title:
            title = _rich_text_to_str(props.get("title", []))
        elif btype in _NOTION_BLOCK_TYPES:
            line = _rich_text_to_str(props.get("title", []))
            if line.strip():
                lines.append(line)

    return "\n".join(lines), title


def _fetch_html(url: str) -> tuple[str, str]:
    """Returns (html, page_title)."""
    with httpx.Client(follow_redirects=True, timeout=20, headers=_HEADERS) as client:
        resp = client.get(url)
        resp.raise_for_status()
        html = resp.text

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
    if _is_notion_url(url):
        page_id = _extract_notion_page_id(url)
        if page_id:
            text, title = await asyncio.to_thread(_fetch_notion, page_id)
            return {"title": title or url, "text": text}

    html, page_title = await asyncio.to_thread(_fetch_html, url)

    text = trafilatura.extract(
        html,
        include_comments=False,
        include_tables=False,
        favor_precision=True,
    ) or ""

    meta = trafilatura.extract_metadata(html)
    title = (meta.title if meta and meta.title else None) or page_title

    return {"title": title, "text": text}
