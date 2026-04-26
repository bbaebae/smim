import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('youtube-transcript', () => ({
  YoutubeTranscript: {
    fetchTranscript: vi.fn(),
  },
}))

import { YoutubeTranscript } from 'youtube-transcript'
import { getYoutubeTranscript, extractVideoId } from '@/lib/youtube'

describe('extractVideoId', () => {
  it('일반 youtube.com URL에서 videoId를 추출한다', () => {
    expect(extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('youtu.be 단축 URL에서 videoId를 추출한다', () => {
    expect(extractVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('파라미터가 여러 개인 URL에서도 videoId를 추출한다', () => {
    expect(extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10s')).toBe('dQw4w9WgXcQ')
  })

  it('잘못된 URL에서는 null을 반환한다', () => {
    expect(extractVideoId('https://example.com')).toBeNull()
  })
})

describe('getYoutubeTranscript', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('자막 배열을 합쳐서 텍스트로 반환한다', async () => {
    vi.mocked(YoutubeTranscript.fetchTranscript).mockResolvedValue([
      { text: '안녕하세요', duration: 1, offset: 0 },
      { text: '반갑습니다', duration: 1, offset: 1 },
    ] as never)

    const result = await getYoutubeTranscript('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    expect(result).toBe('안녕하세요 반갑습니다')
  })

  it('자막이 없으면 에러를 throw한다', async () => {
    vi.mocked(YoutubeTranscript.fetchTranscript).mockRejectedValue(new Error('no transcript'))

    await expect(
      getYoutubeTranscript('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    ).rejects.toThrow('자막 없음')
  })

  it('유효하지 않은 URL이면 에러를 throw한다', async () => {
    await expect(getYoutubeTranscript('https://example.com')).rejects.toThrow()
  })
})
