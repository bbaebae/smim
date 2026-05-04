import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('user_settings')
    .select('email_notify, push_notify, push_subscription')
    .eq('user_id', user.id)
    .single()

  return NextResponse.json(data ?? { email_notify: true, push_notify: false, push_subscription: null })
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const allowed: Record<string, unknown> = {}
  if (typeof body.email_notify === 'boolean') allowed.email_notify = body.email_notify
  if (typeof body.push_notify === 'boolean') allowed.push_notify = body.push_notify

  const { error } = await supabase
    .from('user_settings')
    .upsert({ user_id: user.id, ...allowed }, { onConflict: 'user_id' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
