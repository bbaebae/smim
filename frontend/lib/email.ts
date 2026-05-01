import { Resend } from 'resend'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!)
}

export type ReviewSummaryItem = {
  title: string
  summary: string
  category: string
}

function buildItemsHtml(items: ReviewSummaryItem[], accentColor: string): string {
  return items
    .map(
      (item) => `
    <li style="margin-bottom:16px;padding:16px;background:#f8f9fa;border-radius:8px;border-left:3px solid ${accentColor};">
      <p style="margin:0 0 4px;font-size:11px;color:${accentColor};font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">${item.category}</p>
      <p style="margin:0 0 8px;font-size:15px;font-weight:700;color:#111;">${item.title}</p>
      <p style="margin:0;font-size:13px;color:#555;line-height:1.6;">${item.summary}</p>
    </li>`,
    )
    .join('')
}

function buildEmailHtml(title: string, subtitle: string, items: ReviewSummaryItem[], accentColor: string): string {
  return `<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#fbf9f8;">
  <div style="margin-bottom:24px;">
    <span style="font-size:18px;font-weight:800;color:#132175;">스밈</span>
  </div>
  <h1 style="font-size:22px;font-weight:800;color:#1b1c1c;margin:0 0 8px;">${title}</h1>
  <p style="font-size:14px;color:#767683;margin:0 0 28px;">${subtitle}</p>
  <ul style="list-style:none;padding:0;margin:0 0 32px;">
    ${buildItemsHtml(items, accentColor)}
  </ul>
  <a href="https://smim.app/dashboard" style="display:inline-block;padding:12px 24px;background:${accentColor};color:#fff;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;">스밈 열기</a>
  <p style="font-size:11px;color:#aaa;margin-top:32px;">
    스밈 · <a href="https://smim.app" style="color:#aaa;">smim.app</a>
  </p>
</body>
</html>`
}

export async function sendWeeklyReviewEmail(to: string, items: ReviewSummaryItem[]) {
  const html = buildEmailHtml(
    '이번 주 복습 요약',
    `스밈이 선별한 ${items.length}개의 콘텐츠를 복습하세요.`,
    items,
    '#132175',
  )
  await getResend().emails.send({
    from: 'Smim <noreply@smim.app>',
    to,
    subject: `📚 이번 주 복습 — ${items.length}개`,
    html,
  })
}

export async function sendRecommendedReadingEmail(to: string, items: ReviewSummaryItem[]) {
  const html = buildEmailHtml(
    '다시 읽어볼 만한 콘텐츠',
    `지식은 반복할수록 깊어집니다. 스밈이 ${items.length}개를 골랐어요.`,
    items,
    '#136299',
  )
  await getResend().emails.send({
    from: 'Smim <noreply@smim.app>',
    to,
    subject: `✨ 다시 읽어봐요 — ${items.length}개 추천`,
    html,
  })
}
