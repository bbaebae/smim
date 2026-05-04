'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard', icon: 'grid_view', label: '홈' },
  { href: '/review', icon: 'psychology_alt', label: '복습' },
  { href: '/library', icon: 'book_2', label: '라이브러리' },
  { href: '/plan', icon: 'workspace_premium', label: '플랜' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed top-0 left-0 h-screen w-60 flex-col bg-[#f5f3f3] border-r border-[#e4e2e2] z-50 p-4">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 px-2 pt-2">
          <div className="w-9 h-9 rounded-lg bg-[#2d3a8c] flex items-center justify-center shrink-0">
            <Image src="/logo.png" alt="스밈" width={22} height={22} style={{ objectFit: 'contain' }} />
          </div>
          <div>
            <div className="text-[15px] font-bold text-[#132175] leading-tight tracking-tight">스밈</div>
            <div className="text-[11px] text-[#767683]">Second Brain</div>
          </div>
        </div>

        {/* Main nav */}
        <div className="flex flex-col gap-1 flex-1">
          {navItems.map(({ href, icon, label }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium transition-colors ${
                  active
                    ? 'bg-white text-[#132175] ambient-shadow'
                    : 'text-[#767683] hover:text-[#132175] hover:bg-white/60'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{icon}</span>
                {label}
              </Link>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-1 border-t border-[#e4e2e2] pt-4">
          <Link
            href="/settings"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium transition-colors ${
              pathname === '/settings'
                ? 'bg-white text-[#132175] ambient-shadow'
                : 'text-[#767683] hover:text-[#132175] hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            설정
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] text-[#767683] hover:text-[#132175] hover:bg-white/60 transition-colors w-full text-left"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            로그아웃
          </button>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#e4e2e2] z-50 flex justify-around items-center px-2 py-2">
        {[...navItems, { href: '/settings', icon: 'settings', label: '설정' }].map(({ href, icon, label }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                active ? 'text-[#132175]' : 'text-[#767683]'
              }`}
            >
              <span className={`material-symbols-outlined text-[22px]`} style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
