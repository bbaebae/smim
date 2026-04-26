import Anthropic from '@anthropic-ai/sdk'

export type AnalysisResult = {
  summary: string
  category: string
  tags: string[]
}

const CATEGORIES = ['기술/개발', '비즈니스/마케팅', '투자/경제', '라이프스타일', '기타']

const FALLBACK: AnalysisResult = {
  summary: '',
  category: '기타',
  tags: [],
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function analyzeContent(text: string, type: string): Promise<AnalysisResult> {
  const message = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `다음 글을 읽고 JSON으로만 응답해. 다른 텍스트 없이 JSON만:
{
  "summary": "3줄 핵심 요약",
  "category": "${CATEGORIES.join(' | ')} 중 하나",
  "tags": ["태그1", "태그2", "태그3"]
}
글: ${text.slice(0, 8000)}`,
      },
    ],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const parsed = JSON.parse(raw)
    return {
      summary: parsed.summary ?? '',
      category: CATEGORIES.includes(parsed.category) ? parsed.category : '기타',
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    }
  } catch {
    return { ...FALLBACK, summary: raw.slice(0, 300) }
  }
}
