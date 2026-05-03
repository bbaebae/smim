import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const BACKEND_URL = process.env.BACKEND_URL!
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY!

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'bbaebae123@gmail.com') {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 })
  }

  const res = await fetch(`${BACKEND_URL}/admin/backfill-cards`, {
    method: 'POST',
    headers: { 'x-internal-key': INTERNAL_API_KEY },
  })

  const data = await res.json()
  return NextResponse.json(data)
}
