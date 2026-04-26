import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateNextReview } from '@/lib/sm2'

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('review_schedule')
      .select('id, content_id, next_review_at, interval_days, ease_factor, review_count, contents(title, summary, thumbnail_url, type)')
      .lte('next_review_at', today)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json(data ?? [])
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const body = await request.json()
    const { contentId, quality } = body

    if (!contentId) {
      return NextResponse.json({ error: 'contentId가 필요합니다' }, { status: 400 })
    }
    if (typeof quality !== 'number' || quality < 0 || quality > 5) {
      return NextResponse.json({ error: 'quality는 0~5 사이의 숫자여야 합니다' }, { status: 400 })
    }

    const { data: schedule, error: fetchError } = await supabase
      .from('review_schedule')
      .select('id, interval_days, ease_factor, review_count')
      .eq('content_id', contentId)
      .eq('user_id', user.id)
      .single()

    if (fetchError) throw fetchError

    const { nextInterval, nextEase, nextReviewAt } = calculateNextReview(
      schedule.ease_factor,
      schedule.interval_days,
      quality,
    )

    const { error: updateError } = await supabase
      .from('review_schedule')
      .update({
        interval_days: nextInterval,
        ease_factor: nextEase,
        next_review_at: nextReviewAt.toISOString().split('T')[0],
        review_count: schedule.review_count + 1,
      })
      .eq('id', schedule.id)

    if (updateError) throw updateError

    return NextResponse.json({ nextReviewAt, nextInterval, nextEase })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}
