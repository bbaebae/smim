'use client'

import { useState } from 'react'

type Props = {
  summary: string
  fullText: string | null
  contentType?: string
}

const TABS = [
  { id: 'summary', label: 'AI 요약', icon: 'auto_awesome' },
  { id: 'original', label: '원문 전체', icon: 'article' },
  { id: 'chat', label: 'AI 채팅', icon: 'chat_bubble', soon: true },
]

type Section = { time: string; content: string; estimated?: boolean }

function parseTimestampedTranscript(text: string): Section[] {
  return text
    .split('\n')
    .map((line) => {
      const match = line.match(/^\[(\d{2}:\d{2})\] (.+)$/)
      return match ? { time: match[1], content: match[2] } : null
    })
    .filter(Boolean) as Section[]
}

// 한국어 발화 속도 약 300자/분 기준 추정 타임라인 생성
function estimateTimeline(text: string): Section[] {
  const CHARS_PER_MINUTE = 300
  const sentences = text.match(/[^.!?。\n]+[.!?。\n]*/g)?.map(s => s.trim()).filter(Boolean) ?? [text]
  const sections: Section[] = []
  let current = ''
  let totalChars = 0
  let minute = 0

  for (const sentence of sentences) {
    current += (current ? ' ' : '') + sentence
    totalChars += sentence.length
    if (totalChars >= CHARS_PER_MINUTE) {
      sections.push({
        time: `${String(minute).padStart(2, '0')}:00`,
        content: current.trim(),
        estimated: true,
      })
      minute++
      current = ''
      totalChars = 0
    }
  }
  if (current.trim()) {
    sections.push({ time: `${String(minute).padStart(2, '0')}:00`, content: current.trim(), estimated: true })
  }
  return sections
}

export default function ContentTabs({ summary, fullText, contentType }: Props) {
  const [active, setActive] = useState<'summary' | 'original'>('summary')

  const isYoutube = contentType === 'youtube'
  const hasTimestamps = isYoutube && !!fullText && /^\[\d{2}:\d{2}\]/.test(fullText)
  const sections: Section[] | null = hasTimestamps
    ? parseTimestampedTranscript(fullText!)
    : isYoutube && fullText
    ? estimateTimeline(fullText)
    : null
  const isEstimated = isYoutube && !hasTimestamps && !!fullText

  return (
    <div>
      {/* 탭 바 */}
      <div className="flex gap-1 mb-4 p-1 bg-[#efeded] rounded-xl">
        {TABS.map((tab) => {
          const isActive = active === tab.id
          const isSoon = tab.soon

          return (
            <button
              key={tab.id}
              onClick={() => !isSoon && setActive(tab.id as 'summary' | 'original')}
              disabled={isSoon}
              className={[
                'flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-[13px] font-medium transition-all',
                isActive
                  ? 'bg-white text-[#132175] shadow-sm'
                  : isSoon
                  ? 'text-[#c6c5d3] cursor-not-allowed'
                  : 'text-[#767683] hover:text-[#454651]',
              ].join(' ')}
            >
              <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
              {tab.label}
              {isSoon && (
                <span className="rounded-full bg-[#dfe0ff] px-1.5 py-0.5 text-[9px] font-semibold text-[#132175] leading-none">
                  준비중
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* AI 요약 */}
      {active === 'summary' && (
        <div className="rounded-xl bg-[#132175]/5 border border-[#132175]/10 p-5">
          <p className="text-[14px] leading-relaxed text-[#454651] whitespace-pre-wrap">{summary}</p>
        </div>
      )}

      {/* 원문 전체 */}
      {active === 'original' && (
        <div className="rounded-xl bg-white border border-[#e4e2e2] ambient-shadow overflow-hidden">
          {sections ? (
            <>
              {isEstimated && (
                <div className="px-5 py-3 border-b border-[#f0eeee] bg-[#fafafa] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-[#c6c5d3]">info</span>
                  <span className="text-[11px] text-[#aaa9b5]">타임스탬프가 없는 콘텐츠입니다. 발화 속도 기준 추정 시간대를 표시합니다.</span>
                </div>
              )}
              <div className="divide-y divide-[#f0eeee]">
                {sections.map((section, i) => (
                  <div key={i} className="px-5 py-4 flex gap-4">
                    <span className={[
                      'inline-flex items-center justify-center flex-shrink-0 mt-0.5 rounded-md px-2 py-1 text-[11px] font-mono font-semibold h-fit',
                      section.estimated
                        ? 'bg-[#f5f4f4] text-[#a0a0b0]'
                        : 'bg-[#132175]/8 text-[#132175]',
                    ].join(' ')}>
                      {section.time}
                    </span>
                    <p className="text-[14px] leading-relaxed text-[#454651]">{section.content}</p>
                  </div>
                ))}
              </div>
            </>
          ) : fullText ? (
            <p className="p-5 text-[14px] leading-relaxed text-[#454651] whitespace-pre-wrap">{fullText}</p>
          ) : (
            <p className="p-5 text-[13px] text-[#767683]">원문 텍스트가 없습니다.</p>
          )}
        </div>
      )}
    </div>
  )
}
