import { describe, it, expect } from 'vitest'
import { sortEntriesByDate } from '../../src/utils/sortEntriesByDate'
import type { CareerEntry } from '../../src/data/career'

function makeEntry(startDate: string): CareerEntry {
  return {
    id: startDate,
    company: 'Test Co',
    companyType: 'startup',
    companyStage: 'growth',
    location: 'Austin, TX',
    roles: [{ title: 'Engineer', startDate, endDate: 'present', description: '' }],
    techStack: { languages: [], frameworks: [], tools: [], cloud: [] },
    highlights: [],
  }
}

describe('sortEntriesByDate', () => {
  it('sorts entries oldest first', () => {
    const entries = [
      makeEntry('2022-01'),
      makeEntry('2018-06'),
      makeEntry('2020-03'),
    ]
    const sorted = sortEntriesByDate(entries)
    expect(sorted[0].roles[0].startDate).toBe('2018-06')
    expect(sorted[1].roles[0].startDate).toBe('2020-03')
    expect(sorted[2].roles[0].startDate).toBe('2022-01')
  })

  it('returns an empty array unchanged', () => {
    expect(sortEntriesByDate([])).toEqual([])
  })

  it('returns a single entry unchanged', () => {
    const entries = [makeEntry('2020-01')]
    expect(sortEntriesByDate(entries)).toEqual(entries)
  })

  it('does not mutate the original array', () => {
    const entries = [makeEntry('2022-01'), makeEntry('2018-06')]
    const original = [entries[0], entries[1]]
    sortEntriesByDate(entries)
    expect(entries[0]).toBe(original[0])
    expect(entries[1]).toBe(original[1])
  })
})
