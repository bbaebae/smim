import { YoutubeTranscript } from 'youtube-transcript'

export function extractVideoId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

export async function getYoutubeTranscript(url: string): Promise<string> {
  const videoId = extractVideoId(url)
  if (!videoId) throw new Error(`유효하지 않은 YouTube URL: ${url}`)

  try {
    const segments = await YoutubeTranscript.fetchTranscript(videoId)
    return segments.map((s) => s.text).join(' ')
  } catch {
    throw new Error('자막 없음')
  }
}

export function getYoutubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}
