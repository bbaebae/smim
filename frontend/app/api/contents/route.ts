import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { processContent, processFile } from '@/lib/backend'

const FREE_LIMIT = 20

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    // 플랜 확인 + 무료 제한 체크
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('plan')
      .eq('user_id', user.id)
      .maybeSingle()

    const plan = subscription?.plan ?? 'free'

    if (plan === 'free') {
      const { count } = await supabase
        .from('contents')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if ((count ?? 0) >= FREE_LIMIT) {
        return NextResponse.json(
          { error: `무료 플랜은 최대 ${FREE_LIMIT}개까지 저장할 수 있습니다.`, upgrade: true },
          { status: 403 }
        )
      }
    }

    const contentType = request.headers.get('content-type') ?? ''
    const isFormData = contentType.includes('multipart/form-data')

    let result: Awaited<ReturnType<typeof processContent>>
    let type: string
    let contentUrl: string | null = null

    if (isFormData) {
      const formData = await request.formData()
      const file = formData.get('file') as File | null
      if (!file) return NextResponse.json({ error: '파일이 필요합니다' }, { status: 400 })
      type = 'file'
      result = await processFile(file)
    } else {
      const body = await request.json()
      type = body.type
      if (!type) return NextResponse.json({ error: 'type이 필요합니다' }, { status: 400 })
      contentUrl = body.url ?? null
      result = await processContent(body)
    }

    const { data: inserted, error: contentsError } = await supabase
      .from('contents')
      .insert({
        user_id: user.id,
        type,
        url: contentUrl,
        title: result.title,
        full_text: result.full_text,
        summary: result.summary,
        category: result.category,
        tags: result.tags,
        thumbnail_url: result.thumbnail_url,
      })
      .select('id')
      .single()

    if (contentsError) throw contentsError

    await supabase.from('review_schedule').insert({
      content_id: inserted.id,
      user_id: user.id,
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : '서버 오류가 발생했습니다'
    console.error(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })

    const { id, title, tags, category } = await request.json() as {
      id: string
      title?: string
      tags?: string[]
      category?: string
    }
    if (!id) return NextResponse.json({ error: 'id가 필요합니다' }, { status: 400 })

    const updates: Record<string, unknown> = {}
    if (title !== undefined) updates.title = title
    if (tags !== undefined) updates.tags = tags
    if (category !== undefined) updates.category = category

    const { error } = await supabase
      .from('contents')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : '서버 오류'
    console.error(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })

    const { ids } = await request.json() as { ids: string[] }
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'ids가 필요합니다' }, { status: 400 })
    }

    await supabase.from('review_schedule').delete().in('content_id', ids).eq('user_id', user.id)

    const { error } = await supabase
      .from('contents')
      .delete()
      .in('id', ids)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : '서버 오류가 발생했습니다'
    console.error(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
