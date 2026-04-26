import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoginPage from '@/app/(auth)/login/page'

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: vi.fn(),
    },
  })),
}))

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  useSearchParams: vi.fn(() => ({ get: vi.fn().mockReturnValue(null) })),
  redirect: vi.fn(),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('이메일 입력 필드가 렌더된다', () => {
    render(<LoginPage />)
    expect(screen.getByLabelText(/이메일/i)).toBeInTheDocument()
  })

  it('비밀번호 입력 필드가 렌더된다', () => {
    render(<LoginPage />)
    expect(screen.getByLabelText(/비밀번호/i)).toBeInTheDocument()
  })

  it('로그인 버튼이 렌더된다', () => {
    render(<LoginPage />)
    expect(screen.getByRole('button', { name: /로그인/i })).toBeInTheDocument()
  })

  it('회원가입 링크가 렌더된다', () => {
    render(<LoginPage />)
    expect(screen.getByRole('link', { name: /회원가입/i })).toBeInTheDocument()
  })
})
