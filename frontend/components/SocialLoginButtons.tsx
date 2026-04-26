'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const ERROR_MESSAGES: Record<string, string> = {
  email_required: '이메일 제공에 동의해야 로그인할 수 있습니다.',
  oauth_failed: 'OAuth 로그인에 실패했습니다.',
  naver_auth_failed: '네이버 로그인에 실패했습니다.',
  invalid_state: '보안 오류가 발생했습니다. 다시 시도해주세요.',
}

export function useOAuthError(searchParamsError?: string | null) {
  return searchParamsError ? ERROR_MESSAGES[searchParamsError] ?? '로그인 중 오류가 발생했습니다.' : null
}

const btnBase =
  'flex w-full items-center justify-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]'

export default function SocialLoginButtons() {
  const [error, setError] = useState('')

  async function signInWithGoogle() {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      })
      if (error) setError(error.message)
    } catch {
      setError('Google 로그인 중 오류가 발생했습니다.')
    }
  }

  async function signInWithKakao() {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) setError(error.message)
    } catch {
      setError('카카오 로그인 중 오류가 발생했습니다.')
    }
  }

  function signInWithNaver() {
    window.location.href = '/auth/naver'
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-lg bg-[#ffdad6] px-3 py-2 text-[13px] text-[#ba1a1a]">{error}</p>
      )}

      <button
        onClick={signInWithGoogle}
        className={`${btnBase} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50`}
      >
        <GoogleIcon />
        Google로 계속하기
      </button>

      <button
        onClick={signInWithKakao}
        className={`${btnBase} bg-[#FEE500] text-[#191919] hover:bg-[#f0d800]`}
      >
        <KakaoIcon />
        카카오로 계속하기
      </button>

      <button
        onClick={signInWithNaver}
        className={`${btnBase} bg-[#03C75A] text-white hover:bg-[#02b350]`}
      >
        <NaverIcon />
        네이버로 계속하기
      </button>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.25-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
  )
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#191919" d="M9 1.5C4.858 1.5 1.5 4.134 1.5 7.378c0 2.07 1.376 3.888 3.448 4.923L4.1 14.73a.281.281 0 0 0 .432.296l3.43-2.291c.34.033.685.05 1.038.05 4.142 0 7.5-2.634 7.5-5.878S13.142 1.5 9 1.5z"/>
    </svg>
  )
}

function NaverIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="white" d="M10.26 9.27 7.5 5H5v8h2.74L10.5 8.73V13H13V5h-2.74z"/>
    </svg>
  )
}
