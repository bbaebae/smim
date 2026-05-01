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

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const oauthError = useOAuthError(searchParams.get('error'))

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
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

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    })

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
      <Link href="/" className="fixed top-5 left-5 flex items-center gap-1.5 text-[13px] text-[#767683] hover:text-[#132175] transition-colors">
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
        스밈 홈
      </Link>

      <div className="w-full max-w-sm px-6 py-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-[12px] bg-[#2d3a8c] flex items-center justify-center mb-3">
            <Image src="/logo.png" alt="스밈" width={32} height={32} style={{ objectFit: 'contain' }} />
          </div>
          <div className="text-[18px] font-bold text-[#132175] tracking-tight">스밈</div>
          <div className="text-[11px] text-[#767683]">Second Brain</div>
        </div>

        <div className="text-[22px] font-bold text-[#132175] mb-6 text-center">회원가입</div>

        {oauthError && (
          <p className="mb-4 rounded-xl bg-[#ffdad6] px-4 py-3 text-[13px] text-[#ba1a1a] border border-[#ba1a1a]/20">{oauthError}</p>
        )}

        {message ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-[#132175]/10 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[28px] text-[#132175]">mark_email_read</span>
            </div>
            <p className="text-[15px] font-semibold text-[#132175] mb-2">이메일을 확인해주세요</p>
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
                <label htmlFor="name" className="block text-[13px] font-medium text-[#454651] mb-1.5">이름 (선택)</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#c6c5d3] rounded-lg text-[14px] text-[#1b1c1c] placeholder:text-[#767683] outline-none focus:border-[#136299] focus:ring-2 focus:ring-[#136299]/10 transition-all bg-white"
                  placeholder="홍길동"
                />
              </div>

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
                    placeholder="6자 이상"
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

              <div>
                <label htmlFor="confirmPassword" className="block text-[13px] font-medium text-[#454651] mb-1.5">비밀번호 확인</label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPw ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 pr-10 border border-[#c6c5d3] rounded-lg text-[14px] text-[#1b1c1c] placeholder:text-[#767683] outline-none focus:border-[#136299] focus:ring-2 focus:ring-[#136299]/10 transition-all bg-white"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#767683] hover:text-[#454651] transition-colors"
                  >
                    {showConfirmPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {error && <p className="text-[13px] text-[#ba1a1a]">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#132175] text-white rounded-lg text-[14px] font-semibold hover:bg-[#2d3a8c] disabled:opacity-50 transition-colors"
              >
                {loading ? '가입 중...' : '회원가입'}
              </button>

              <p className="text-[11px] text-[#767683] text-center leading-relaxed">
                가입 시 스밈의{' '}
                <a href="#" className="underline hover:text-[#132175]">이용약관</a>
                {' '}및{' '}
                <a href="#" className="underline hover:text-[#132175]">개인정보처리방침</a>
                에 동의하는 것으로 간주됩니다.
              </p>
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
