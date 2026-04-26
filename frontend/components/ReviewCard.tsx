'use client'

import Image from 'next/image'

export type ReviewItem = {
  id: string
  content_id: string
  next_review_at: string
  interval_days: number
  ease_factor: number
  review_count: number
  contents: {
    title: string
    summary: string
    thumbnail_url: string | null
    type: string
    category?: string
    tags?: string[]
  }
}

type Props = {
  item: ReviewItem
  onRate: (contentId: string, quality: number) => void
  loading: boolean
}

export default function ReviewCard({ item, onRate, loading }: Props) {
  const tags = item.contents.tags ?? []
  const category = item.contents.category

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Card */}
      <div className="bg-white rounded-2xl border border-[#e4e2e2]/50 ambient-shadow p-8 transition-all duration-300">
        {/* Tags */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 flex-wrap">
            {category && (
              <span className="bg-[#136299]/10 text-[#136299] text-[11px] font-semibold tracking-wide uppercase px-3 py-1 rounded-full">
                {category}
              </span>
            )}
            {tags.slice(0, 2).map((tag) => (
              <span key={tag} className="bg-[#efeded] text-[#454651] text-[11px] font-medium px-3 py-1 rounded-full border border-[#e4e2e2]">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-[22px] font-semibold text-[#1b1c1c] leading-snug mb-6">
          {item.contents.title}
        </h2>

        {item.contents.thumbnail_url && (
          <div className="relative mb-6 h-48 w-full overflow-hidden rounded-xl">
            <Image src={item.contents.thumbnail_url} alt="" fill className="object-cover" unoptimized />
          </div>
        )}

        {/* Divider */}
        <div className="h-px w-full bg-[#e4e2e2] mb-6" />

        {/* Summary */}
        <p className="text-[16px] leading-relaxed text-[#454651]">{item.contents.summary}</p>
      </div>

      {/* Rating buttons */}
      <div className="mt-6 flex items-center justify-center gap-3 w-full">
        <button
          onClick={() => onRate(item.content_id, 0)}
          disabled={loading}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-6 rounded-xl bg-[#ffdbc8] text-[#321300] hover:bg-[#ffb68a] transition-colors disabled:opacity-50 max-w-[140px]"
        >
          <span className="text-[11px] font-semibold tracking-wide opacity-70">&lt; 1m</span>
          <span className="text-[14px] font-semibold">Forget</span>
        </button>
        <button
          onClick={() => onRate(item.content_id, 3)}
          disabled={loading}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-6 rounded-xl bg-[#cfe5ff] text-[#001d33] hover:bg-[#98cbff] transition-colors disabled:opacity-50 max-w-[140px]"
        >
          <span className="text-[11px] font-semibold tracking-wide opacity-70">10m</span>
          <span className="text-[14px] font-semibold">Vague</span>
        </button>
        <button
          onClick={() => onRate(item.content_id, 5)}
          disabled={loading}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-6 rounded-xl bg-[#132175] text-white hover:bg-[#2d3a8c] transition-colors disabled:opacity-50 max-w-[140px] shadow-sm"
        >
          <span className="text-[11px] font-semibold tracking-wide opacity-80">4d</span>
          <span className="text-[14px] font-semibold">Remember</span>
        </button>
      </div>

      <p className="text-center mt-3 text-[13px] text-[#767683]">Space 키로 Remember 선택</p>
    </div>
  )
}
