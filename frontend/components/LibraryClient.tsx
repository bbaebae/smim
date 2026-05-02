'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import CategoryFilter from './CategoryFilter'
import ContentCard, { ContentItem } from './ContentCard'

type Props = { contents: ContentItem[] }

export default function LibraryClient({ contents: initialContents }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [contents, setContents] = useState(initialContents)
  const [category, setCategory] = useState('전체')
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)

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

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map((c) => c.id)))
    }
  }

  function exitEditing() {
    setEditing(false)
    setSelectedIds(new Set())
  }

  async function handleDelete() {
    if (selectedIds.size === 0) return
    setDeleting(true)
    try {
      const res = await fetch('/api/contents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      })
      if (res.ok) {
        setContents((prev) => prev.filter((c) => !selectedIds.has(c.id)))
        setSelectedIds(new Set())
        setEditing(false)
        startTransition(() => router.refresh())
      }
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      {/* 검색 + 편집 버튼 */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#767683]">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="제목, 요약, 태그 검색"
            className="w-full pl-10 pr-4 py-2.5 border border-[#c6c5d3] rounded-xl text-[14px] text-[#1b1c1c] placeholder:text-[#767683] outline-none focus:border-[#136299] focus:ring-2 focus:ring-[#136299]/10 transition-all bg-white"
          />
        </div>
        <button
          onClick={editing ? exitEditing : () => setEditing(true)}
          className={`shrink-0 rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition-colors ${
            editing
              ? 'border-[#132175] text-[#132175] bg-[#132175]/5'
              : 'border-[#e4e2e2] text-[#454651] bg-white hover:border-[#767683]'
          }`}
        >
          {editing ? '취소' : '편집'}
        </button>
      </div>

      {/* 카테고리 필터 */}
      <CategoryFilter selected={category} onChange={setCategory} />

      {/* 결과 카운트 + 편집 모드 액션바 */}
      <div className="flex items-center justify-between mt-3 mb-4 min-h-[28px]">
        <p className="text-[12px] text-[#767683]">{filtered.length}개</p>
        {editing && (
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSelectAll}
              className="text-[12px] text-[#767683] hover:text-[#132175] transition-colors"
            >
              {selectedIds.size === filtered.length && filtered.length > 0 ? '전체 해제' : '전체 선택'}
            </button>
            {selectedIds.size > 0 && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {deleting ? (
                  <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[14px]">delete</span>
                )}
                {deleting ? '삭제 중...' : `${selectedIds.size}개 삭제`}
              </button>
            )}
          </div>
        )}
      </div>

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
          filtered.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              selectable={editing}
              selected={selectedIds.has(item.id)}
              onToggle={toggleSelect}
            />
          ))
        )}
      </div>
    </>
  )
}
