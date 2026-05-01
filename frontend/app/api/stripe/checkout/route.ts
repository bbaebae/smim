import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })

  const { plan } = await request.json()
  if (!plan || !['pro', 'annual'].includes(plan)) {
    return NextResponse.json({ error: '올바른 플랜을 선택하세요' }, { status: 400 })
  }

  const res = await fetch(`${process.env.BACKEND_URL}/stripe/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-key': process.env.INTERNAL_API_KEY ?? '',
    },
    body: JSON.stringify({ user_id: user.id, user_email: user.email, plan }),
  })

  const data = await res.json()
  if (!res.ok) return NextResponse.json({ error: data.detail ?? '결제 오류' }, { status: res.status })
  return NextResponse.json(data)
}
