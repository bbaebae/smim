'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ContentCard, { ContentItem } from './ContentCard'
import ErrorToast from './ErrorToast'
import { toFriendlyMessage } from '@/lib/errors'

type Props = {
  contents: ContentItem[]
  reviewCount: number
}

type Tab = 'article' | 'youtube' | 'text' | 'file'

const TABS: { id: Tab; icon: string; label: string; placeholder?: string; hint?: string }[] = [
  { id: 'article', icon: 'link', label: '아티클', placeholder: 'https://example.com/article', hint: '본문, 저자, 날짜를 자동으로 추출합니다.' },
  { id: 'youtube', icon: 'smart_display', label: 'YouTube', placeholder: 'https://youtube.com/watch?v=...', hint: '자막을 기반으로 핵심 내용을 요약합니다.' },
  { id: 'text', icon: 'notes', label: '텍스트' },
  { id: 'file', icon: 'upload_file', label: '파일', hint: 'PDF, TXT, MD 파일을 지원합니다.' },
]

const TYPE_META = TABS

const TYPE_ICONS: Record<string, string> = {
  article: 'link', youtube: 'smart_display', instagram: 'photo_camera', text: 'notes', file: 'upload_file',
}

function thisWeekCount(contents: ContentItem[]): number {
  const weekAgo = Date.now() - 7 * 86400000
  return contents.filter((c) => new Date(c.created_at).getTime() > weekAgo).length
}

function pickRecommended(contents: ContentItem[], n = 3): ContentItem[] {
  if (contents.length <= n) return contents
  const pool = contents.slice(0, Math.max(n * 3, 10))
  const seen = new Set<string>()
  const picked: ContentItem[] = []
  for (const c of pool) {
    if (picked.length >= n) break
    if (!seen.has(c.category)) { seen.add(c.category); picked.push(c) }
  }
  for (const c of pool) {
    if (picked.length >= n) break
    if (!picked.includes(c)) picked.push(c)
  }
  return picked
}

function RecommendCard({ item }: { item: ContentItem }) {
  return (
    <Link
      href={`/contents/${item.id}`}
      className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#f5f3f3] transition-colors group"
    >
      <div className="w-8 h-8 rounded-lg bg-[#efeded] flex items-center justify-center shrink-0 mt-0.5">
        <span className="material-symbols-outlined text-[16px] text-[#767683]">
          {TYPE_ICONS[item.type] ?? 'article'}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-[#136299] mb-0.5">{item.category}</p>
        <p className="text-[13px] font-medium text-[#1b1c1c] leading-snug line-clamp-2 group-hover:text-[#132175] transition-colors">
          {item.title}
        </p>
      </div>
    </Link>
  )
}

const LOADING_STEPS: Record<Tab, string[]> = {
  article: ['페이지를 읽는 중...', '본문을 추출하는 중...', 'AI가 분석하는 중...', '요약을 작성하는 중...'],
  youtube: ['영상 정보를 가져오는 중...', '자막을 처리하는 중...', 'AI가 분석하는 중...', '요약을 작성하는 중...'],
  text:    ['AI가 분석하는 중...', '요약을 작성하는 중...'],
  file:    ['파일을 읽는 중...', '텍스트를 추출하는 중...', 'AI가 분석하는 중...', '요약을 작성하는 중...'],
}

function AnalyzingCard({ tab }: { tab: Tab }) {
  const steps = LOADING_STEPS[tab]
  const [stepIdx, setStepIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setStepIdx((i) => (i < steps.length - 1 ? i + 1 : i))
    }, 3500)
    return () => clearInterval(id)
  }, [steps.length])

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#132175]/20 bg-[#132175]/5 p-4 ambient-shadow">
      {/* 아이콘 + 스피너 */}
      <div className="relative h-16 w-16 shrink-0">
        <div className="absolute inset-0 rounded-lg border-[2.5px] border-[#132175]/10" />
        <div className="absolute inset-0 rounded-lg border-[2.5px] border-transparent border-t-[#132175] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-[22px] text-[#132175]">auto_awesome</span>
        </div>
      </div>

      {/* 텍스트 */}
      <div className="min-w-0 flex-1 space-y-2">
        <p className="text-[13px] font-semibold text-[#132175]">{steps[stepIdx]}</p>
        <div className="flex items-center gap-1">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`block h-1 rounded-full transition-all duration-500 ${
                i <= stepIdx ? 'w-5 bg-[#132175]' : 'w-2 bg-[#c6c5d3]'
              }`}
            />
          ))}
        </div>
        <p className="text-[11px] text-[#767683]">
          {tab === 'youtube' ? '영상 길이에 따라 30초~1분 소요될 수 있어요' : '보통 10~20초 걸려요'}
        </p>
      </div>
    </div>
  )
}

