export type ReviewResult = {
  nextInterval: number
  nextEase: number
  nextReviewAt: Date
}

export function calculateNextReview(
  ease: number,
  interval: number,
  quality: number
): ReviewResult {
  let nextInterval: number
  let nextEase: number

  if (quality >= 3) {
    nextInterval = Math.floor(interval * ease)
    nextEase = ease + (0.1 - (5 - quality) * 0.08)
  } else {
    nextInterval = 1
    nextEase = Math.max(1.3, ease - 0.2)
  }

  nextEase = parseFloat(nextEase.toFixed(2))

  const nextReviewAt = new Date()
  nextReviewAt.setDate(nextReviewAt.getDate() + nextInterval)

  return { nextInterval, nextEase, nextReviewAt }
}
