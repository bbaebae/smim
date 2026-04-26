import { Resend } from 'resend'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!)
}

export type ReviewSummaryItem = {
  title: string
  summary: string
  category: string
}

export async function sendWeeklyReviewEmail(to: string, items: ReviewSummaryItem[]) {
  const itemsHtml = items
    .map(
      (item) => `
    <li style="margin-bottom:16px;padding:16px;background:#f8f9fa;border-radius:8px;">
      <p style="margin:0 0 4px;font-size:12px;color:#6366f1;font-weight:600;">${item.category}</p>
      <p style="margin:0 0 8px;font-size:16px;font-weight:700;color:#111;">${item.title}</p>
      <p style="margin:0;font-size:14px;color:#555;line-height:1.6;">${item.summary}</p>
    </li>`,
    )
    .join('')

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <h1 style="font-size:24px;font-weight:800;color:#111;">이번 주 복습 요약</h1>
      <p style="color:#666;">스밈이 선별한 ${items.length}개의 콘텐츠를 복습하세요.</p>
      <ul style="list-style:none;padding:0;margin:24px 0;">
        ${itemsHtml}
      </ul>
      <p style="font-size:12px;color:#999;margin-top:32px;">
        스밈 · <a href="https://smim.app" style="color:#6366f1;">smim.app</a>
      </p>
    </body>
    </html>
  `

  await getResend().emails.send({
    from: 'Smim <noreply@smim.app>',
    to,
    subject: `📚 이번 주 복습 요약 — ${items.length}개`,
    html,
  })
}
