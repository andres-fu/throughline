import { useState } from 'react'
import { scaleLinear } from 'd3-scale'
import type { CareerEntry, CompanyType, CompanyStage } from '../data/career'
import { sortEntriesByDate } from '../utils/sortEntriesByDate'
import { calculateDuration } from '../utils/calculateDuration'

const ORIGIN = '2014-12'
const MIN_CARD_WIDTH = 130
const WORK_TYPE_COLOR = '#374151'
const TECH_COLOR = '#9ca3af'

const PALETTE = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
]

const COMPANY_TYPE_COLORS: Record<CompanyType, string> = {
  enterprise: '#6366f1',
  startup:    '#10b981',
  gaming:     '#f59e0b',
  consulting: '#8b5cf6',
  agency:     '#ec4899',
}

const COMPANY_STAGE_COLORS: Record<CompanyStage, string> = {
  'pre-product':   '#fcd34d',
  'early-startup': '#86efac',
  'growth':        '#34d399',
  'scale-up':      '#06b6d4',
  'enterprise':    '#6366f1',
}

type ViewMode = 'proportional' | 'equal'

function presentDate(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function monthOffset(date: string): number {
  return calculateDuration(ORIGIN, date)
}

function chip(color: string, outline = false): React.CSSProperties {
  return {
    fontSize: 9,
    padding: '1px 7px',
    borderRadius: 10,
    background: outline ? 'transparent' : color,
    border: `1px solid ${color}`,
    color: outline ? color : 'white',
    letterSpacing: '0.05em',
    fontWeight: 600,
    whiteSpace: 'nowrap' as const,
    display: 'inline-block',
  }
}

function chipRow(marginBottom?: number): React.CSSProperties {
  return { display: 'flex', gap: 4, flexWrap: 'wrap', ...(marginBottom ? { marginBottom } : {}) }
}

interface Props {
  entries: CareerEntry[]
  width: number
}

export function CareerTimeline({ entries, width }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('proportional')

  const totalMonths = monthOffset(presentDate())
  const xScale = scaleLinear().domain([0, totalMonths]).range([0, width])

  const nonBreakEntries = sortEntriesByDate(entries.filter(e => !e.isBreak))
  const breakEntries = entries.filter(e => e.isBreak)

  const breakAsEntry = (b: CareerEntry): CareerEntry => ({
    ...b,
    roles: [{ title: '', startDate: b.breakStartDate!, endDate: b.breakEndDate!, description: '' }],
  })

  const orderedEntries = sortEntriesByDate([
    ...nonBreakEntries,
    ...breakEntries.map(breakAsEntry),
  ])

  const slotWidth = width / orderedEntries.length

  function getBarGeometry(entry: CareerEntry, slotIndex: number) {
    if (viewMode === 'proportional') {
      const firstStart = entry.roles[0].startDate
      const lastEnd = entry.roles[entry.roles.length - 1].endDate
      const barStart = xScale(monthOffset(firstStart))
      const barEnd = xScale(monthOffset(lastEnd === 'present' ? presentDate() : lastEnd))
      return { barStart, barWidth: barEnd - barStart }
    }
    return { barStart: slotIndex * slotWidth, barWidth: slotWidth }
  }

  function getRoleGeometry(role: { startDate: string; endDate: string | 'present' }, barStart: number, barWidth: number, entryStart: string, entryEnd: string) {
    if (viewMode === 'proportional') {
      const x = xScale(monthOffset(role.startDate))
      const end = role.endDate === 'present' ? presentDate() : role.endDate
      return { x, w: Math.max(xScale(monthOffset(end)) - x, 2) }
    }
    const entryDuration = calculateDuration(entryStart, entryEnd === 'present' ? presentDate() : entryEnd)
    const roleOffset = calculateDuration(entryStart, role.startDate)
    const roleDuration = calculateDuration(role.startDate, role.endDate === 'present' ? presentDate() : role.endDate)
    const x = barStart + (entryDuration > 0 ? (roleOffset / entryDuration) * barWidth : 0)
    const w = Math.max(entryDuration > 0 ? (roleDuration / entryDuration) * barWidth : barWidth, 2)
    return { x, w }
  }

  const yearTicks: number[] = []
  for (let y = 2015; y <= new Date().getFullYear() + 1; y++) yearTicks.push(y)

  const toggleStyle = (active: boolean, color = '#111827'): React.CSSProperties => ({
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.08em',
    padding: '3px 10px',
    border: `1px solid ${color}`,
    background: active ? color : 'transparent',
    color: active ? 'white' : color,
    cursor: 'pointer',
    fontFamily: 'inherit',
  })

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", width: width + 32, position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4, marginBottom: 12 }}>
        <button
          data-testid="toggle-proportional"
          aria-pressed={viewMode === 'proportional'}
          onClick={() => setViewMode('proportional')}
          style={toggleStyle(viewMode === 'proportional')}
        >
          PROPORTIONAL
        </button>
        <button
          data-testid="toggle-equal"
          aria-pressed={viewMode === 'equal'}
          onClick={() => setViewMode('equal')}
          style={toggleStyle(viewMode === 'equal')}
        >
          EQUAL WIDTH
        </button>
      </div>

      {viewMode === 'proportional' && (
        <svg width={width + 32} height={24} style={{ display: 'block', marginBottom: 8 }}>
          {yearTicks
            .filter(year => width + 16 - xScale(monthOffset(`${year}-01`)) > 50)
            .map(year => {
              const x = xScale(monthOffset(`${year}-01`))
              return (
                <g key={year}>
                  <line x1={x} y1={0} x2={x} y2={10} stroke="#d1d5db" strokeWidth={1} />
                  <text x={x + 4} y={20} fontSize={10} fill="#9ca3af" letterSpacing={1}>
                    {year}
                  </text>
                </g>
              )
            })}
          <line x1={width + 16} y1={0} x2={width + 16} y2={10} stroke="#ef4444" strokeWidth={1.5} />
          <text x={width + 16} y={20} fontSize={10} fill="#ef4444" textAnchor="middle" letterSpacing={1}>
            NOW
          </text>
        </svg>
      )}

      {viewMode === 'equal' && (
        <svg width={width} height={24} style={{ display: 'block', marginBottom: 8 }}>
          {orderedEntries.map((_, i) => (
            <line key={i} x1={i * slotWidth} y1={0} x2={i * slotWidth} y2={10} stroke="#d1d5db" strokeWidth={1} />
          ))}
        </svg>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
        {viewMode === 'proportional' && (
          <div
            data-testid="now-marker"
            style={{
              position: 'absolute',
              left: width + 14,
              top: 0,
              bottom: 0,
              width: 3,
              background: '#ef4444',
              opacity: 0.35,
              pointerEvents: 'none',
            }}
          />
        )}
        {orderedEntries.map((entry, i) => {
          if (entry.isBreak) {
            const bx = viewMode === 'proportional'
              ? xScale(monthOffset(entry.breakStartDate!))
              : i * slotWidth
            const bw = viewMode === 'proportional'
              ? xScale(monthOffset(entry.breakEndDate!)) - bx
              : slotWidth
            return (
              <div key={entry.id} style={{ position: 'relative', height: 36 }}>
                <svg width={width} height={36} style={{ position: 'absolute', top: 0, left: 0 }}>
                  <defs>
                    <clipPath id={`clip-break-${entry.id}`}>
                      <rect x={bx + 4} y={0} width={Math.max(bw - 8, 0)} height={36} />
                    </clipPath>
                  </defs>
                  <rect
                    data-testid="break-bar"
                    x={bx} y={0} width={bw} height={36}
                    fill="#f9fafb" stroke="#9ca3af" strokeWidth={1} strokeDasharray="4 3" rx={2}
                  />
                  <text
                    data-testid="break-reason"
                    x={bx + 8} y={22} fontSize={9} fill="#9ca3af"
                    fontStyle="italic" letterSpacing={0.3}
                    clipPath={`url(#clip-break-${entry.id})`}
                  >
                    {entry.breakReason?.toLowerCase()}
                  </text>
                </svg>
              </div>
            )
          }

          const color = PALETTE[i % PALETTE.length]
          const entryStart = entry.roles[0].startDate
          const entryEnd = entry.roles[entry.roles.length - 1].endDate
          const { barStart, barWidth } = getBarGeometry(entry, i)
          const cardWidth = Math.max(barWidth, MIN_CARD_WIDTH)

          const allWorkTypes = [...new Set(entry.roles.flatMap(r => r.workType ?? []))]
          const allTech = [
            ...entry.techStack.languages,
            ...entry.techStack.frameworks,
            ...entry.techStack.tools,
            ...entry.techStack.cloud,
          ].filter(Boolean)

          return (
            <div key={entry.id}>
              <div
                data-testid={`company-row-${entry.id}`}
                style={{ position: 'relative', height: 72 }}
              >
                <svg width={width} height={72} style={{ position: 'absolute', top: 0, left: 0 }}>
                  <defs>
                    {entry.roles.map(role => {
                      const { x, w } = getRoleGeometry(role, barStart, barWidth, entryStart, entryEnd)
                      const adjustedW = viewMode === 'proportional' ? Math.max(w, MIN_CARD_WIDTH) : w
                      return (
                        <clipPath key={role.startDate} id={`clip-${entry.id}-${role.startDate}`}>
                          <rect x={x + 4} y={36} width={Math.max(adjustedW - 8, 0)} height={36} />
                        </clipPath>
                      )
                    })}
                  </defs>
                  {entry.roles.map(role => {
                    const { x, w } = getRoleGeometry(role, barStart, barWidth, entryStart, entryEnd)
                    const adjustedW = viewMode === 'proportional' ? Math.max(w, MIN_CARD_WIDTH) : w
                    return (
                      <g key={role.startDate}>
                        <rect
                          data-testid="role-segment"
                          x={x} y={36} width={adjustedW} height={36}
                          fill={color} rx={2} opacity={0.9}
                        />
                        {w > 24 && (
                          <text
                            x={x + 8} y={58} fontSize={10} fill="white" opacity={0.9}
                            clipPath={`url(#clip-${entry.id}-${role.startDate})`}
                          >
                            {role.title}
                          </text>
                        )}
                      </g>
                    )
                  })}
                </svg>
                <div
                  data-testid="company-row"
                  style={{
                    position: 'absolute',
                    left: barStart,
                    top: 2,
                    width: cardWidth,
                    border: `1px solid ${color}`,
                    padding: '1px 6px',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    pointerEvents: 'none',
                  }}
                >
                  <span
                    data-testid={`company-label-${entry.id}`}
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      color: color,
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'block',
                    }}
                  >
                    {entry.company.toUpperCase()}
                  </span>
                  <span style={{ fontSize: 9, color: TECH_COLOR, display: 'block', letterSpacing: '0.04em' }}>
                    {entryStart.split('-')[0]} — {entryEnd === 'present' ? 'NOW' : entryEnd.split('-')[0]}
                  </span>
                </div>
              </div>

              <div
                data-testid={`metadata-lane-${entry.id}`}
                style={{
                  marginLeft: barStart,
                  width: cardWidth,
                  borderLeft: `1px solid ${color}`,
                  borderRight: `1px solid ${color}`,
                  borderBottom: `1px solid ${color}`,
                  padding: '6px 8px 8px',
                  boxSizing: 'border-box',
                  background: '#fafafa',
                }}
              >
                <div style={chipRow(5)}>
                  <span style={chip(COMPANY_TYPE_COLORS[entry.companyType])}>{entry.companyType}</span>
                  {entry.companyStage !== entry.companyType && (
                    <span style={chip(COMPANY_STAGE_COLORS[entry.companyStage])}>{entry.companyStage}</span>
                  )}
                </div>

                {allWorkTypes.length > 0 && (
                  <div style={chipRow(5)}>
                    {allWorkTypes.map(wt => (
                      <span key={wt} style={chip(WORK_TYPE_COLOR, true)}>{wt}</span>
                    ))}
                  </div>
                )}

                {allTech.length > 0 && (
                  <div style={chipRow()}>
                    {allTech.map(t => (
                      <span key={t} style={chip(TECH_COLOR, true)}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
