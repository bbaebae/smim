import { describe, it, expect } from 'vitest'
import { calculateNextReview } from '@/lib/sm2'

describe('calculateNextReview', () => {
  it('quality=5 → interval이 증가한다', () => {
    const result = calculateNextReview(2.5, 1, 5)
    expect(result.nextInterval).toBeGreaterThan(1)
    expect(result.nextEase).toBeGreaterThanOrEqual(2.5)
  })

  it('quality=1 → interval이 1로 리셋된다', () => {
    const result = calculateNextReview(2.5, 7, 1)
    expect(result.nextInterval).toBe(1)
  })

  it('quality=1 반복 시 ease_factor 최솟값 1.3을 유지한다', () => {
    let ease = 1.4
    for (let i = 0; i < 5; i++) {
      const result = calculateNextReview(ease, 1, 1)
      ease = result.nextEase
    }
    expect(ease).toBeGreaterThanOrEqual(1.3)
  })

  it('quality=5 연속 3회 → interval 시퀀스 1→2→5→13', () => {
    let interval = 1
    let ease = 2.5

    const r1 = calculateNextReview(ease, interval, 5)
    interval = r1.nextInterval
    ease = r1.nextEase
    expect(interval).toBe(2)

    const r2 = calculateNextReview(ease, interval, 5)
    interval = r2.nextInterval
    ease = r2.nextEase
    expect(interval).toBe(5)

    const r3 = calculateNextReview(ease, interval, 5)
    interval = r3.nextInterval
    expect(interval).toBe(13)
  })

  it('nextReviewAt은 오늘 기준 nextInterval일 후 날짜다', () => {
    const result = calculateNextReview(2.5, 1, 5)
    const expected = new Date()
    expected.setDate(expected.getDate() + result.nextInterval)
    expect(result.nextReviewAt.toDateString()).toBe(expected.toDateString())
  })

  it('nextEase는 소수점 2자리로 반올림된다', () => {
    const result = calculateNextReview(2.5, 1, 3)
    expect(result.nextEase).toBe(parseFloat(result.nextEase.toFixed(2)))
  })

  it('quality=3 → interval은 증가하고 ease는 소폭 감소한다', () => {
    const result = calculateNextReview(2.5, 2, 3)
    expect(result.nextInterval).toBeGreaterThan(2)
    // quality=3: ease + (0.1 - 2*0.08) = ease - 0.06
    expect(result.nextEase).toBe(2.44)
  })
})
