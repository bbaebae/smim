export function toFriendlyMessage(raw: string): string {
  if (!raw) return '잠시 후 다시 시도해주세요.'
  const r = raw.toLowerCase()

  if (r.includes('유효하지 않은 youtube') || (r.includes('youtube') && r.includes('url'))) {
    return '올바른 YouTube URL을 입력해주세요.'
  }
  if (r.includes('youtube') || r.includes('yt-dlp') || r.includes('ytdlp') || r.includes('자막') || r.includes('음성 인식')) {
    return '영상을 처리하지 못했습니다.\n잠시 후 다시 시도해주세요.'
  }
  if (r.includes('notion') && r.includes('url')) {
    return '올바른 Notion URL을 입력해주세요.'
  }
  if (r.includes('notion')) {
    return 'Notion 페이지를 불러오지 못했습니다.\n잠시 후 다시 시도해주세요.'
  }
  if (r.includes('네트워크') || r.includes('network') || r.includes('fetch')) {
    return '네트워크 연결을 확인하고 다시 시도해주세요.'
  }
  if (r.includes('url') || r.includes('invalid')) {
    return '올바른 URL인지 확인해주세요.'
  }
  if (r.includes('본문') || r.includes('추출') || r.includes('scrape') || r.includes('article')) {
    return '페이지 내용을 불러오지 못했습니다.\n잠시 후 다시 시도해주세요.'
  }

  return '콘텐츠를 처리하지 못했습니다.\n잠시 후 다시 시도해주세요.'
}
