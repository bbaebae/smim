import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { sendWeeklyReviewEmail, ReviewSummaryItem } from '@/lib/email'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const secret = request.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data: users, error: usersError } = await adminClient
      .from('subscriptions')
      .select('user_id')
      .eq('status', 'active')

    if (usersError) throw usersError

    const today = new Date().toISOString().split('T')[0]
    let sent = 0

    for (const { user_id } of users ?? []) {
      const { data: authUser } = await adminClient.auth.admin.getUserById(user_id)
      const email = authUser.user?.email
      if (!email) continue

      type ScheduleWithContent = {
        content_id: string
        contents: { title: string; summary: string; category: string } | null
      }
      const { data: schedules } = await adminClient
        .from('review_schedule')
        .select('content_id, contents(title, summary, category)')
        .eq('user_id', user_id)
        .lte('next_review_at', today)
        .limit(10) as unknown as { data: ScheduleWithContent[] | null }

      if (!schedules || schedules.length === 0) continue

      const items: ReviewSummaryItem[] = schedules
        .map((s) => {
          const c = s.contents
          if (!c) return null
          return { title: c.title, summary: c.summary, category: c.category }
        })
        .filter(Boolean) as ReviewSummaryItem[]

      if (items.length === 0) continue

      await sendWeeklyReviewEmail(email, items)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (adminClient.from('email_logs') as any).insert({
        user_id,
        content_ids: schedules.map((s) => s.content_id),
      })

      sent++
    }

    return NextResponse.json({ success: true, sent })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
