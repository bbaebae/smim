import resend
from app.config import settings

resend.api_key = settings.resend_api_key

FROM = "Smim <noreply@smim.app>"


def _item_html(item: dict, accent: str) -> str:
    return (
        f'<li style="margin-bottom:16px;padding:16px;background:#f8f9fa;border-radius:8px;border-left:3px solid {accent};">'
        f'<p style="margin:0 0 4px;font-size:11px;color:{accent};font-weight:700;text-transform:uppercase;">{item["category"]}</p>'
        f'<p style="margin:0 0 8px;font-size:15px;font-weight:700;color:#111;">{item["title"]}</p>'
        f'<p style="margin:0;font-size:13px;color:#555;line-height:1.6;">{item["summary"]}</p>'
        f"</li>"
    )


def _build_html(title: str, subtitle: str, items: list[dict], accent: str, frontend_url: str) -> str:
    items_html = "".join(_item_html(i, accent) for i in items)
    return (
        "<!DOCTYPE html><html><body "
        'style="font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#fbf9f8;">'
        f'<div style="margin-bottom:24px;"><span style="font-size:18px;font-weight:800;color:#132175;">스밈</span></div>'
        f'<h1 style="font-size:22px;font-weight:800;color:#1b1c1c;margin:0 0 8px;">{title}</h1>'
        f'<p style="font-size:14px;color:#767683;margin:0 0 28px;">{subtitle}</p>'
        f'<ul style="list-style:none;padding:0;margin:0 0 32px;">{items_html}</ul>'
        f'<a href="{frontend_url}/dashboard" style="display:inline-block;padding:12px 24px;background:{accent};color:#fff;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;">스밈 열기</a>'
        f'<p style="font-size:11px;color:#aaa;margin-top:32px;">스밈 · <a href="{frontend_url}" style="color:#aaa;">smim.app</a></p>'
        "</body></html>"
    )


def send_weekly_report(to: str, items: list[dict]) -> None:
    html = _build_html(
        "이번 주 복습 요약",
        f"스밈이 선별한 {len(items)}개의 콘텐츠를 복습하세요.",
        items,
        "#132175",
        settings.frontend_url,
    )
    resend.Emails.send({
        "from": FROM,
        "to": to,
        "subject": f"📚 이번 주 복습 — {len(items)}개",
        "html": html,
    })


def send_review_reminder(to: str, items: list[dict]) -> None:
    html = _build_html(
        "오늘 복습할 콘텐츠가 있어요",
        f"스밈 SM-2 알고리즘이 {len(items)}개를 선별했습니다.",
        items,
        "#136299",
        settings.frontend_url,
    )
    resend.Emails.send({
        "from": FROM,
        "to": to,
        "subject": f"🧠 오늘 복습 — {len(items)}개 대기 중",
        "html": html,
    })
