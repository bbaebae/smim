import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { adminClient } from '@/lib/supabase/admin'

type NaverTokenResponse = {
  access_token?: string
  error?: string
}

type NaverUserResponse = {
  resultcode: string
  message: string
  response: {
    email?: string
    name?: string
    id: string
  }
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  const cookieStore = await cookies()
  const savedState = cookieStore.get('naver_oauth_state')?.value
  cookieStore.delete('naver_oauth_state')

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(`${origin}/login?error=invalid_state`)
  }

  // 1. 액세스 토큰 교환
  const tokenParams = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.NAVER_CLIENT_ID!,
    client_secret: process.env.NAVER_CLIENT_SECRET!,
    redirect_uri: `${origin}/auth/naver/callback`,
    code,
    state,
  })

  const tokenRes = await fetch(`https://nid.naver.com/oauth2.0/token?${tokenParams}`, {
    method: 'GET',
  })
  const tokenData: NaverTokenResponse = await tokenRes.json()

  if (!tokenData.access_token) {
    return NextResponse.redirect(`${origin}/login?error=naver_token_failed`)
  }

  // 2. 사용자 정보 조회
  const userRes = await fetch('https://openapi.naver.com/v1/nid/me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  })
  const userData: NaverUserResponse = await userRes.json()
  const email = userData.response?.email
  const name = userData.response?.name

  if (!email) {
    return NextResponse.redirect(`${origin}/login?error=email_required`)
  }

  // 3. Supabase 유저 생성 (이미 있으면 무시)
  await adminClient.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { full_name: name, provider: 'naver' },
  })

  // 4. 매직링크 생성 → 자동 로그인
  const { data, error } = await adminClient.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo: `${origin}/auth/callback` },
  })

  if (error || !data?.properties?.action_link) {
    return NextResponse.redirect(`${origin}/login?error=naver_auth_failed`)
  }

  return NextResponse.redirect(data.properties.action_link)
}
