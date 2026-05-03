'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  contentId: string
  initialTitle: string
  initialCategory: string
  initialTags: string[]
  userCategories: string[]
}

export default function ContentMeta({
  contentId,
  initialTitle,
  initialCategory,
  initialTags,
  userCategories: initialUserCategories,
}: Props) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  const [title, setTitle] = useState(initialTitle)
  const [category, setCategory] = useState(initialCategory)
  const [tags, setTags] = useState<string[]>(initialTags)

  const [editTitle, setEditTitle] = useState(initialTitle)
  const [editCategory, setEditCategory] = useState(initialCategory)
  const [editTags, setEditTags] = useState<string[]>(initialTags)
  const [categories, setCategories] = useState<string[]>(() => {
    const all = new Set([...initialUserCategories, initialCategory])
    return [...all].sort()
  })

  const [newTag, setNewTag] = useState('')
  const [addingCategory, setAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [saving, setSaving] = useState(false)

  function openEdit() {
    setEditTitle(title)
    setEditCategory(category)
    setEditTags([...tags])
    setIsEditing(true)
  }

  function handleCancel() {
    setNewTag('')
    setAddingCategory(false)
    setNewCategory('')
    setIsEditing(false)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/contents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: contentId, title: editTitle, category: editCategory, tags: editTags }),
      })
      if (res.ok) {
        setTitle(editTitle)
        setCategory(editCategory)
        setTags(editTags)
        setIsEditing(false)
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  function removeTag(tag: string) {
    setEditTags(editTags.filter((t) => t !== tag))
  }

  function addTag() {
    const trimmed = newTag.trim().replace(/^#/, '').toLowerCase()
    if (trimmed && !editTags.includes(trimmed)) {
      setEditTags([...editTags, trimmed])
    }
    setNewTag('')
  }

  function confirmNewCategory() {
    const trimmed = newCategory.trim()
    if (trimmed) {
      if (!categories.includes(trimmed)) {
        setCategories([...categories, trimmed].sort())
      }
      setEditCategory(trimmed)
    }
    setNewCategory('')
    setAddingCategory(false)
  }

  if (isEditing) {
    return (
      <div className="rounded-xl border border-[#e4e2e2] bg-white p-5 mb-6 ambient-shadow space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold text-[#1b1c1c]">콘텐츠 편집</p>
          <button onClick={handleCancel} className="text-[#767683] hover:text-[#1b1c1c] transition-colors">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* 제목 */}
        <div>
          <label className="block text-[11px] font-semibold text-[#767683] mb-1.5 uppercase tracking-wide">제목</label>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2.5 border border-[#c6c5d3] rounded-lg text-[14px] text-[#1b1c1c] outline-none focus:border-[#136299] focus:ring-2 focus:ring-[#136299]/10 transition-all"
          />
        </div>

        {/* 카테고리 */}
        <div>
          <label className="block text-[11px] font-semibold text-[#767683] mb-1.5 uppercase tracking-wide">카테고리</label>
          {addingCategory ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); confirmNewCategory() }
                  if (e.key === 'Escape') { setAddingCategory(false); setNewCategory('') }
                }}
                placeholder="카테고리 이름"
                autoFocus
                className="flex-1 px-3 py-2 border border-[#136299] rounded-lg text-[14px] outline-none focus:ring-2 focus:ring-[#136299]/10"
              />
              <button
                onClick={confirmNewCategory}
                className="px-3 py-2 bg-[#136299] text-white rounded-lg text-[13px] font-semibold hover:bg-[#0f4f7a]"
              >
                추가
              </button>
              <button
                onClick={() => { setAddingCategory(false); setNewCategory('') }}
                className="px-3 py-2 bg-[#efeded] text-[#454651] rounded-lg text-[13px] hover:bg-[#e4e2e2]"
              >
                취소
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="flex-1 px-3 py-2 border border-[#c6c5d3] rounded-lg text-[14px] text-[#1b1c1c] bg-white outline-none focus:border-[#136299] focus:ring-2 focus:ring-[#136299]/10 transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button
                onClick={() => setAddingCategory(true)}
                className="flex items-center gap-1 px-3 py-2 border border-dashed border-[#c6c5d3] rounded-lg text-[12px] text-[#767683] hover:border-[#136299] hover:text-[#136299] transition-colors whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[14px]">add</span>
                새 카테고리
              </button>
            </div>
          )}
        </div>

        {/* 태그 */}
        <div>
          <label className="block text-[11px] font-semibold text-[#767683] mb-1.5 uppercase tracking-wide">태그</label>
          {editTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {editTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-0.5 rounded-full bg-[#efeded] border border-[#e4e2e2] pl-2.5 pr-1.5 py-1 text-[12px] font-medium text-[#454651]"
                >
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-0.5 text-[#767683] hover:text-[#ba1a1a] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[13px]">close</span>
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
              placeholder="태그 추가 후 Enter"
              className="flex-1 px-3 py-2 border border-[#c6c5d3] rounded-lg text-[13px] text-[#1b1c1c] placeholder:text-[#767683] outline-none focus:border-[#136299] focus:ring-2 focus:ring-[#136299]/10 transition-all"
            />
            <button
              onClick={addTag}
              disabled={!newTag.trim()}
              className="px-3 py-2 bg-[#efeded] text-[#454651] rounded-lg text-[13px] font-medium hover:bg-[#e4e2e2] disabled:opacity-40 transition-colors"
            >
              추가
            </button>
          </div>
        </div>

        {/* 저장 / 취소 */}
        <div className="flex justify-end gap-2 pt-1 border-t border-[#f5f3f3]">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg text-[13px] font-medium text-[#454651] hover:bg-[#efeded] transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !editTitle.trim()}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#132175] text-white text-[13px] font-semibold hover:bg-[#2d3a8c] disabled:opacity-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">
              {saving ? 'hourglass_empty' : 'check'}
            </span>
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* 카테고리 + 태그 + 편집 버튼 */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="rounded-full bg-[#136299]/10 px-3 py-1 text-[11px] font-semibold text-[#136299] uppercase tracking-wide">
          {category}
        </span>
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[#efeded] border border-[#e4e2e2] px-3 py-1 text-[11px] font-medium text-[#454651]"
          >
            #{tag}
          </span>
        ))}
        <button
          onClick={openEdit}
          className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-medium text-[#767683] hover:bg-[#efeded] hover:text-[#454651] transition-colors"
        >
          <span className="material-symbols-outlined text-[15px]">edit</span>
          편집
        </button>
      </div>

      {/* 제목 */}
      <h1 className="text-[24px] font-bold text-[#1b1c1c] leading-snug tracking-tight mb-3">
        {title}
      </h1>
    </>
  )
}
