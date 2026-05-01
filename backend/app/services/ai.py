import json
from typing import TypedDict

import anthropic

from app.config import settings

_client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

CATEGORIES = ["기술/개발", "비즈니스/마케팅", "투자/경제", "라이프스타일", "기타"]


class AnalysisResult(TypedDict):
    summary: str
    category: str
    tags: list[str]


async def analyze_content(text: str, content_type: str) -> AnalysisResult:
    import asyncio

    def _call() -> AnalysisResult:
        message = _client.messages.create(
            model="claude-opus-4-7",
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": (
                        f"다음 글을 읽고 JSON으로만 응답해. 다른 텍스트 없이 JSON만:\n"
                        f'{{"summary":"3줄 핵심 요약","category":"{"|".join(CATEGORIES)} 중 하나","tags":["태그1","태그2","태그3"]}}\n'
                        f"글: {text[:8000]}"
                    ),
                }
            ],
        )
        raw = message.content[0].text if message.content[0].type == "text" else ""
        try:
            parsed = json.loads(raw)
            return {
                "summary": parsed.get("summary", ""),
                "category": parsed["category"] if parsed.get("category") in CATEGORIES else "기타",
                "tags": parsed.get("tags", []) if isinstance(parsed.get("tags"), list) else [],
            }
        except Exception:
            return {"summary": raw[:300], "category": "기타", "tags": []}

    return await asyncio.to_thread(_call)
