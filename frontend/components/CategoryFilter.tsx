'use client'

const CATEGORIES = ['전체', '기술/개발', '비즈니스/마케팅', '투자/경제', '라이프스타일', '기타']

type Props = {
  selected: string
  onChange: (category: string) => void
}

export default function CategoryFilter({ selected, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
            selected === cat
              ? 'bg-[#132175] text-white'
              : 'bg-white text-[#454651] border border-[#e4e2e2] hover:border-[#c6c5d3] hover:text-[#132175]'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
