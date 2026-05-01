import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from '@/components/DashboardClient'
import { ContentItem } from '@/components/ContentCard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = new Date().toISOString().split('T')[0]

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
      .lte('next_review_at', today),
  ])

  const contents = (contentsResult.data ?? []) as ContentItem[]
  const reviewCount = reviewsResult.count ?? 0

  return <DashboardClient contents={contents} reviewCount={reviewCount} />
}
