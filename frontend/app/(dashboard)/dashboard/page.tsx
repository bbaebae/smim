import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ReviewBanner from '@/components/ReviewBanner'
import DashboardClient from '@/components/DashboardClient'
import { ContentItem } from '@/components/ContentCard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [contentsResult, reviewsResult] = await Promise.all([
    supabase
      .from('contents')
      .select('id, type, title, summary, category, tags, thumbnail_url, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('review_schedule')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .lte('next_review_at', new Date().toISOString().split('T')[0]),
  ])

  const contents = (contentsResult.data ?? []) as ContentItem[]
  const reviewCount = reviewsResult.count ?? 0

  return (
    <div className="px-6 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#1b1c1c] tracking-tight mb-1">홈</h1>
        <p className="text-[14px] text-[#767683]">오늘의 지식 베이스</p>
      </div>

      <ReviewBanner count={reviewCount} />
      <DashboardClient contents={contents} />
    </div>
  )
}
