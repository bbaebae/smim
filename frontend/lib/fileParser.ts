import { PDFParse } from 'pdf-parse'

const MAX_SIZE_BYTES = 10 * 1024 * 1024
const ALLOWED_EXTENSIONS = ['.pdf', '.txt', '.md']

export type ParseResult = {
  title: string
  text: string
}

export async function parseFile(file: File): Promise<ParseResult> {
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error(`파일 크기는 10MB 이하여야 합니다 (현재: ${(file.size / 1024 / 1024).toFixed(1)}MB)`)
  }

  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error(`지원하지 않는 파일 형식입니다. PDF, TXT, MD 파일만 지원합니다.`)
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  if (ext === '.pdf') {
    const parser = new PDFParse({ data: buffer })
    const result = await parser.getText()
    return { title: file.name, text: result.text }
  }

  return { title: file.name, text: buffer.toString('utf-8') }
}
