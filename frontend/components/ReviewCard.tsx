'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { calculateNextReview } from '@/lib/sm2'

export type SummaryCard = {
  title: string
  body: string
}

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
    summary_cards: SummaryCard[] | null
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

function formatInterval(days: number): string {
  if (days <= 1) return '내일'
  if (days < 7) return `${days}일 후`
  if (days < 30) return `${Math.floor(days / 7)}주 후`
  return `${Math.floor(days / 30)}개월 후`
}

function parseFallbackCards(summary: string): SummaryCard[] {
  const sections = summary.split(/◆\s+/).filter(Boolean)
  if (sections.length > 1) {
    return sections.map((s) => {
      const lines = s.trim().split('\n')
      const title = lines[0].trim()
      const body = lines
        .slice(1)
        .map((l) => l.replace(/^[•\-*]\s*/, ''))
        .filter(Boolean)
        .join(' ')
      return { title, body: body || title }
    })
  }
  return [{ title: '핵심 내용', body: summary }]
}

export default function ReviewCard({ item, onRate, loading }: Props) {
  const [cardIndex, setCardIndex] = useState(0)

  const cards: SummaryCard[] =
    item.contents.summary_cards?.length
      ? item.contents.summary_cards
      : parseFallbackCards(item.contents.summary)

  const isLastCard = cardIndex >= cards.length - 1
  const card = cards[cardIndex] ?? cards[0]
  const category = item.contents.category
  const tags = item.contents.tags ?? []

  const q0 = calculateNextReview(item.ease_factor, item.interval_days, 0)
  const q3 = calculateNextReview(item.ease_factor, item.interval_days, 3)
  const q5 = calculateNextReview(item.ease_factor, item.interval_days, 5)

  const handleNext = useCallback(() => {
    if (!isLastCard) setCardIndex((i) => i + 1)
  }, [isLastCard])

  useEffect(() => {
    setCardIndex(0)
  }, [item.content_id])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (loading) return
      if (e.code === 'Space') {
        e.preventDefault()
        if (isLastCard) {
          onRate(item.content_id, 5)
        } else {
          handleNext()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isLastCard, loading, item.content_id, onRate, handleNext])

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Main card */}
      <div className="bg-white rounded-2xl border border-[#e4e2e2]/60 ambient-shadow overflow-hidden">

        {/* Thumbnail */}
        {item.contents.thumbnail_url && (
          <div className="relative h-44 w-full overflow-hidden">
            <Image
              src={item.contents.thumbnail_url}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}

        <div className="p-8">
          {/* Meta row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex gap-2 flex-wrap">
              {category && (
                <span className="bg-[#136299]/10 text-[#136299] text-[11px] font-semibold tracking-wide uppercase px-3 py-1 rounded-full">
                  {category}
                </span>
              )}
              {tags.slice(0, 1).map((tag) => (
                <span
                  key={tag}
                  className="bg-[#efeded] text-[#454651] text-[11px] font-medium px-3 py-1 rounded-full border border-[#e4e2e2]"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <span className="text-[12px] font-semibold text-[#767683] tabular-nums shrink-0">
              {String(cardIndex + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}
            </span>
          </div>

          {/* Progress segments */}
          <div className="flex gap-1.5 mb-8">
            {cards.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  i <= cardIndex ? 'bg-[#136299]' : 'bg-[#e4e2e2]'
                }`}
              />
            ))}
          </div>

          {/* Card content */}
          <div key={cardIndex} className="card-slide-in">
            <p className="text-[10px] font-bold text-[#136299] uppercase tracking-widest mb-3">
              포인트 {cardIndex + 1}
            </p>
            <h2 className="text-[22px] font-bold text-[#1b1c1c] leading-snug mb-5">
              {card.title}
            </h2>
            <div className="h-px bg-[#f0eeeb] mb-5" />
            <p className="text-[16px] leading-relaxed text-[#454651]">{card.body}</p>
          </div>
        </div>
      </div>

      {/* Navigation / Rating */}
      <div className="mt-5">
        {!isLastCard ? (
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#767683]">Space 키로 다음으로</span>
            <button
              onClick={handleNext}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#132175] text-white rounded-xl text-[14px] font-semibold hover:bg-[#2d3a8c] transition-colors disabled:opacity-50"
            >
              다음
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-3">
              <button
                onClick={() => onRate(item.content_id, 0)}
                disabled={loading}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-3.5 rounded-xl bg-[#ffdbc8] text-[#321300] hover:bg-[#ffb68a] transition-colors disabled:opacity-50"
              >
                <span className="text-[11px] font-semibold opacity-60">{formatInterval(q0.nextInterval)}</span>
                <span className="text-[14px] font-semibold">어려움</span>
              </button>
              <button
                onClick={() => onRate(item.content_id, 3)}
                disabled={loading}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-3.5 rounded-xl bg-[#cfe5ff] text-[#001d33] hover:bg-[#98cbff] transition-colors disabled:opacity-50"
              >
                <span className="text-[11px] font-semibold opacity-60">{formatInterval(q3.nextInterval)}</span>
                <span className="text-[14px] font-semibold">보통</span>
              </button>
              <button
                onClick={() => onRate(item.content_id, 5)}
                disabled={loading}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-3.5 rounded-xl bg-[#132175] text-white hover:bg-[#2d3a8c] transition-colors disabled:opacity-50 shadow-sm"
              >
                <span className="text-[11px] font-semibold opacity-70">{formatInterval(q5.nextInterval)}</span>
                <span className="text-[14px] font-semibold">쉬움</span>
              </button>
            </div>
            <p className="text-center mt-3 text-[13px] text-[#767683]">Space 키로 쉬움 선택</p>
          </>
        )}
      </div>
    </div>
  )
}
