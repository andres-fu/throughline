// ─────────────────────────────────────────────────────────────────────────────
// throughline — career data model
// This is the source of truth. Edit this file to update your timeline.
// ─────────────────────────────────────────────────────────────────────────────

export type CompanyType = 'enterprise' | 'startup' | 'gaming' | 'consulting' | 'agency'

export interface TechStack {
  languages: string[]
  frameworks: string[]
  tools: string[]
}

export interface Project {
  name: string
  description: string
  impact?: string
  tech: string[]
}

export interface Role {
  title: string
  startDate: string   // ISO 8601: "2019-03"
  endDate: string | 'present'
  description: string
  projects: Project[]
}

export interface CareerEntry {
  id: string
  company: string
  companyType: CompanyType
  location: string
  roles: Role[]
  techStack: TechStack
  highlights: string[]
}

export const career: CareerEntry[] = []
