import { describe, it, expect, vi } from 'vitest'
import { isProtectedRoute } from '@/lib/auth/route-utils'

describe('isProtectedRoute', () => {
  it('/dashboard는 보호된 라우트다', () => {
    expect(isProtectedRoute('/dashboard')).toBe(true)
  })

  it('/review는 보호된 라우트다', () => {
    expect(isProtectedRoute('/review')).toBe(true)
  })

  it('/contents/xxx는 보호된 라우트다', () => {
    expect(isProtectedRoute('/contents/some-id')).toBe(true)
  })

  it('/login은 보호된 라우트가 아니다', () => {
    expect(isProtectedRoute('/login')).toBe(false)
  })

  it('/signup은 보호된 라우트가 아니다', () => {
    expect(isProtectedRoute('/signup')).toBe(false)
  })

  it('/ (루트)는 보호된 라우트가 아니다', () => {
    expect(isProtectedRoute('/')).toBe(false)
  })
})
