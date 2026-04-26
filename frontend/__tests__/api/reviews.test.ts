import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('@/lib/sm2', () => ({
  calculateNextReview: vi.fn(),
}))

import { GET, POST } from '@/app/api/reviews/route'
import { createClient } from '@/lib/supabase/server'
import { calculateNextReview } from '@/lib/sm2'
import { NextRequest } from 'next/server'

function makeGetRequest() {
  return new NextRequest('http://localhost/api/reviews', { method: 'GET' })
}

function makePostRequest(body: object) {
  return new NextRequest('http://localhost/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function makeSupabaseMock(overrides: Record<string, unknown> = {}) {
  return {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
    from: vi.fn(),
    ...overrides,
  }
}

describe('GET /api/reviews', () => {
  beforeEach(() => vi.clearAllMocks())

  it('인증 없으면 401을 반환한다', async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
    } as never)
    const res = await GET(makeGetRequest())
    expect(res.status).toBe(401)
  })

  it('오늘 복습할 항목을 반환한다', async () => {
    const mockRows = [
      {
        id: 'rs-1',
        content_id: 'c-1',
        next_review_at: '2026-04-25',
        interval_days: 1,
        ease_factor: 2.5,
        review_count: 0,
        contents: { title: '제목1', summary: '요약1', thumbnail_url: null, type: 'article' },
      },
    ]

    const selectMock = vi.fn().mockReturnThis()
    const lteMock = vi.fn().mockReturnThis()
    const eqMock = vi.fn().mockResolvedValue({ data: mockRows, error: null })

    vi.mocked(createClient).mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
      from: vi.fn().mockReturnValue({ select: selectMock, lte: lteMock, eq: eqMock }),
    } as never)

    const res = await GET(makeGetRequest())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body)).toBe(true)
  })
})

describe('POST /api/reviews', () => {
  beforeEach(() => vi.clearAllMocks())

  it('인증 없으면 401을 반환한다', async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
    } as never)
    const res = await POST(makePostRequest({ contentId: 'c-1', quality: 4 }))
    expect(res.status).toBe(401)
  })

  it('contentId 없으면 400을 반환한다', async () => {
    vi.mocked(createClient).mockResolvedValue(makeSupabaseMock() as never)
    const res = await POST(makePostRequest({ quality: 4 }))
    expect(res.status).toBe(400)
  })

  it('quality 범위 벗어나면 400을 반환한다', async () => {
    vi.mocked(createClient).mockResolvedValue(makeSupabaseMock() as never)
    const res = await POST(makePostRequest({ contentId: 'c-1', quality: 6 }))
    expect(res.status).toBe(400)
  })

  it('SM-2 계산 후 review_schedule을 업데이트하고 200을 반환한다', async () => {
    const scheduleRow = { id: 'rs-1', interval_days: 1, ease_factor: 2.5, review_count: 0 }
    const nextReviewAt = new Date('2026-04-26')

    vi.mocked(calculateNextReview).mockReturnValue({
      nextInterval: 2,
      nextEase: 2.6,
      nextReviewAt,
    })

    const selectSingleMock = vi.fn().mockResolvedValue({ data: scheduleRow, error: null })
    const updateMock = vi.fn().mockResolvedValue({ error: null })

    vi.mocked(createClient).mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
      from: vi.fn().mockImplementation((table: string) => {
        if (table === 'review_schedule') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockImplementation(function(this: unknown) { return this }),
            single: vi.fn().mockImplementation(() => selectSingleMock()),
            update: vi.fn().mockReturnValue({ eq: vi.fn().mockImplementation(() => updateMock()) }),
          }
        }
        return {}
      }),
    } as never)

    const res = await POST(makePostRequest({ contentId: 'c-1', quality: 4 }))
    expect(res.status).toBe(200)
    expect(calculateNextReview).toHaveBeenCalledWith(2.5, 1, 4)
  })
})
