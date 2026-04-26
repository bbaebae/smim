import { describe, it, expect } from 'vitest'

describe('프로젝트 초기 세팅', () => {
  it('vitest가 정상 동작한다', () => {
    expect(true).toBe(true)
  })

  it('환경변수 키 목록이 정의되어 있다', () => {
    const requiredKeys = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'ANTHROPIC_API_KEY',
      'FIRECRAWL_API_KEY',
      'RESEND_API_KEY',
      'CRON_SECRET',
      'RAILWAY_MEDIA_SERVER_URL',
      'RAILWAY_API_KEY',
    ]
    // 키 목록 자체가 9개인지 확인 (placeholder 세팅 검증)
    expect(requiredKeys).toHaveLength(9)
  })
})
