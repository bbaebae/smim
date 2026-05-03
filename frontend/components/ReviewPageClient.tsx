'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import ReviewCard, { ReviewItem } from './ReviewCard'
import Link from 'next/link'

type Props = { items: ReviewItem[] }

export default function ReviewPageClient({ items }: Props) {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleRate = useCallback(async (contentId: string, quality: number) => {
    setLoading(true)
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId, quality }),
      })
      const next = current + 1
      if (next >= items.length) {
        setDone(true)
        router.refresh()
      } else {
        setCurrent(next)
      }
    } finally {
      setLoading(false)
    }
  }, [current, items.length, router])

  if (items.length === 0 || done) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-[#132175]/10 flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-[32px] text-[#132175]">check_circle</span>
        </div>
        <h2 className="text-[20px] font-bold text-[#1b1c1c] mb-2">오늘 복습 완료!</h2>
        <p className="text-[14px] text-[#767683] mb-8">내일 또 만나요</p>
        <Link
          href="/dashboard"
          className="rounded-xl bg-[#132175] px-6 py-2.5 text-[14px] font-semibold text-white hover:bg-[#2d3a8c] transition-colors"
        >
          홈으로
        </Link>
      </div>
    )
  }

  const item = items[current]
  const progress = current / items.length

  return (
    <div>
      {/* 진행 헤더 */}
      <div className="flex items-center gap-4 mb-8">
        <span className="text-[13px] font-medium text-[#767683] shrink-0">{current + 1} / {items.length}</span>
        <div className="flex-1 h-1.5 bg-[#e4e2e2] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#136299] rounded-full transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      <ReviewCard item={item} onRate={handleRate} loading={loading} />
    </div>
  )
}
