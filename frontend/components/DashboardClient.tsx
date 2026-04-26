'use client'

import { useState } from 'react'
import CategoryFilter from './CategoryFilter'
import ContentCard, { ContentItem } from './ContentCard'
import AddContentModal from './AddContentModal'

type Props = { contents: ContentItem[] }

export default function DashboardClient({ contents }: Props) {
  const [category, setCategory] = useState('전체')
  const [showModal, setShowModal] = useState(false)

  const filtered =
    category === '전체' ? contents : contents.filter((c) => c.category === category)

  return (
    <>
      <CategoryFilter selected={category} onChange={setCategory} />

      <div className="mt-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-[40px] text-[#c6c5d3] block mb-3">inbox</span>
            <p className="text-[14px] text-[#767683]">
              {category === '전체' ? '저장된 콘텐츠가 없습니다' : `${category} 콘텐츠가 없습니다`}
            </p>
          </div>
        ) : (
          filtered.map((item) => <ContentCard key={item.id} item={item} />)
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 right-6 md:bottom-8 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-[#132175] text-white text-[14px] font-semibold shadow-lg hover:bg-[#2d3a8c] transition-colors"
        aria-label="콘텐츠 추가"
      >
        <span className="material-symbols-outlined text-[20px]">add</span>
        <span className="hidden sm:inline">새 콘텐츠</span>
      </button>

      {showModal && <AddContentModal onClose={() => setShowModal(false)} />}
    </>
  )
}
