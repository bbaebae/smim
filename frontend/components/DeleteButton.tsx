'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteButton({ contentId }: { contentId: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      const res = await fetch('/api/contents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [contentId] }),
      })
      if (res.ok) router.push('/library')
    } finally {
      setLoading(false)
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-[13px] text-[#767683]">삭제할까요?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="rounded-lg bg-red-500 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-60"
        >
          {loading ? '삭제 중...' : '삭제'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded-lg border border-[#e4e2e2] px-3 py-1.5 text-[12px] font-semibold text-[#454651] hover:bg-[#efeded] transition-colors"
        >
          취소
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1.5 rounded-lg border border-[#e4e2e2] px-3 py-1.5 text-[12px] font-semibold text-[#767683] hover:border-red-300 hover:text-red-500 transition-colors"
    >
      <span className="material-symbols-outlined text-[14px]">delete</span>
      삭제
    </button>
  )
}
