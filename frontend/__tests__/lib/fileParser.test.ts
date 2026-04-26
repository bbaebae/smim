import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockGetText } = vi.hoisted(() => ({ mockGetText: vi.fn() }))

vi.mock('pdf-parse', () => ({
  PDFParse: class MockPDFParse {
    getText = mockGetText
  },
}))

import { parseFile } from '@/lib/fileParser'

function makeFile(name: string, content: string, type: string): File {
  return new File([content], name, { type })
}

describe('parseFile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('.txt 파일을 텍스트로 읽는다', async () => {
    const file = makeFile('test.txt', '안녕하세요', 'text/plain')
    const result = await parseFile(file)
    expect(result.title).toBe('test.txt')
    expect(result.text).toBe('안녕하세요')
  })

  it('.md 파일을 텍스트로 읽는다', async () => {
    const file = makeFile('note.md', '# 제목\n내용', 'text/markdown')
    const result = await parseFile(file)
    expect(result.title).toBe('note.md')
    expect(result.text).toBe('# 제목\n내용')
  })

  it('.pdf 파일에서 텍스트를 추출한다', async () => {
    mockGetText.mockResolvedValue({ text: 'PDF 내용입니다' })
    const file = makeFile('doc.pdf', '%PDF-1.4', 'application/pdf')
    const result = await parseFile(file)
    expect(result.title).toBe('doc.pdf')
    expect(result.text).toBe('PDF 내용입니다')
  })

  it('지원하지 않는 확장자는 에러를 throw한다', async () => {
    const file = makeFile('image.jpg', 'binary', 'image/jpeg')
    await expect(parseFile(file)).rejects.toThrow('지원하지 않는 파일 형식')
  })

  it('10MB 초과 파일은 에러를 throw한다', async () => {
    const largeContent = 'x'.repeat(11 * 1024 * 1024)
    const file = makeFile('big.txt', largeContent, 'text/plain')
    await expect(parseFile(file)).rejects.toThrow('파일 크기')
  })
})
