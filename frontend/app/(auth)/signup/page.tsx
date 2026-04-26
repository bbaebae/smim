'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import SocialLoginButtons, { useOAuthError } from '@/components/SocialLoginButtons'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const oauthError = useOAuthError(searchParams.get('error'))

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setMessage('확인 이메일을 발송했습니다. 이메일을 확인해 주세요.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbf9f8]">
      <div className="w-full max-w-sm px-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-[#2d3a8c] flex items-center justify-center text-white font-bold">
            스
          </div>
          <div>
            <div className="text-[18px] font-bold text-[#132175] tracking-tight">스밈</div>
            <div className="text-[11px] text-[#767683]">Second Brain</div>
          </div>
        </div>

        {oauthError && (
          <p className="mb-4 rounded-xl bg-[#ffdad6] px-4 py-3 text-[13px] text-[#ba1a1a] border border-[#ba1a1a]/20">{oauthError}</p>
        )}

        {message ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-[#132175]/10 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[28px] text-[#132175]">mark_email_read</span>
            </div>
            <p className="text-[14px] text-[#1b1c1c] font-medium mb-1">이메일을 확인해주세요</p>
            <p className="text-[13px] text-[#767683] mb-6">{message}</p>
            <Link href="/login" className="text-[#132175] font-semibold text-[14px] hover:underline">
              로그인으로 이동 →
            </Link>
          </div>
        ) : (
          <>
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
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-[#c6c5d3] rounded-lg text-[14px] text-[#1b1c1c] placeholder:text-[#767683] outline-none focus:border-[#136299] focus:ring-2 focus:ring-[#136299]/10 transition-all bg-white"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-[13px] font-medium text-[#454651] mb-1.5">비밀번호 확인</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-[#c6c5d3] rounded-lg text-[14px] text-[#1b1c1c] placeholder:text-[#767683] outline-none focus:border-[#136299] focus:ring-2 focus:ring-[#136299]/10 transition-all bg-white"
                  placeholder="••••••••"
                />
              </div>

              {error && <p className="text-[13px] text-[#ba1a1a]">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#132175] text-white rounded-lg text-[14px] font-semibold hover:bg-[#2d3a8c] disabled:opacity-50 transition-colors"
              >
                {loading ? '가입 중...' : '회원가입'}
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-[13px] text-[#767683]">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-[#132175] font-semibold hover:underline">로그인</Link>
        </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
