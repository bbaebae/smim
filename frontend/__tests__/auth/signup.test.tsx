import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import SignupPage from '@/app/(auth)/signup/page'

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signUp: vi.fn(),
    },
  })),
}))

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  useSearchParams: vi.fn(() => ({ get: vi.fn().mockReturnValue(null) })),
  redirect: vi.fn(),
}))

describe('SignupPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('이메일 입력 필드가 렌더된다', () => {
    render(<SignupPage />)
    expect(screen.getByLabelText(/이메일/i)).toBeInTheDocument()
  })

  it('비밀번호 입력 필드가 렌더된다', () => {
    render(<SignupPage />)
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
  })

  it('비밀번호 확인 필드가 렌더된다', () => {
    render(<SignupPage />)
    expect(screen.getByLabelText(/비밀번호 확인/i)).toBeInTheDocument()
  })

  it('회원가입 버튼이 렌더된다', () => {
    render(<SignupPage />)
    expect(screen.getByRole('button', { name: /회원가입/i })).toBeInTheDocument()
  })

  it('로그인 링크가 렌더된다', () => {
    render(<SignupPage />)
    expect(screen.getByRole('link', { name: /로그인/i })).toBeInTheDocument()
  })
})
