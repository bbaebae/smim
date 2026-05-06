'use client'

import { useState } from 'react'

type Props = {
  email: string
  initialEmailNotify: boolean
}

export default function SettingsClient({ email, initialEmailNotify }: Props) {
  const [emailNotify, setEmailNotify] = useState(initialEmailNotify)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  async function handleEmailToggle() {
    const next = !emailNotify
    setEmailNotify(next)
    setSaving(true)
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_notify: next }),
    })
    setSaving(false)
    setMsg(next ? '이메일 알림이 켜졌습니다.' : '이메일 알림이 꺼졌습니다.')
    setTimeout(() => setMsg(''), 2500)
  }

  return (
    <div className="min-h-screen bg-[#f5f3f3] p-6 md:p-10">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <h1 className="text-[22px] font-bold text-[#1b1c1c] tracking-tight">마이페이지</h1>
          <p className="text-[14px] text-[#767683] mt-1">{email}</p>
        </div>

        <section className="bg-white rounded-2xl border border-[#e4e2e2] overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div className="px-6 py-4 border-b border-[#f0eeee]">
            <h2 className="text-[15px] font-semibold text-[#1b1c1c]">복습 알림</h2>
            <p className="text-[13px] text-[#767683] mt-0.5">이메일로 복습 일정을 안내해 드립니다.</p>
          </div>

          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-[#1b1c1c]">이메일 알림</p>
              <p className="text-[12px] text-[#a0a0b0] mt-0.5">복습 콘텐츠를 이메일로 받아보세요</p>
            </div>
            <button
              onClick={handleEmailToggle}
              disabled={saving}
              aria-label="이메일 알림 토글"
              className={[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none',
                emailNotify ? 'bg-[#132175]' : 'bg-[#d4d3db]',
              ].join(' ')}
            >
              <span className={[
                'inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform',
                emailNotify ? 'translate-x-5.5' : 'translate-x-0.5',
              ].join(' ')} />
            </button>
          </div>
        </section>

        {msg && (
          <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 bg-[#1b1c1c] text-white text-[13px] font-medium px-4 py-2.5 rounded-xl shadow-lg whitespace-nowrap z-50">
            {msg}
          </div>
        )}
      </div>
    </div>
  )
}
