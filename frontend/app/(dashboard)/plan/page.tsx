import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PlanActions from '@/components/PlanActions'

const FREE_FEATURES = [
  '월 20개 콘텐츠 저장',
  'AI 요약 (기본)',
  'SM-2 복습 알림',
  '3가지 콘텐츠 유형',
]

const PRO_FEATURES = [
  '무제한 콘텐츠 저장',
  'AI 요약 (고급)',
  'SM-2 복습 + 통계',
  '5가지 콘텐츠 유형',
  '주간 이메일 리포트',
  '우선 고객 지원',
]

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const { success } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('plan, status, current_period_end')
    .eq('user_id', user.id)
    .maybeSingle()

  const plan = subscription?.plan ?? 'free'
  const isPro = plan === 'pro' || plan === 'annual'

  const periodEnd = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString('ko-KR', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : null

  return (
    <div className="px-6 py-8 max-w-3xl space-y-8">
      <div>
        <h1 className="text-[28px] font-bold text-[#1b1c1c] tracking-tight mb-1">플랜</h1>
        <p className="text-[14px] text-[#767683]">구독 및 플랜 관리</p>
      </div>

      {/* 결제 완료 메시지 */}
      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-[20px] text-green-600">check_circle</span>
          <div>
            <p className="text-[14px] font-semibold text-green-800">결제가 완료되었습니다!</p>
            <p className="text-[12px] text-green-700 mt-0.5">플랜이 곧 업데이트됩니다. 변경사항이 반영되지 않으면 새로고침하세요.</p>
          </div>
        </div>
      )}

      {/* 현재 플랜 */}
      {isPro ? (
        <div className="rounded-xl bg-[#132175] text-white px-6 py-5 flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold tracking-wide uppercase opacity-70 mb-0.5">현재 플랜</p>
            <p className="text-[20px] font-bold leading-tight">
              {plan === 'annual' ? 'Annual 플랜 이용 중' : 'Pro 플랜 이용 중'}
            </p>
            <p className="text-[13px] opacity-70 mt-0.5">
              무제한 콘텐츠 · 고급 AI 요약 · 주간 리포트
              {periodEnd && ` · ${periodEnd} 갱신`}
            </p>
          </div>
          <PlanActions isPro={true} />
        </div>
      ) : (
        <div className="rounded-xl border border-[#e4e2e2] bg-white overflow-hidden">
          <div className="px-6 py-5 flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-[#efeded] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px] text-[#767683]">person</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold tracking-wide uppercase text-[#767683] mb-0.5">현재 플랜</p>
              <div className="flex items-center gap-2">
                <p className="text-[20px] font-bold text-[#1b1c1c] leading-tight">무료 플랜</p>
                <span className="rounded-full bg-[#efeded] border border-[#e4e2e2] px-2.5 py-0.5 text-[11px] font-semibold text-[#767683]">FREE</span>
              </div>
              <p className="text-[13px] text-[#767683] mt-0.5">월 20개 콘텐츠 · 기본 AI 요약</p>
            </div>
          </div>
        </div>
      )}

      {/* 플랜 비교 */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Free */}
        <div className={`rounded-xl border p-5 space-y-4 ${!isPro ? 'border-[#132175] bg-[#132175]/[0.03]' : 'border-[#e4e2e2] bg-white'}`}>
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-[15px] font-bold text-[#1b1c1c]">무료</p>
              {!isPro && (
                <span className="rounded-full bg-[#132175] px-2.5 py-0.5 text-[10px] font-bold text-white">현재</span>
              )}
            </div>
            <p className="text-[28px] font-bold text-[#1b1c1c] leading-none">₩0</p>
            <p className="text-[12px] text-[#767683] mt-0.5">영원히 무료</p>
          </div>
          <ul className="space-y-2.5">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-[13px] text-[#454651]">
                <span className="material-symbols-outlined text-[16px] text-[#767683]">check</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Pro */}
        <div className={`rounded-xl border p-5 space-y-4 ${isPro ? 'border-[#132175] bg-[#132175]/[0.03]' : 'border-[#e4e2e2] bg-white'}`}>
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-[15px] font-bold text-[#1b1c1c]">Pro</p>
              {isPro && (
                <span className="rounded-full bg-[#132175] px-2.5 py-0.5 text-[10px] font-bold text-white">현재</span>
              )}
            </div>
            <p className="text-[28px] font-bold text-[#1b1c1c] leading-none">₩6,900</p>
            <p className="text-[12px] text-[#767683] mt-0.5">월 / 사용자</p>
          </div>
          <ul className="space-y-2.5">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-[13px] text-[#454651]">
                <span className="material-symbols-outlined text-[16px] text-[#132175]">check</span>
                {f}
              </li>
            ))}
          </ul>
          {!isPro && <PlanActions isPro={false} />}
        </div>
      </div>

      <p className="text-[12px] text-[#767683] text-center">
        14일 무료 체험 · 언제든 해지 가능 · 신용카드 불필요
      </p>
    </div>
  )
}
