'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  isPro: boolean
}

export default function PlanActions({ isPro }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function handleCheckout(plan: 'pro' | 'annual') {
    setLoading(plan)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setLoading(null)
    }
  }

  async function handlePortal() {
    setLoading('portal')
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setLoading(null)
    }
  }

  if (isPro) {
    return (
      <button
        onClick={handlePortal}
        disabled={loading === 'portal'}
        className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-[13px] font-semibold text-white hover:bg-white/20 transition-colors disabled:opacity-60"
      >
        {loading === 'portal' ? (
          <span className="material-symbols-outlined text-[15px] animate-spin">progress_activity</span>
        ) : (
          <span className="material-symbols-outlined text-[15px]">manage_accounts</span>
        )}
        구독 관리
      </button>
    )
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => handleCheckout('pro')}
        disabled={!!loading}
        className="block w-full text-center rounded-lg bg-[#132175] px-4 py-2.5 text-[13px] font-bold text-white hover:bg-[#2d3a8c] transition-colors disabled:opacity-60"
      >
        {loading === 'pro' ? '처리 중...' : 'Pro로 업그레이드 →'}
      </button>
      <button
        onClick={() => handleCheckout('annual')}
        disabled={!!loading}
        className="block w-full text-center rounded-lg border border-[#132175] px-4 py-2.5 text-[13px] font-bold text-[#132175] hover:bg-[#132175] hover:text-white transition-colors disabled:opacity-60"
      >
        {loading === 'annual' ? '처리 중...' : '연간 플랜으로 29% 절약'}
      </button>
    </div>
  )
}
