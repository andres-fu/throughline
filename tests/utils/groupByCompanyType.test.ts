import { describe, it, expect } from 'vitest'
import { groupByCompanyType } from '../../src/utils/groupByCompanyType'
import type { CareerEntry, CompanyType } from '../../src/data/career'

function makeEntry(id: string, companyType: CompanyType): CareerEntry {
  return {
    id,
    company: id,
    companyType,
    companyStage: 'growth',
    location: 'Austin, TX',
    roles: [{ title: 'Engineer', startDate: '2020-01', endDate: 'present', description: '' }],
    techStack: { languages: [], frameworks: [], tools: [], cloud: [] },
    highlights: [],
  }
}

describe('groupByCompanyType', () => {
  it('groups entries by company type', () => {
    const entries = [
      makeEntry('Blackbaud', 'enterprise'),
      makeEntry('HEB', 'enterprise'),
      makeEntry('Shippo', 'startup'),
    ]
    const groups = groupByCompanyType(entries)
    expect(groups.enterprise).toHaveLength(2)
    expect(groups.startup).toHaveLength(1)
  })

  it('returns an empty object for an empty array', () => {
    expect(groupByCompanyType([])).toEqual({})
  })

  it('each entry appears only in its own group', () => {
    const entries = [
      makeEntry('Blackbaud', 'enterprise'),
      makeEntry('Shippo', 'startup'),
    ]
    const groups = groupByCompanyType(entries)
    expect(groups.enterprise?.map(e => e.id)).toContain('Blackbaud')
    expect(groups.enterprise?.map(e => e.id)).not.toContain('Shippo')
    expect(groups.startup?.map(e => e.id)).toContain('Shippo')
  })

  it('omits company types with no entries', () => {
    const entries = [makeEntry('Blackbaud', 'enterprise')]
    const groups = groupByCompanyType(entries)
    expect(groups.startup).toBeUndefined()
    expect(groups.gaming).toBeUndefined()
  })
})
