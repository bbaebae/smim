import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockCreate } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
}))

vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: class MockAnthropic {
      messages = { create: mockCreate }
    },
  }
})

import { analyzeContent } from '@/lib/ai'

describe('analyzeContent', () => {
  beforeEach(() => {
    mockCreate.mockReset()
  })

  it('정상 응답 시 summary/category/tags를 반환한다', async () => {
    mockCreate.mockResolvedValue({
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            summary: '테스트 요약입니다.',
            category: '기술/개발',
            tags: ['AI', '머신러닝', '딥러닝'],
          }),
        },
      ],
    })

    const result = await analyzeContent('테스트 텍스트', 'article')

    expect(result.summary).toBe('테스트 요약입니다.')
    expect(result.category).toBe('기술/개발')
    expect(result.tags).toEqual(['AI', '머신러닝', '딥러닝'])
  })

  it('JSON 파싱 실패 시 category를 "기타"로 반환한다', async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: '파싱 불가 응답' }],
    })

    const result = await analyzeContent('테스트 텍스트', 'article')

    expect(result.category).toBe('기타')
  })
})
