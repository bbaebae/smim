import resend
from app.config import settings

resend.api_key = settings.resend_api_key

FROM = "Smim <noreply@smim.app>"


def _truncate(text: str, n: int = 110) -> str:
    return text[:n] + "…" if len(text) > n else text


def _item_html(item: dict, accent: str) -> str:
    summary = _truncate(item.get("summary") or "")
    return (
        '<div style="margin-bottom:10px;padding:16px 20px;background:#f8f7f5;border-radius:10px;border:1px solid #ece9e8;">'
        f'<p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:{accent};">{item["category"]}</p>'
        f'<p style="margin:0 0 6px;font-size:15px;font-weight:700;color:#1b1c1c;line-height:1.4;">{item["title"]}</p>'
        f'<p style="margin:0;font-size:13px;color:#555;line-height:1.55;">{summary}</p>'
        '</div>'
    )


def _build_html(
    title: str,
    subtitle: str,
    type_label: str,
    items: list[dict],
    accent: str,
    cta_label: str,
    cta_path: str,
    frontend_url: str,
) -> str:
    items_html = "".join(_item_html(i, accent) for i in items)
    cta_url = f"{frontend_url}{cta_path}"
    return f"""<!DOCTYPE html>
<html lang="ko">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0eeeb;">
<table width="100%" cellpadding="0" cellspacing="0" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<tr><td align="center" style="padding:40px 16px;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

<tr><td style="background:{accent};border-radius:16px 16px 0 0;padding:20px 32px;">
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td><span style="font-size:18px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">Smim</span></td>
<td align="right"><span style="font-size:11px;color:rgba(255,255,255,0.65);font-weight:600;letter-spacing:0.3px;">{type_label}</span></td>
</tr></table>
</td></tr>

<tr><td style="background:#ffffff;padding:32px;">
<h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#1b1c1c;line-height:1.3;">{title}</h1>
<p style="margin:0 0 24px;font-size:14px;color:#767683;line-height:1.6;">{subtitle}</p>
{items_html}
<table cellpadding="0" cellspacing="0" style="margin-top:28px;"><tr><td>
<a href="{cta_url}" style="display:inline-block;padding:12px 28px;background:{accent};color:#ffffff;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:-0.2px;">{cta_label} →</a>
</td></tr></table>
</td></tr>

<tr><td style="background:#f5f3f1;border-radius:0 0 16px 16px;padding:16px 32px;text-align:center;border-top:1px solid #e4e2e2;">
<p style="margin:0;font-size:11px;color:#aaa;">
<a href="{frontend_url}" style="color:#aaa;text-decoration:none;font-weight:600;">Smim</a>&nbsp;·&nbsp;smim.app
</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>"""


def send_weekly_report(to: str, items: list[dict]) -> None:
    html = _build_html(
        title="이번 주 학습 요약",
        subtitle=f"이번 주에 저장한 콘텐츠 {len(items)}개를 돌아보세요.",
        type_label="주간 요약",
        items=items,
        accent="#132175",
        cta_label="라이브러리 보기",
        cta_path="/library",
        frontend_url=settings.frontend_url,
    )
    resend.Emails.send({
        "from": FROM,
        "to": to,
        "subject": f"📚 이번 주 학습 요약 — {len(items)}개 콘텐츠",
        "html": html,
    })


def send_review_reminder(to: str, items: list[dict]) -> None:
    html = _build_html(
        title=f"오늘 복습할 콘텐츠 {len(items)}개",
        subtitle="기억은 반복에서 완성됩니다. 지금 복습하면 더 오래 기억해요.",
        type_label="복습 알림",
        items=items,
        accent="#136299",
        cta_label="지금 복습하기",
        cta_path="/review",
        frontend_url=settings.frontend_url,
    )
    resend.Emails.send({
        "from": FROM,
        "to": to,
        "subject": f"🧠 오늘 복습 {len(items)}개 대기 중",
        "html": html,
    })
