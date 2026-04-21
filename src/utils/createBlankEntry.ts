import type { CareerEntry } from '../data/career'

export function createBlankEntry(): CareerEntry {
  return {
    id: crypto.randomUUID(),
    company: 'New Company',
    companyType: 'startup',
    companyStage: 'early-startup',
    location: '',
    roles: [{ title: '', startDate: '', endDate: '', description: '' }],
    techStack: { languages: [], frameworks: [], tools: [], cloud: [] },
    highlights: [],
  }
}
