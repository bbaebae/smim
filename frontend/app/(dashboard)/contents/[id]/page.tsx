import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import ContentTabs from '@/components/ContentTabs'
import DeleteButton from '@/components/DeleteButton'

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
    <div className="px-6 py-8 max-w-3xl">
      {/* 헤더: 뒤로가기 + 삭제 */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/library"
          className="inline-flex items-center gap-1 text-[13px] text-[#767683] hover:text-[#132175] transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          라이브러리
        </Link>
        <DeleteButton contentId={content.id} />
      </div>

      {/* 썸네일 */}
      {content.thumbnail_url && (
        <div className="relative h-52 w-full overflow-hidden rounded-2xl mb-6">
          <Image src={content.thumbnail_url} alt="" fill className="object-cover" unoptimized />
        </div>
      )}

      {/* 카테고리 + 태그 */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="rounded-full bg-[#136299]/10 px-3 py-1 text-[11px] font-semibold text-[#136299] uppercase tracking-wide">
          {content.category}
        </span>
        {(content.tags as string[]).map((tag: string) => (
          <span key={tag} className="rounded-full bg-[#efeded] border border-[#e4e2e2] px-3 py-1 text-[11px] font-medium text-[#454651]">
            #{tag}
          </span>
        ))}
      </div>

      {/* 제목 */}
      <h1 className="text-[24px] font-bold text-[#1b1c1c] leading-snug tracking-tight mb-3">
        {content.title}
      </h1>

      {/* 원본 URL */}
      {content.url && (
        <a
          href={content.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[13px] text-[#136299] hover:underline mb-6"
        >
          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          원문 보기
        </a>
      )}

      {/* 복습 정보 */}
      {schedule && (
        <section className="rounded-xl bg-white border border-[#e4e2e2] p-5 mb-6 ambient-shadow">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[18px] text-[#767683]">schedule</span>
            <h2 className="text-[13px] font-semibold text-[#454651]">복습 정보</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: '다음 복습', value: schedule.next_review_at },
              { label: '복습 횟수', value: `${schedule.review_count}회` },
              { label: '복습 주기', value: `${schedule.interval_days}일` },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-[11px] text-[#767683] mb-0.5">{s.label}</p>
                <p className="text-[14px] font-semibold text-[#1b1c1c]">{s.value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 요약 / 원문 / AI 채팅 탭 */}
      <ContentTabs summary={content.summary} fullText={content.full_text ?? null} />
    </div>
  )
}
