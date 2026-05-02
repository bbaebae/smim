'use client'

import { useEffect } from 'react'

type Props = {
  message: string
  showContact?: boolean
  onClose: () => void
}

export default function ErrorToast({ message, showContact, onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, 6000)
    return () => clearTimeout(t)
  }, [message, onClose])

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] w-[calc(100vw-32px)] max-w-sm pointer-events-none">
      <div className="rounded-2xl bg-[#1b1c1c] text-white shadow-2xl px-4 py-3.5 flex items-start gap-3 pointer-events-auto">
        <span className="material-symbols-outlined text-[18px] text-[#ff8a80] shrink-0 mt-0.5">error</span>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] leading-snug whitespace-pre-line">{message}</p>
          {showContact && (
            <a
              href="mailto:support@smim.app"
              className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-[#82b4ff] hover:underline"
            >
              <span className="material-symbols-outlined text-[13px]">mail</span>
              문의하기
            </a>
          )}
        </div>
        <button
          onClick={onClose}
          className="shrink-0 text-white/40 hover:text-white transition-colors mt-0.5"
          aria-label="닫기"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  )
}
