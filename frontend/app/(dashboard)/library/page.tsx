import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ContentItem } from '@/components/ContentCard'
import LibraryClient from '@/components/LibraryClient'

export default async function LibraryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('contents')
    .select('id, type, title, summary, category, tags, thumbnail_url, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const contents = (data ?? []) as ContentItem[]

  return (
    <div className="px-6 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#1b1c1c] tracking-tight mb-1">라이브러리</h1>
        <p className="text-[14px] text-[#767683]">저장된 콘텐츠 전체 목록</p>
      </div>
      <LibraryClient contents={contents} />
    </div>
  )
}
