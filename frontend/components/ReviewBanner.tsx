import Link from 'next/link'

type Props = { count: number }

export default function ReviewBanner({ count }: Props) {
  if (count === 0) return null
  return (
    <Link
      href="/review"
      className="mb-6 flex items-center justify-between rounded-xl bg-[#132175] px-5 py-4 text-white transition-opacity hover:opacity-90"
    >
      <div>
        <p className="text-[12px] font-semibold tracking-wide uppercase opacity-70 mb-0.5">Daily Review</p>
        <p className="text-[18px] font-bold leading-tight">{count}개 복습 대기 중</p>
      </div>
      <span className="material-symbols-outlined text-[24px] opacity-80">arrow_forward</span>
    </Link>
  )
}
