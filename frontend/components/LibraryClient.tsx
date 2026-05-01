'use client'

import { useState } from 'react'
import CategoryFilter from './CategoryFilter'
import ContentCard, { ContentItem } from './ContentCard'

type Props = { contents: ContentItem[] }

export default function LibraryClient({ contents }: Props) {
  const [category, setCategory] = useState('전체')
  const [query, setQuery] = useState('')

  const filtered = contents
    .filter((c) => category === '전체' || c.category === category)
    .filter((c) => {
      if (!query) return true
      const q = query.toLowerCase()
      return (
        c.title.toLowerCase().includes(q) ||
        (c.summary ?? '').toLowerCase().includes(q) ||
        (c.tags ?? []).some((t) => t.toLowerCase().includes(q))
      )
    })

  return (
    <>
      {/* 검색 */}
      <div className="relative mb-4">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#767683]">search</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="제목, 요약, 태그 검색"
          className="w-full pl-10 pr-4 py-2.5 border border-[#c6c5d3] rounded-xl text-[14px] text-[#1b1c1c] placeholder:text-[#767683] outline-none focus:border-[#136299] focus:ring-2 focus:ring-[#136299]/10 transition-all bg-white"
        />
      </div>

      {/* 카테고리 필터 */}
      <CategoryFilter selected={category} onChange={setCategory} />

      {/* 결과 카운트 */}
      <p className="text-[12px] text-[#767683] mt-3 mb-4">
        {filtered.length}개
      </p>

      {/* 목록 */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-[40px] text-[#c6c5d3] block mb-3">
              {query ? 'search_off' : 'inbox'}
            </span>
            <p className="text-[14px] text-[#767683]">
              {query
                ? `"${query}"에 해당하는 콘텐츠가 없습니다`
                : category === '전체'
                ? '저장된 콘텐츠가 없습니다'
                : `${category} 콘텐츠가 없습니다`}
            </p>
          </div>
        ) : (
          filtered.map((item) => <ContentCard key={item.id} item={item} />)
        )}
      </div>
    </>
  )
}
