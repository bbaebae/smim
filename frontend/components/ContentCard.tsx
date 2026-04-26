import Link from 'next/link'
import Image from 'next/image'

export type ContentItem = {
  id: string
  type: string
  title: string
  summary: string
  category: string
  tags: string[]
  thumbnail_url: string | null
  created_at: string
}

const TYPE_ICONS: Record<string, string> = {
  article: 'link',
  youtube: 'smart_display',
  instagram: 'photo_camera',
  text: 'notes',
  file: 'upload_file',
}

export default function ContentCard({ item }: { item: ContentItem }) {
  return (
    <Link
      href={`/contents/${item.id}`}
      className="group flex gap-4 rounded-xl bg-white p-4 ambient-shadow hover:ambient-shadow-hover transition-all duration-200 border border-[#e4e2e2]/50"
    >
      {item.thumbnail_url ? (
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
          <Image src={item.thumbnail_url} alt="" fill className="object-cover" unoptimized />
        </div>
      ) : (
        <div className="h-16 w-16 shrink-0 rounded-lg bg-[#efeded] flex items-center justify-center">
          <span className="material-symbols-outlined text-[24px] text-[#767683]">
            {TYPE_ICONS[item.type] ?? 'article'}
          </span>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-[11px] font-semibold tracking-wide text-[#136299] uppercase">
            {item.category}
          </span>
        </div>
        <h3 className="text-[14px] font-semibold text-[#1b1c1c] leading-snug line-clamp-2 group-hover:text-[#132175] transition-colors">
          {item.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-[13px] text-[#454651] leading-relaxed">{item.summary}</p>
      </div>
    </Link>
  )
}