function AddContentInline({ onAnalyzing }: { onAnalyzing: (tab: Tab | null) => void }) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('article')
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [upgradeNeeded, setUpgradeNeeded] = useState(false)
  const [done, setDone] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [toastContact, setToastContact] = useState(false)
  const errorCountRef = useRef(0)

  const activeTab = TABS.find((t) => t.id === tab)!

  function handleUrlChange(val: string) {
    setUrl(val)
    if (tab === 'article' && /(?:youtube\.com|youtu\.be)/.test(val)) {
      setTab('youtube')
    } else if (tab === 'youtube' && /^https?:\/\//.test(val) && !/youtube\.com|youtu\.be/.test(val)) {
      setTab('article')
    }
  }

  function resetForm() {
    setUrl(''); setTitle(''); setText(''); setFile(null); setUpgradeNeeded(false); setDone(false)
  }

  function showError(raw: string) {
    errorCountRef.current += 1
    setToastMsg(toFriendlyMessage(raw))
    setToastContact(errorCountRef.current >= 2)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setUpgradeNeeded(false)
    setLoading(true)
    onAnalyzing(tab)
    try {
      let res: Response
      if (tab === 'file') {
        if (!file) { setToastMsg('파일을 선택해주세요.'); setLoading(false); return }
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
        if (json.upgrade) { setUpgradeNeeded(true); return }
        showError(json.error ?? '')
        return
      }
      setDone(true)
      resetForm()
      router.refresh()
    } catch {
      showError('network')
    } finally {
      setLoading(false)
      onAnalyzing(null)
    }
  }

  return (
    <div className="rounded-xl border border-[#e4e2e2] bg-white ambient-shadow overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <p className="text-[14px] font-semibold text-[#1b1c1c]">새 콘텐츠 추가</p>
      </div>

      {/* 탭 */}
      <div className="flex border-b border-[#e4e2e2] bg-[#fbf9f8]">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setToastMsg(''); setDone(false) }}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === t.id
                ? 'border-[#132175] text-[#132175] bg-white'
                : 'border-transparent text-[#454651] hover:text-[#1b1c1c] hover:bg-[#f5f3f3]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="p-5 space-y-3">
        {(tab === 'article' || tab === 'youtube') && (
          <>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[17px] text-[#767683]">language</span>
              <input
                type="url"
                placeholder={activeTab.placeholder}
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 border border-[#c6c5d3] rounded-lg text-[14px] text-[#1b1c1c] placeholder:text-[#767683] outline-none focus:border-[#136299] focus:ring-2 focus:ring-[#136299]/10 transition-all bg-white"
              />
            </div>
            {activeTab.hint && (
              <p className="text-[12px] text-[#767683] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#136299]">info</span>
                {activeTab.hint}
              </p>
            )}
          </>
        )}

        {tab === 'text' && (
          <>
            <input
              type="text"
              placeholder="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-[#c6c5d3] rounded-lg text-[14px] text-[#1b1c1c] placeholder:text-[#767683] outline-none focus:border-[#136299] focus:ring-2 focus:ring-[#136299]/10 transition-all"
            />
            <textarea
              placeholder="내용을 입력하세요"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-2.5 border border-[#c6c5d3] rounded-lg text-[14px] text-[#1b1c1c] placeholder:text-[#767683] outline-none focus:border-[#136299] focus:ring-2 focus:ring-[#136299]/10 transition-all resize-none"
            />
          </>
        )}

        {tab === 'file' && (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#c6c5d3] py-8 transition-colors hover:border-[#136299] hover:bg-[#f5f3f3]">
            <span className="material-symbols-outlined text-[32px] text-[#767683] mb-2">upload_file</span>
            <span className="text-[13px] font-medium text-[#1b1c1c]">
              {file ? file.name : '파일 선택 또는 드래그'}
            </span>
            <span className="text-[12px] text-[#767683] mt-0.5">{activeTab.hint}</span>
            <input type="file" accept=".pdf,.txt,.md" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
        )}

        {upgradeNeeded && (
          <div className="rounded-lg bg-[#ba1a1a]/5 border border-[#ba1a1a]/20 px-3 py-2.5">
            <p className="text-[12px] text-[#ba1a1a]">저장 한도에 도달했습니다.</p>
            <a href="/plan" className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-semibold text-[#132175] hover:underline">
              <span className="material-symbols-outlined text-[13px]">workspace_premium</span>
              Pro로 업그레이드 →
            </a>
          </div>
        )}
        {toastMsg && (
          <ErrorToast
            message={toastMsg}
            showContact={toastContact}
            onClose={() => setToastMsg('')}
          />
        )}
        {done && (
          <p className="text-[12px] text-[#136299] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            저장됐습니다
          </p>
        )}

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#132175] text-white text-[13px] font-semibold hover:bg-[#2d3a8c] disabled:opacity-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">{loading ? 'hourglass_empty' : 'add'}</span>
            {loading ? '분석 중...' : '저장'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function DashboardClient({ contents, reviewCount }: Props) {
  const [analyzingTab, setAnalyzingTab] = useState<Tab | null>(null)
  const categoryMap = contents.reduce<Record<string, number>>((acc, c) => {
    acc[c.category] = (acc[c.category] ?? 0) + 1
    return acc
  }, {})
  const sortedCategories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])
  const maxCategoryCount = sortedCategories[0]?.[1] ?? 1

  const typeMap = contents.reduce<Record<string, number>>((acc, c) => {
    acc[c.type] = (acc[c.type] ?? 0) + 1
    return acc
  }, {})

  const tagCount = new Set(contents.flatMap((c) => c.tags ?? [])).size
  const recent = contents.slice(0, 5)
  const recommended = useMemo(() => pickRecommended(contents), [contents])

  return (
    <div className="px-6 py-8 max-w-3xl space-y-8">
      <div>
        <h1 className="text-[28px] font-bold text-[#1b1c1c] tracking-tight mb-1">홈</h1>
        <p className="text-[14px] text-[#767683]">오늘의 지식 베이스</p>
      </div>

      {/* 복습 배너 */}
      {reviewCount > 0 && (
        <Link
          href="/review"
          className="flex items-center justify-between rounded-xl bg-[#132175] px-5 py-4 text-white transition-opacity hover:opacity-90"
        >
          <div>
            <p className="text-[12px] font-semibold tracking-wide uppercase opacity-70 mb-0.5">Daily Review</p>
            <p className="text-[18px] font-bold leading-tight">{reviewCount}개 복습 대기 중</p>
          </div>
          <span className="material-symbols-outlined text-[24px] opacity-80">arrow_forward</span>
        </Link>
      )}

      {/* 새 콘텐츠 추가 인라인 */}
      <AddContentInline onAnalyzing={setAnalyzingTab} />

      {/* 통계 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: '전체 콘텐츠', value: contents.length, icon: 'library_books' },
          { label: '이번 주 추가', value: thisWeekCount(contents), icon: 'calendar_today' },
          { label: '카테고리', value: sortedCategories.length, icon: 'category' },
          { label: '태그', value: tagCount, icon: 'sell' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-white border border-[#e4e2e2] p-4 ambient-shadow">
            <span className="material-symbols-outlined text-[20px] text-[#136299] mb-2 block">{s.icon}</span>
            <p className="text-[24px] font-bold text-[#1b1c1c] leading-none mb-1">{s.value}</p>
            <p className="text-[12px] text-[#767683]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 분포 차트 */}
      {contents.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl bg-white border border-[#e4e2e2] p-5 ambient-shadow">
            <p className="text-[13px] font-semibold text-[#454651] mb-4">카테고리 분포</p>
            <div className="space-y-3">
              {sortedCategories.slice(0, 6).map(([cat, count]) => (
                <div key={cat}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[12px] text-[#1b1c1c] font-medium">{cat}</span>
                    <span className="text-[12px] text-[#767683]">{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#efeded] overflow-hidden">
                    <div className="h-full rounded-full bg-[#132175]" style={{ width: `${(count / maxCategoryCount) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white border border-[#e4e2e2] p-5 ambient-shadow">
            <p className="text-[13px] font-semibold text-[#454651] mb-4">콘텐츠 유형</p>
            <div className="space-y-3">
              {TYPE_META.map((t) => {
                const count = typeMap[t.id] ?? 0
                if (count === 0) return null
                return (
                  <div key={t.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f5f3f3] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px] text-[#136299]">{t.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-[12px] font-medium text-[#1b1c1c]">{t.label}</span>
                        <span className="text-[12px] text-[#767683]">{count}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#efeded] overflow-hidden">
                        <div className="h-full rounded-full bg-[#136299]" style={{ width: `${(count / contents.length) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* 다시 읽어볼 콘텐츠 */}
      {recommended.length > 0 && (
        <div className="rounded-xl bg-white border border-[#e4e2e2] ambient-shadow overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <p className="text-[14px] font-semibold text-[#1b1c1c]">다시 읽어볼 콘텐츠</p>
            <p className="text-[12px] text-[#767683] mt-0.5">지식은 반복할수록 깊어집니다</p>
          </div>
          <div className="divide-y divide-[#f5f3f3] px-2 pb-2">
            {recommended.map((item) => (
              <RecommendCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* 최근 저장 */}
      {(analyzingTab || recent.length > 0) && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[15px] font-semibold text-[#1b1c1c]">최근 저장</p>
            <Link href="/library" className="text-[12px] text-[#136299] hover:underline">전체 보기 →</Link>
          </div>
          <div className="space-y-3">
            {analyzingTab && <AnalyzingCard tab={analyzingTab} />}
            {recent.map((item) => <ContentCard key={item.id} item={item} />)}
          </div>
        </div>
      )}

      {!analyzingTab && contents.length === 0 && (
        <div className="py-12 text-center">
          <span className="material-symbols-outlined text-[48px] text-[#c6c5d3] block mb-3">inbox</span>
          <p className="text-[15px] font-semibold text-[#454651] mb-1">아직 저장된 콘텐츠가 없어요</p>
          <p className="text-[13px] text-[#767683]">위에서 첫 번째 콘텐츠를 추가해보세요</p>
        </div>
      )}
    </div>
  )
}
