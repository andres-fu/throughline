import { describe, it, expect } from 'vitest'
import { layoutChips } from '../../src/utils/layoutChips'

describe('layoutChips', () => {
  it('places a single chip at startX, y=0', () => {
    const { chips } = layoutChips(['Java'], 0, 300)
    expect(chips[0].x).toBe(0)
    expect(chips[0].y).toBe(0)
  })

  it('places chips side by side when they fit', () => {
    const { chips } = layoutChips(['Java', 'Go'], 0, 300)
    expect(chips[0].x).toBe(0)
    expect(chips[1].x).toBeGreaterThan(0)
    expect(chips[1].y).toBe(0)
  })

  it('wraps chip to next row when it overflows maxX', () => {
    const { chips } = layoutChips(['Java', 'Go'], 0, 40)
    expect(chips[1].y).toBeGreaterThan(0)
    expect(chips[1].x).toBe(0)
  })

  it('returns totalHeight of one row when no wrapping', () => {
    const { totalHeight } = layoutChips(['Java'], 0, 300, 16)
    expect(totalHeight).toBe(16)
  })

  it('returns totalHeight of two rows when wrapping occurs', () => {
    const { totalHeight } = layoutChips(['Java', 'Go'], 0, 40, 16, 4, 4)
    expect(totalHeight).toBe(36)
  })

  it('returns empty chips and zero height for empty input', () => {
    const { chips, totalHeight } = layoutChips([], 0, 300)
    expect(chips).toHaveLength(0)
    expect(totalHeight).toBe(0)
  })

  it('respects startX offset', () => {
    const { chips } = layoutChips(['Java'], 50, 300)
    expect(chips[0].x).toBe(50)
  })
})
