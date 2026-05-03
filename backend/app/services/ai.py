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
    summary_cards: list[dict]


_SUMMARY_FORMAT = """\
◆ 한 줄 요약
(글의 핵심을 1문장으로)

◆ 주요 내용
• (핵심 포인트 1)
• (핵심 포인트 2)
• (핵심 포인트 3~5개, 구체적으로)

◆ 배경 & 맥락
(이해에 필요한 배경 지식이나 상황 설명, 2~3문장)

◆ 핵심 인사이트
(저자의 핵심 주장 또는 독자가 얻을 수 있는 통찰, 2~3문장)

◆ 기억할 포인트
• (실질적으로 기억하거나 적용할 내용 1)
• (실질적으로 기억하거나 적용할 내용 2~3개)\
"""


async def analyze_content(text: str, content_type: str) -> AnalysisResult:
    import asyncio

    def _call() -> AnalysisResult:
        message = _client.messages.create(
            model="claude-opus-4-7",
            max_tokens=2500,
            messages=[
                {
                    "role": "user",
                    "content": (
                        f"다음 글을 읽고 JSON으로만 응답해. 다른 텍스트 없이 JSON만.\n"
                        f"summary는 원문을 읽지 않아도 내용 전체를 이해할 수 있도록 아래 형식에 맞춰 상세히 작성해:\n\n"
                        f"{_SUMMARY_FORMAT}\n\n"
                        f"cards는 복습용 핵심 포인트 3~5개. 각 카드는 title(15자 이내 간결한 제목)과 body(핵심 내용 1~2문장)로 구성.\n\n"
                        f'JSON 형식: {{"summary":"위 형식대로 작성한 전체 요약","category":"{"|".join(CATEGORIES)} 중 하나","tags":["태그1","태그2","태그3"],"cards":[{{"title":"제목","body":"설명"}}]}}\n'
                        f"글: {text[:8000]}"
                    ),
                }
            ],
        )
        raw = message.content[0].text if message.content[0].type == "text" else ""
        try:
            parsed = json.loads(raw)
            cards = parsed.get("cards", [])
            return {
                "summary": parsed.get("summary", ""),
                "category": parsed["category"] if parsed.get("category") in CATEGORIES else "기타",
                "tags": parsed.get("tags", []) if isinstance(parsed.get("tags"), list) else [],
                "summary_cards": cards if isinstance(cards, list) else [],
            }
        except Exception:
            return {"summary": raw[:300], "category": "기타", "tags": [], "summary_cards": []}

    return await asyncio.to_thread(_call)
