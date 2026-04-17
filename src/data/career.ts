export type CompanyType = 'enterprise' | 'startup' | 'gaming' | 'consulting' | 'agency'

export type CompanyStage = 'pre-product' | 'early-startup' | 'growth' | 'scale-up' | 'enterprise'

export type WorkType =
  | 'greenfield'
  | 'modernization'
  | 'platform'
  | 'data'
  | 'ai-ml'
  | 'devops'
  | 'founding'

export type ArchitecturePattern =
  | 'event-driven'
  | 'microservices'
  | 'cloud-native'
  | 'serverless'
  | 'distributed'
  | 'ai-ml'

export interface TechStack {
  languages: string[]
  frameworks: string[]
  tools: string[]
  cloud: string[]
}

export interface ImpactMetric {
  value: string
  label: string
}

export interface TeamComposition {
  directReports?: number
  totalTeamSize?: number
  notes?: string
}

export interface Project {
  name: string
  description: string
  impact?: string
  tech: string[]
}

export interface Role {
  title: string
  startDate: string
  endDate: string | 'present'
  description: string
  projects?: Project[]
  impactMetrics?: ImpactMetric[]
  teamComposition?: TeamComposition
  architecturePatterns?: ArchitecturePattern[]
  workType?: WorkType[]
  inferred?: string[]
}

export interface CareerEntry {
  id: string
  company: string
  companyType: CompanyType
  companyStage: CompanyStage
  location: string
  isBreak?: boolean
  breakReason?: string
  roles: Role[]
  techStack: TechStack
  highlights: string[]
  inferred?: string[]
}

export const career: CareerEntry[] = []
