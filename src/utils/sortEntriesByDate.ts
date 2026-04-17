import type { CareerEntry } from '../data/career'

export function sortEntriesByDate(entries: CareerEntry[]): CareerEntry[] {
  return [...entries].sort((a, b) => {
    const aStart = a.roles[0]?.startDate ?? ''
    const bStart = b.roles[0]?.startDate ?? ''
    return aStart.localeCompare(bStart)
  })
}
