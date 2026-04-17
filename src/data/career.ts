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
  breakStartDate?: string
  breakEndDate?: string
  roles: Role[]
  techStack: TechStack
  highlights: string[]
  inferred?: string[]
}

export const career: CareerEntry[] = [
  {
    id: 'ai-grants',
    company: 'AI Grants',
    companyType: 'consulting',
    companyStage: 'pre-product',
    location: 'Austin, TX (Remote)',
    roles: [
      {
        title: 'VP of Software Engineering',
        startDate: '2024-10',
        endDate: 'present',
        description:
          'Engaged as engineering leadership for an AI grants platform startup. Collaborated with executive leadership to define technical roadmap and prepare for product launch. Initiative did not advance to build phase — government rebuilt the intended solution, leading investors to withdraw.',
        workType: ['founding'],
        architecturePatterns: [],
        teamComposition: {
          directReports: 0,
          notes: 'No engineering team built — pre-funding collapse',
        },
        impactMetrics: [],
        inferred: [],
      },
    ],
    techStack: {
      languages: [],
      frameworks: [],
      tools: [],
      cloud: [],
    },
    highlights: ['Technical roadmap and org design for AI grants platform'],
  },

  {
    id: 'career-break-2024',
    company: 'Career Break',
    companyType: 'consulting',
    companyStage: 'growth',
    location: 'Austin, TX',
    isBreak: true,
    breakReason: 'Caregiving for a parent in palliative care',
    breakStartDate: '2024-05',
    breakEndDate: '2024-10',
    roles: [],
    techStack: { languages: [], frameworks: [], tools: [], cloud: [] },
    highlights: [],
  },

  {
    id: 'heb-digital',
    company: 'HEB Digital',
    companyType: 'enterprise',
    companyStage: 'enterprise',
    location: 'Austin, TX',
    roles: [
      {
        title: 'Software Engineering Manager',
        startDate: '2023-06',
        endDate: '2024-04',
        description:
          'Led strategic modernization across two product services — a legacy Java/Angular platform on AWS and a modern Python/React service on GCP. Transitioned the org to event-driven, service-oriented cloud architecture. Restructured agile processes and improved data engineering tooling to cut defect turnaround from 15 days to under a day.',
        workType: ['modernization', 'devops', 'data'],
        architecturePatterns: ['event-driven', 'cloud-native'],
        teamComposition: {
          totalTeamSize: 10,
        },
        impactMetrics: [
          { value: '20%', label: 'increase in team velocity' },
          { value: '<1 day', label: 'defect turnaround (down from 15 days)' },
          { value: '$200k/mo', label: 'cloud storage cost reduction' },
          { value: '$4M/yr', label: 'operating cost reduction via modernization' },
        ],
        inferred: [],
      },
    ],
    techStack: {
      languages: ['Java', 'Python'],
      frameworks: ['Angular', 'React', 'Spring Boot'],
      tools: [],
      cloud: ['AWS', 'GCP'],
    },
    highlights: [
      '$4M annual operating cost reduction',
      'Event-driven cloud architecture modernization',
      'Defect turnaround: 15 days → less than 1 day',
    ],
    inferred: ['techStack.frameworks'],
  },

  {
    id: 'shippo',
    company: 'Shippo',
    companyType: 'startup',
    companyStage: 'scale-up',
    location: 'Austin, TX',
    roles: [
      {
        title: 'Software Engineering Manager',
        startDate: '2022-05',
        endDate: '2023-04',
        description:
          'Led platform engineering team responsible for reconciliation services — the services tracking shipping reconciliations across the web application. Drove cross-departmental collaboration and mentored engineers on career growth and architectural decision-making.',
        workType: ['platform'],
        architecturePatterns: ['microservices', 'event-driven'],
        teamComposition: {
          totalTeamSize: 8,
        },
        impactMetrics: [
          { value: '10%', label: 'reduction in project delays' },
          { value: '11%', label: 'increase in sprint velocity' },
        ],
        projects: [
          {
            name: 'Reconciliation Services',
            description:
              'Platform team owning the microservices responsible for tracking shipping reconciliations across Shippo\'s web application.',
            tech: ['Python', 'Go'],
          },
        ],
        inferred: [],
      },
    ],
    techStack: {
      languages: ['Python', 'Go'],
      frameworks: ['React'],
      tools: [],
      cloud: ['GCP'],
    },
    highlights: [
      'Platform team: reconciliation microservices',
      'Engineering advisory council',
    ],
  },

  {
    id: 'dealerware',
    company: 'Dealerware',
    companyType: 'startup',
    companyStage: 'growth',
    location: 'Austin, TX',
    roles: [
      {
        title: 'Software Engineering Manager',
        startDate: '2020-06',
        endDate: '2022-05',
        description:
          'Led Application Engineering across a Ruby on Rails backend, React frontend, and native iOS/Android mobile apps. Built a new engineering career hierarchy, streamlined recruiting, and drove operational planning across three scrum teams.',
        workType: ['platform', 'founding'],
        architecturePatterns: [],
        teamComposition: {
          directReports: 4,
          notes: '3 architects, 1 manager, 3 scrum teams',
        },
        impactMetrics: [
          { value: '62.5%', label: 'faster recruiting (4 weeks → 1.5 weeks)' },
        ],
        inferred: ['architecturePatterns'],
      },
    ],
    techStack: {
      languages: ['Ruby', 'JavaScript', 'TypeScript'],
      frameworks: ['Ruby on Rails', 'React'],
      tools: [],
      cloud: [],
    },
    highlights: [
      'Application Engineering: frontend, backend, native iOS + Android',
      'New engineering career hierarchy',
      '62.5% faster candidate turnaround',
    ],
    inferred: ['techStack.cloud'],
  },

  {
    id: 'blackbaud',
    company: 'Blackbaud',
    companyType: 'enterprise',
    companyStage: 'enterprise',
    location: 'Austin, TX',
    roles: [
      {
        title: 'Engineering Manager',
        startDate: '2014-12',
        endDate: '2017-03',
        description:
          'Managed engineering teams during early tenure at Blackbaud. Established agile foundations and contributed to early platform initiatives.',
        workType: ['modernization'],
        architecturePatterns: [],
        teamComposition: {},
        impactMetrics: [],
        inferred: ['description', 'teamComposition'],
      },
      {
        title: 'Sr. Software Engineering Manager',
        startDate: '2017-04',
        endDate: '2020-06',
        description:
          'Transformed engineering from SCRUM-Waterfall with quarterly deployments to a fully Agile department with TDD, clean code standards, and 80% minimum code coverage. Led the early Kafka cluster team and built the recurring giving service for RENXT. Migrated cloud infrastructure from AWS to Azure.',
        workType: ['modernization', 'platform', 'devops'],
        architecturePatterns: ['event-driven', 'cloud-native'],
        teamComposition: {
          totalTeamSize: 12,
          notes: '2 teams averaging 6 engineers each',
        },
        projects: [
          {
            name: 'Kafka Cluster',
            description:
              'Led the early Kafka cluster team, establishing event streaming infrastructure for the engineering org.',
            tech: ['Kafka', 'Java'],
          },
          {
            name: 'RENXT Recurring Giving Service',
            description:
              'Built the recurring giving service for Blackbaud\'s RENXT nonprofit CRM product.',
            tech: ['Java', 'Spring Boot'],
          },
        ],
        impactMetrics: [
          { value: '$4M/yr', label: 'cloud contract savings' },
          { value: '$1.5M/yr', label: 'engineering resource cost savings' },
          { value: '80%', label: 'minimum code coverage enforced' },
        ],
        inferred: [],
      },
    ],
    techStack: {
      languages: ['Java'],
      frameworks: ['Spring Boot'],
      tools: ['Kafka'],
      cloud: ['AWS', 'Azure'],
    },
    highlights: [
      'Agile transformation from SCRUM-Waterfall',
      'Led Kafka cluster team',
      'RENXT recurring giving service',
      '$4M annual cloud savings',
      '$1.5M annual resource savings',
    ],
  },
]
