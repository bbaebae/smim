'use client'

import { useState } from 'react'

type Props = {
  summary: string
  fullText: string | null
}

const TABS = [
  { id: 'summary', label: 'AI 요약', icon: 'auto_awesome' },
  { id: 'original', label: '원문 전체', icon: 'article' },
  { id: 'chat', label: 'AI 채팅', icon: 'chat_bubble', soon: true },
]

export default function ContentTabs({ summary, fullText }: Props) {
  const [active, setActive] = useState<'summary' | 'original'>('summary')

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
        <div className="rounded-xl bg-white border border-[#e4e2e2] p-5 ambient-shadow">
          {fullText ? (
            <p className="text-[14px] leading-relaxed text-[#454651] whitespace-pre-wrap">{fullText}</p>
          ) : (
            <p className="text-[13px] text-[#767683]">원문 텍스트가 없습니다.</p>
          )}
        </div>
      )}
    </div>
  )
}
