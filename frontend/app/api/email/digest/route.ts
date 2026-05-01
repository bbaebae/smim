import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import { sendWeeklyReviewEmail, sendRecommendedReadingEmail, ReviewSummaryItem } from '@/lib/email'

export const runtime = 'nodejs'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const email = user.email
  if (!email) return NextResponse.json({ error: '이메일 없음' }, { status: 400 })

  const today = new Date().toISOString().split('T')[0]

  // 복습 대기 항목 조회
  type ScheduleWithContent = {
    content_id: string
    contents: { title: string; summary: string; category: string } | null
  }
  const { data: schedules } = await supabase
    .from('review_schedule')
    .select('content_id, contents(title, summary, category)')
    .eq('user_id', user.id)
    .lte('next_review_at', today)
    .limit(10) as unknown as { data: ScheduleWithContent[] | null }

  const reviewItems: ReviewSummaryItem[] = (schedules ?? [])
    .map((s) => s.contents ? { title: s.contents.title, summary: s.contents.summary, category: s.contents.category } : null)
    .filter(Boolean) as ReviewSummaryItem[]

  if (reviewItems.length > 0) {
    // 복습 대기 항목이 있으면 복습 이메일
    await sendWeeklyReviewEmail(email, reviewItems)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient.from('email_logs') as any).insert({
      user_id: user.id,
      content_ids: (schedules ?? []).map((s) => s.content_id),
    })
    return NextResponse.json({ success: true, sent: reviewItems.length, type: 'review' })
  }

  // 복습 대기 없음 → 라이브러리에서 최근 저장 콘텐츠 추천
  const { data: recentContents } = await supabase
    .from('contents')
    .select('id, title, summary, category')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  if (!recentContents || recentContents.length === 0) {
    return NextResponse.json({ error: '발송할 콘텐츠가 없습니다' }, { status: 400 })
  }

  // 최근 10개 중 랜덤하게 섞어서 추천감 부여
  const shuffled = [...recentContents].sort(() => Math.random() - 0.5).slice(0, 5)
  const recommendItems: ReviewSummaryItem[] = shuffled.map((c) => ({
    title: c.title,
    summary: c.summary,
    category: c.category,
  }))

  await sendRecommendedReadingEmail(email, recommendItems)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (adminClient.from('email_logs') as any).insert({
    user_id: user.id,
    content_ids: shuffled.map((c) => c.id),
  })

  return NextResponse.json({ success: true, sent: recommendItems.length, type: 'recommended' })
}
