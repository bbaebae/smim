import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

export default async function ContentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: content } = await supabase
    .from('contents')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!content) notFound()

  const { data: schedule } = await supabase
    .from('review_schedule')
    .select('next_review_at, interval_days, review_count')
    .eq('content_id', id)
    .eq('user_id', user.id)
    .single()

  return (
    <article className="space-y-4">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
        ← 목록으로
      </Link>

      {content.thumbnail_url && (
        <div className="relative h-48 w-full overflow-hidden rounded-xl">
          <Image src={content.thumbnail_url} alt="" fill className="object-cover" unoptimized />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          {content.category}
        </span>
        {(content.tags as string[]).map((tag: string) => (
          <span key={tag} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
            #{tag}
          </span>
        ))}
      </div>

      <h1 className="text-xl font-bold text-gray-900">{content.title}</h1>

      {content.url && (
        <a
          href={content.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block truncate text-sm text-indigo-600 hover:underline"
        >
          {content.url}
        </a>
      )}

      <section className="rounded-xl bg-indigo-50 p-4">
        <h2 className="mb-2 text-sm font-semibold text-indigo-800">AI 요약</h2>
        <p className="text-sm leading-relaxed text-gray-700">{content.summary}</p>
      </section>

      {schedule && (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-gray-700">복습 정보</h2>
          <div className="flex gap-6 text-sm text-gray-600">
            <div>
              <span className="text-xs text-gray-400">다음 복습</span>
              <p className="font-medium">{schedule.next_review_at}</p>
            </div>
            <div>
              <span className="text-xs text-gray-400">복습 횟수</span>
              <p className="font-medium">{schedule.review_count}회</p>
            </div>
            <div>
              <span className="text-xs text-gray-400">주기</span>
              <p className="font-medium">{schedule.interval_days}일</p>
            </div>
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-2 text-sm font-semibold text-gray-700">원문</h2>
        <div className="whitespace-pre-wrap rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-600">
          {content.full_text}
        </div>
      </section>
    </article>
  )
}
