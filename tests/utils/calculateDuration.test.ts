import { describe, it, expect } from 'vitest'
import { calculateDuration } from '../../src/utils/calculateDuration'

describe('calculateDuration', () => {
  it('returns correct months between two dates', () => {
    expect(calculateDuration('2020-01', '2022-01')).toBe(24)
  })

  it('returns 1 for adjacent months', () => {
    expect(calculateDuration('2020-01', '2020-02')).toBe(1)
  })

  it('returns 0 when start and end are the same month', () => {
    expect(calculateDuration('2020-06', '2020-06')).toBe(0)
  })

  it('returns 0 when end is before start', () => {
    expect(calculateDuration('2022-01', '2020-01')).toBe(0)
  })

  it('treats "present" as today and returns a positive number', () => {
    expect(calculateDuration('2020-01', 'present')).toBeGreaterThan(0)
  })
})
