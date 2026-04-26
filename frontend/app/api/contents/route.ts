import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { scrapeArticle } from '@/lib/scraper'
import { analyzeContent } from '@/lib/ai'
import { getYoutubeTranscript, extractVideoId, getYoutubeThumbnail } from '@/lib/youtube'
import { parseFile } from '@/lib/fileParser'

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') ?? ''
    const isFormData = contentType.includes('multipart/form-data')

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    let type: string
    let url: string | undefined
    let inputTitle: string | undefined
    let inputText: string | undefined
    let file: File | undefined

    if (isFormData) {
      const formData = await request.formData()
      type = formData.get('type') as string
      file = formData.get('file') as File | undefined
    } else {
      const body = await request.json()
      type = body.type
      url = body.url
      inputTitle = body.title
      inputText = body.text
    }

    if (!type) {
      return NextResponse.json({ error: 'type이 필요합니다' }, { status: 400 })
    }

    let contentTitle: string
    let fullText: string
    let thumbnailUrl: string | null = null
    let contentUrl: string | null = url ?? null

    if (type === 'article') {
      if (!url) return NextResponse.json({ error: 'url이 필요합니다' }, { status: 400 })
      const scraped = await scrapeArticle(url)
      contentTitle = scraped.title
      fullText = scraped.markdown

    } else if (type === 'youtube') {
      if (!url) return NextResponse.json({ error: 'url이 필요합니다' }, { status: 400 })
      try {
        fullText = await getYoutubeTranscript(url)
      } catch {
        return NextResponse.json(
          { error: '자막을 찾을 수 없습니다. 텍스트로 직접 입력해주세요' },
          { status: 400 }
        )
      }
      const videoId = extractVideoId(url)!
      contentTitle = url
      thumbnailUrl = getYoutubeThumbnail(videoId)

    } else if (type === 'file') {
      if (!file) return NextResponse.json({ error: '파일이 필요합니다' }, { status: 400 })
      try {
        const parsed = await parseFile(file)
        contentTitle = parsed.title
        fullText = parsed.text
      } catch (err) {
        return NextResponse.json(
          { error: err instanceof Error ? err.message : '파일 파싱 실패' },
          { status: 400 }
        )
      }
      contentUrl = null

    } else if (type === 'text') {
      if (!inputTitle || !inputText) {
        return NextResponse.json({ error: 'title과 text가 필요합니다' }, { status: 400 })
      }
      contentTitle = inputTitle
      fullText = inputText
      contentUrl = null

    } else {
      return NextResponse.json({ error: '지원하지 않는 type입니다' }, { status: 400 })
    }

    const analysis = await analyzeContent(fullText, type)

    const { data: inserted, error: contentsError } = await supabase
      .from('contents')
      .insert({
        user_id: user.id,
        type,
        url: contentUrl,
        title: contentTitle,
        full_text: fullText,
        summary: analysis.summary,
        category: analysis.category,
        tags: analysis.tags,
        thumbnail_url: thumbnailUrl,
      })
      .select('id')
      .single()

    if (contentsError) throw contentsError

    const { error: scheduleError } = await supabase.from('review_schedule').insert({
      content_id: inserted.id,
      user_id: user.id,
    })

    if (scheduleError) throw scheduleError

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}
