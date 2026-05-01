import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })

  const res = await fetch(`${process.env.BACKEND_URL}/stripe/portal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-key': process.env.INTERNAL_API_KEY ?? '',
    },
    body: JSON.stringify({ user_id: user.id }),
  })

  const data = await res.json()
  if (!res.ok) return NextResponse.json({ error: data.detail ?? '포털 오류' }, { status: res.status })
  return NextResponse.json(data)
}
