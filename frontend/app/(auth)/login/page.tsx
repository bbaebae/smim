'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import SocialLoginButtons, { useOAuthError } from '@/components/SocialLoginButtons'

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const oauthError = useOAuthError(searchParams.get('error'))

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault()
    setForgotLoading(true)
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    })
    setForgotSent(true)
    setForgotLoading(false)
  }

  if (forgotMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf9f8]">
        <Link href="/" className="fixed top-5 left-5 flex items-center gap-1.5 text-[13px] text-[#767683] hover:text-[#132175] transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          스밈 홈
        </Link>

        <div className="w-full max-w-sm px-6">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-[12px] bg-[#2d3a8c] flex items-center justify-center text-white font-bold text-lg mb-3">
              스
            </div>
            <div className="text-[18px] font-bold text-[#132175] tracking-tight">스밈</div>
            <div className="text-[11px] text-[#767683]">Second Brain</div>
          </div>

          {forgotSent ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-[#132175]/10 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-[28px] text-[#132175]">mark_email_read</span>
              </div>
              <p className="text-[15px] font-semibold text-[#132175] mb-2">이메일을 확인해주세요</p>
              <p className="text-[13px] text-[#767683] mb-6">비밀번호 재설정 링크를 발송했습니다.</p>
              <button
                onClick={() => { setForgotMode(false); setForgotSent(false); setForgotEmail('') }}
                className="text-[#132175] font-semibold text-[14px] hover:underline"
              >
                로그인으로 돌아가기
              </button>
            </div>
          ) : (
            <>
              <div className="text-[22px] font-bold text-[#132175] mb-2">비밀번호 재설정</div>
              <p className="text-[13px] text-[#767683] mb-6">가입한 이메일을 입력하시면 재설정 링크를 보내드립니다.</p>
              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#454651] mb-1.5">이메일</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-[#c6c5d3] rounded-lg text-[14px] text-[#1b1c1c] placeholder:text-[#767683] outline-none focus:border-[#136299] focus:ring-2 focus:ring-[#136299]/10 transition-all bg-white"
                    placeholder="you@example.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-2.5 px-4 bg-[#132175] text-white rounded-lg text-[14px] font-semibold hover:bg-[#2d3a8c] disabled:opacity-50 transition-colors"
                >
                  {forgotLoading ? '전송 중...' : '재설정 링크 보내기'}
                </button>
                <button
                  type="button"
                  onClick={() => setForgotMode(false)}
                  className="w-full text-[13px] text-[#767683] hover:text-[#132175] transition-colors"
                >
                  취소
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbf9f8]">
      <Link href="/" className="fixed top-5 left-5 flex items-center gap-1.5 text-[13px] text-[#767683] hover:text-[#132175] transition-colors">
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
        스밈 홈
      </Link>

      <div className="w-full max-w-sm px-6">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-[12px] bg-[#2d3a8c] flex items-center justify-center mb-3">
            <Image src="/logo.png" alt="스밈" width={32} height={32} style={{ objectFit: 'contain' }} />
          </div>
          <div className="text-[18px] font-bold text-[#132175] tracking-tight">스밈</div>
          <div className="text-[11px] text-[#767683]">Second Brain</div>
        </div>

        <div className="text-[22px] font-bold text-[#132175] mb-6 text-center">로그인</div>

        {oauthError && (
          <p className="mb-4 rounded-xl bg-[#ffdad6] px-4 py-3 text-[13px] text-[#ba1a1a] border border-[#ba1a1a]/20">{oauthError}</p>
        )}

        <SocialLoginButtons />

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#e4e2e2]" />
          <span className="text-[12px] text-[#767683]">또는 이메일로</span>
          <div className="h-px flex-1 bg-[#e4e2e2]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-[13px] font-medium text-[#454651] mb-1.5">이메일</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-[#c6c5d3] rounded-lg text-[14px] text-[#1b1c1c] placeholder:text-[#767683] outline-none focus:border-[#136299] focus:ring-2 focus:ring-[#136299]/10 transition-all bg-white"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[13px] font-medium text-[#454651] mb-1.5">비밀번호</label>
            <div className="relative">
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 pr-10 border border-[#c6c5d3] rounded-lg text-[14px] text-[#1b1c1c] placeholder:text-[#767683] outline-none focus:border-[#136299] focus:ring-2 focus:ring-[#136299]/10 transition-all bg-white"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#767683] hover:text-[#454651] transition-colors"
              >
                {showPw ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setForgotMode(true)}
              className="text-[12px] text-[#767683] hover:text-[#132175] transition-colors"
            >
              비밀번호를 잊으셨나요?
            </button>
          </div>

          {error && <p className="text-[13px] text-[#ba1a1a]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#132175] text-white rounded-lg text-[14px] font-semibold hover:bg-[#2d3a8c] disabled:opacity-50 transition-colors"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] text-[#767683]">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="text-[#132175] font-semibold hover:underline">회원가입</Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
