import { describe, it, expect } from 'vitest'
import { formatDuration } from '../../src/utils/formatDuration'

describe('formatDuration', () => {
  it('formats months under a year', () => {
    expect(formatDuration(3)).toBe('3mo')
  })

  it('formats exactly one year', () => {
    expect(formatDuration(12)).toBe('1y')
  })

  it('formats years and months', () => {
    expect(formatDuration(18)).toBe('1y 6mo')
  })

  it('formats multiple years with no remainder', () => {
    expect(formatDuration(24)).toBe('2y')
  })

  it('formats multiple years with months', () => {
    expect(formatDuration(66)).toBe('5y 6mo')
  })

  it('formats 0 months', () => {
    expect(formatDuration(0)).toBe('0mo')
  })
})
