import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ReviewPageClient from '@/components/ReviewPageClient'
import { ReviewItem } from '@/components/ReviewCard'

export default async function ReviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = new Date().toISOString().split('T')[0]

  const { data } = await supabase
    .from('review_schedule')
    .select('id, content_id, next_review_at, interval_days, ease_factor, review_count, contents(title, summary, thumbnail_url, type, category, tags)')
    .eq('user_id', user.id)
    .lte('next_review_at', today)

  return (
    <div className="px-4 pt-8 pb-8">
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-[28px] font-bold text-[#1b1c1c] tracking-tight mb-1">복습</h1>
        <p className="text-[14px] text-[#767683]">오늘 복습할 콘텐츠</p>
      </div>
      <ReviewPageClient items={(data ?? []) as unknown as ReviewItem[]} />
    </div>
  )
}
