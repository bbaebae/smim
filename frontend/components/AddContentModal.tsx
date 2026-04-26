'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Tab = 'article' | 'youtube' | 'text' | 'file'

const TABS: { id: Tab; icon: string; label: string; placeholder?: string; hint?: string }[] = [
  {
    id: 'article',
    icon: 'link',
    label: 'Article URL',
    placeholder: 'https://example.com/article',
    hint: '스밈이 본문, 저자, 날짜를 자동으로 추출합니다.',
  },
  {
    id: 'youtube',
    icon: 'smart_display',
    label: 'YouTube URL',
    placeholder: 'https://youtube.com/watch?v=...',
    hint: '자막을 기반으로 핵심 내용을 요약합니다.',
  },
  {
    id: 'text',
    icon: 'notes',
    label: 'Direct Text',
  },
  {
    id: 'file',
    icon: 'upload_file',
    label: 'File Upload',
    hint: 'PDF, TXT, MD 파일을 지원합니다.',
  },
]

type Props = { onClose: () => void }

export default function AddContentModal({ onClose }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('article')
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const activeTab = TABS.find((t) => t.id === tab)!

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let res: Response
      if (tab === 'file') {
        if (!file) { setError('파일을 선택해주세요'); setLoading(false); return }
        const fd = new FormData()
        fd.append('type', 'file')
        fd.append('file', file)
        res = await fetch('/api/contents', { method: 'POST', body: fd })
      } else {
        const body: Record<string, string> = { type: tab }
        if (tab === 'article' || tab === 'youtube') body.url = url
        if (tab === 'text') { body.title = title; body.text = text }
        res = await fetch('/api/contents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      }

      if (!res.ok) {
        const json = await res.json()
        setError(json.error ?? '오류가 발생했습니다')
        return
      }

      router.refresh()
      onClose()
    } catch {
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e4e2e2]">
          <h2 className="text-[16px] font-bold text-[#1b1c1c]">Add to Knowledge Base</h2>
          <button
            onClick={onClose}
            className="text-[#767683] hover:text-[#1b1c1c] transition-colors p-1"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-[#fbf9f8] border-b border-[#e4e2e2]">
          <nav className="flex overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-3 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                  tab === t.id
                    ? 'border-[#132175] text-[#132175] bg-white'
                    : 'border-transparent text-[#454651] hover:text-[#1b1c1c] hover:bg-[#f5f3f3]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 bg-white space-y-4">
            {(tab === 'article' || tab === 'youtube') && (
              <>
                <div>
                  <label className="block text-[13px] text-[#454651] mb-2">
                    Paste URL to extract content
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-[#767683]">
                      language
                    </span>
                    <input
                      type="url"
                      placeholder={activeTab.placeholder}
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-[#c6c5d3] rounded-lg text-[14px] text-[#1b1c1c] placeholder:text-[#767683] outline-none focus:border-[#136299] focus:ring-2 focus:ring-[#136299]/10 transition-all"
                    />
                  </div>
                </div>
                {activeTab.hint && (
                  <div className="flex gap-2 px-3 py-3 bg-[#f5f3f3] rounded-lg border border-[#e4e2e2]">
                    <span className="material-symbols-outlined text-[16px] text-[#136299] shrink-0 mt-0.5">info</span>
                    <p className="text-[13px] text-[#454651] leading-relaxed">{activeTab.hint}</p>
                  </div>
                )}
              </>
            )}

            {tab === 'text' && (
              <>
                <div>
                  <label className="block text-[13px] text-[#454651] mb-2">제목</label>
                  <input
                    type="text"
                    placeholder="콘텐츠 제목"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-[#c6c5d3] rounded-lg text-[14px] text-[#1b1c1c] placeholder:text-[#767683] outline-none focus:border-[#136299] focus:ring-2 focus:ring-[#136299]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-[#454651] mb-2">내용</label>
                  <textarea
                    placeholder="내용을 입력하세요"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                    rows={5}
                    className="w-full px-4 py-2.5 border border-[#c6c5d3] rounded-lg text-[14px] text-[#1b1c1c] placeholder:text-[#767683] outline-none focus:border-[#136299] focus:ring-2 focus:ring-[#136299]/10 transition-all resize-none"
                  />
                </div>
              </>
            )}

            {tab === 'file' && (
              <>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#c6c5d3] py-10 transition-colors hover:border-[#136299] hover:bg-[#f5f3f3]">
                  <span className="material-symbols-outlined text-[36px] text-[#767683] mb-2">upload_file</span>
                  <span className="text-[14px] font-medium text-[#1b1c1c]">
                    {file ? file.name : '파일 선택 또는 드래그'}
                  </span>
                  <span className="text-[12px] text-[#767683] mt-1">{activeTab.hint}</span>
                  <input
                    type="file"
                    accept=".pdf,.txt,.md"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </>
            )}

            {error && (
              <p className="text-[13px] text-[#ba1a1a] bg-[#ffdad6] px-3 py-2 rounded-lg">{error}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e4e2e2] bg-[#fbf9f8]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-[14px] font-medium text-[#454651] border border-[#c6c5d3] hover:bg-[#efeded] transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg text-[14px] font-semibold bg-[#132175] text-white hover:bg-[#2d3a8c] transition-colors disabled:opacity-50"
            >
              {loading ? '분석 중...' : 'SAVE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
