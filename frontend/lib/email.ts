import { Resend } from 'resend'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!)
}

export type ReviewSummaryItem = {
  title: string
  summary: string
  category: string
}

const FROM = 'Smim <noreply@smim.app>'
const BASE_URL = 'https://smim.app'

function truncate(text: string, n = 110): string {
  return text.length > n ? text.slice(0, n) + '…' : text
}

function buildItemsHtml(items: ReviewSummaryItem[], accent: string): string {
  return items
    .map(
      (item) =>
        `<div style="margin-bottom:10px;padding:16px 20px;background:#f8f7f5;border-radius:10px;border:1px solid #ece9e8;">` +
        `<p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:${accent};">${item.category}</p>` +
        `<p style="margin:0 0 6px;font-size:15px;font-weight:700;color:#1b1c1c;line-height:1.4;">${item.title}</p>` +
        `<p style="margin:0;font-size:13px;color:#555;line-height:1.55;">${truncate(item.summary)}</p>` +
        `</div>`,
    )
    .join('')
}

function buildEmail(opts: {
  title: string
  subtitle: string
  typeLabel: string
  items: ReviewSummaryItem[]
  accent: string
  ctaLabel: string
  ctaPath: string
}): string {
  const { title, subtitle, typeLabel, items, accent, ctaLabel, ctaPath } = opts
  const ctaUrl = `${BASE_URL}${ctaPath}`
  return `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0eeeb;">
<table width="100%" cellpadding="0" cellspacing="0" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<tr><td align="center" style="padding:40px 16px;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

<tr><td style="background:${accent};border-radius:16px 16px 0 0;padding:20px 32px;">
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td><span style="font-size:18px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">Smim</span></td>
<td align="right"><span style="font-size:11px;color:rgba(255,255,255,0.65);font-weight:600;letter-spacing:0.3px;">${typeLabel}</span></td>
</tr></table>
</td></tr>

<tr><td style="background:#ffffff;padding:32px;">
<h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#1b1c1c;line-height:1.3;">${title}</h1>
<p style="margin:0 0 24px;font-size:14px;color:#767683;line-height:1.6;">${subtitle}</p>
${buildItemsHtml(items, accent)}
<table cellpadding="0" cellspacing="0" style="margin-top:28px;"><tr><td>
<a href="${ctaUrl}" style="display:inline-block;padding:12px 28px;background:${accent};color:#ffffff;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:-0.2px;">${ctaLabel} →</a>
</td></tr></table>
</td></tr>

<tr><td style="background:#f5f3f1;border-radius:0 0 16px 16px;padding:16px 32px;text-align:center;border-top:1px solid #e4e2e2;">
<p style="margin:0;font-size:11px;color:#aaa;">
<a href="${BASE_URL}" style="color:#aaa;text-decoration:none;font-weight:600;">Smim</a>&nbsp;·&nbsp;smim.app
</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

export async function sendWeeklyReviewEmail(to: string, items: ReviewSummaryItem[]) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `📚 이번 주 학습 요약 — ${items.length}개 콘텐츠`,
    html: buildEmail({
      title: '이번 주 학습 요약',
      subtitle: `이번 주에 저장한 콘텐츠 ${items.length}개를 돌아보세요.`,
      typeLabel: '주간 요약',
      items,
      accent: '#132175',
      ctaLabel: '라이브러리 보기',
      ctaPath: '/library',
    }),
  })
}

export async function sendRecommendedReadingEmail(to: string, items: ReviewSummaryItem[]) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `✨ 다시 읽어봐요 — ${items.length}개 추천`,
    html: buildEmail({
      title: '다시 읽어볼 콘텐츠',
      subtitle: `지식은 반복할수록 깊어집니다. 스밈이 ${items.length}개를 골랐어요.`,
      typeLabel: '추천 읽기',
      items,
      accent: '#136299',
      ctaLabel: '스밈 열기',
      ctaPath: '/dashboard',
    }),
  })
}
