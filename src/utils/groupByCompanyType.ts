import type { CareerEntry, CompanyType } from '../data/career'

export function groupByCompanyType(
  entries: CareerEntry[]
): Partial<Record<CompanyType, CareerEntry[]>> {
  return entries.reduce<Partial<Record<CompanyType, CareerEntry[]>>>((groups, entry) => {
    const group = groups[entry.companyType] ?? []
    return { ...groups, [entry.companyType]: [...group, entry] }
  }, {})
}
