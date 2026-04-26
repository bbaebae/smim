import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/scraper', () => ({
  scrapeArticle: vi.fn(),
}))

vi.mock('@/lib/ai', () => ({
  analyzeContent: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('@/lib/youtube', () => ({
  getYoutubeTranscript: vi.fn(),
  extractVideoId: vi.fn(),
  getYoutubeThumbnail: vi.fn(),
}))

vi.mock('@/lib/fileParser', () => ({
  parseFile: vi.fn(),
}))

import { POST } from '@/app/api/contents/route'
import { scrapeArticle } from '@/lib/scraper'
import { analyzeContent } from '@/lib/ai'
import { createClient } from '@/lib/supabase/server'
import { getYoutubeTranscript, extractVideoId, getYoutubeThumbnail } from '@/lib/youtube'
import { parseFile } from '@/lib/fileParser'
import { NextRequest } from 'next/server'

function makeRequest(body: object) {
  return new NextRequest('http://localhost/api/contents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function makeSupabaseMock() {
  const singleMock = vi.fn().mockResolvedValue({ data: { id: 'content-1' }, error: null })
  const selectChainMock = vi.fn().mockReturnValue({ single: singleMock })
  const contentsInsertMock = vi.fn().mockReturnValue({ select: selectChainMock })
  const scheduleInsertMock = vi.fn().mockResolvedValue({ error: null })
  return {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
    from: vi.fn().mockImplementation((table: string) => {
      if (table === 'review_schedule') return { insert: scheduleInsertMock }
      return { insert: contentsInsertMock }
    }),
  }
}

function makeAnalysisMock() {
  vi.mocked(analyzeContent).mockResolvedValue({
    summary: '요약',
    category: '기술/개발',
    tags: ['tag1'],
  })
}

describe('POST /api/contents', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('인증 없으면 401을 반환한다', async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
    } as never)
    const res = await POST(makeRequest({ type: 'article', url: 'https://example.com' }))
    expect(res.status).toBe(401)
  })

  it('type 없으면 400을 반환한다', async () => {
    vi.mocked(createClient).mockResolvedValue(makeSupabaseMock() as never)
    const res = await POST(makeRequest({ url: 'https://example.com' }))
    expect(res.status).toBe(400)
  })

  it('지원하지 않는 type은 400을 반환한다', async () => {
    vi.mocked(createClient).mockResolvedValue(makeSupabaseMock() as never)
    const res = await POST(makeRequest({ type: 'video' }))
    expect(res.status).toBe(400)
  })

  describe('article', () => {
    it('article type + url → 201을 반환한다', async () => {
      vi.mocked(scrapeArticle).mockResolvedValue({ title: '테스트 제목', markdown: '테스트 본문' })
      makeAnalysisMock()
      vi.mocked(createClient).mockResolvedValue(makeSupabaseMock() as never)

      const res = await POST(makeRequest({ url: 'https://example.com', type: 'article' }))
      expect(res.status).toBe(201)
    })

    it('article type이지만 url 없으면 400을 반환한다', async () => {
      vi.mocked(createClient).mockResolvedValue(makeSupabaseMock() as never)
      const res = await POST(makeRequest({ type: 'article' }))
      expect(res.status).toBe(400)
    })

    it('scrapeArticle 실패 시 500을 반환한다', async () => {
      vi.mocked(scrapeArticle).mockRejectedValue(new Error('스크래핑 실패'))
      vi.mocked(createClient).mockResolvedValue(makeSupabaseMock() as never)

      const res = await POST(makeRequest({ url: 'https://example.com', type: 'article' }))
      expect(res.status).toBe(500)
    })
  })

  describe('youtube', () => {
    it('youtube type + url → 201을 반환한다', async () => {
      vi.mocked(getYoutubeTranscript).mockResolvedValue('자막 텍스트')
      vi.mocked(extractVideoId).mockReturnValue('dQw4w9WgXcQ')
      vi.mocked(getYoutubeThumbnail).mockReturnValue('https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg')
      makeAnalysisMock()
      vi.mocked(createClient).mockResolvedValue(makeSupabaseMock() as never)

      const res = await POST(makeRequest({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', type: 'youtube' }))
      expect(res.status).toBe(201)
    })

    it('youtube url 없으면 400을 반환한다', async () => {
      vi.mocked(createClient).mockResolvedValue(makeSupabaseMock() as never)
      const res = await POST(makeRequest({ type: 'youtube' }))
      expect(res.status).toBe(400)
    })

    it('자막 없으면 400을 반환한다', async () => {
      vi.mocked(getYoutubeTranscript).mockRejectedValue(new Error('자막 없음'))
      vi.mocked(createClient).mockResolvedValue(makeSupabaseMock() as never)

      const res = await POST(makeRequest({ url: 'https://www.youtube.com/watch?v=abc', type: 'youtube' }))
      expect(res.status).toBe(400)
    })
  })

  describe('text', () => {
    it('text type + title + text → 201을 반환한다', async () => {
      makeAnalysisMock()
      vi.mocked(createClient).mockResolvedValue(makeSupabaseMock() as never)

      const res = await POST(makeRequest({ type: 'text', title: '제목', text: '본문 내용' }))
      expect(res.status).toBe(201)
    })

    it('text type이지만 title 없으면 400을 반환한다', async () => {
      vi.mocked(createClient).mockResolvedValue(makeSupabaseMock() as never)
      const res = await POST(makeRequest({ type: 'text', text: '본문만' }))
      expect(res.status).toBe(400)
    })

    it('text type이지만 text 없으면 400을 반환한다', async () => {
      vi.mocked(createClient).mockResolvedValue(makeSupabaseMock() as never)
      const res = await POST(makeRequest({ type: 'text', title: '제목만' }))
      expect(res.status).toBe(400)
    })
  })
})
