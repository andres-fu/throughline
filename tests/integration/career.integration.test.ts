import { describe, it, expect } from 'vitest'
import { career } from '../../src/data/career'
import { sortEntriesByDate } from '../../src/utils/sortEntriesByDate'
import { groupByCompanyType } from '../../src/utils/groupByCompanyType'
import { calculateDuration } from '../../src/utils/calculateDuration'

const nonBreakEntries = career.filter(e => !e.isBreak)

describe('career data — real data integration', () => {
  describe('sortEntriesByDate', () => {
    it('sorts non-break entries with blackbaud first and ai-grants last', () => {
      const sorted = sortEntriesByDate(nonBreakEntries)
      expect(sorted[0].id).toBe('blackbaud')
      expect(sorted[sorted.length - 1].id).toBe('ai-grants')
    })

    it('does not include the career break in non-break entries', () => {
      const ids = sortEntriesByDate(nonBreakEntries).map(e => e.id)
      expect(ids).not.toContain('career-break-2024')
    })
  })

  describe('groupByCompanyType', () => {
    it('produces enterprise and startup groups from real data', () => {
      const groups = groupByCompanyType(nonBreakEntries)
      expect(groups.enterprise).toHaveLength(2)  // Blackbaud + HEB
      expect(groups.startup).toHaveLength(2)      // Shippo + Dealerware
      expect(groups.consulting).toHaveLength(1)   // AI Grants
    })

    it('has no gaming or agency groups', () => {
      const groups = groupByCompanyType(nonBreakEntries)
      expect(groups.gaming).toBeUndefined()
      expect(groups.agency).toBeUndefined()
    })
  })

  describe('calculateDuration', () => {
    it('calculates blackbaud tenure as ~66 months', () => {
      const duration = calculateDuration('2014-12', '2020-06')
      expect(duration).toBe(66)
    })

    it('calculates heb tenure as 10 months', () => {
      const duration = calculateDuration('2023-06', '2024-04')
      expect(duration).toBe(10)
    })

    it('career break duration is 5 months', () => {
      const duration = calculateDuration('2024-05', '2024-10')
      expect(duration).toBe(5)
    })

    it('ai grants is ongoing — duration grows over time', () => {
      const duration = calculateDuration('2024-10', 'present')
      expect(duration).toBeGreaterThan(0)
    })
  })

  describe('data integrity', () => {
    it('all non-break entries have at least one role', () => {
      nonBreakEntries.forEach(entry => {
        expect(entry.roles.length).toBeGreaterThan(0)
      })
    })

    it('all roles have valid startDate format', () => {
      nonBreakEntries.forEach(entry => {
        entry.roles.forEach(role => {
          expect(role.startDate).toMatch(/^\d{4}-\d{2}$/)
        })
      })
    })

    it('no role has endDate before startDate', () => {
      nonBreakEntries.forEach(entry => {
        entry.roles.forEach(role => {
          const duration = calculateDuration(role.startDate, role.endDate)
          expect(duration).toBeGreaterThanOrEqual(0)
        })
      })
    })
  })
})
