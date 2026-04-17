import { useState } from 'react'
import { scaleLinear } from 'd3-scale'
import type { CareerEntry } from '../data/career'
import { sortEntriesByDate } from '../utils/sortEntriesByDate'
import { calculateDuration } from '../utils/calculateDuration'

const ORIGIN = '2014-12'

const PALETTE = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
]

function presentDate(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function monthOffset(date: string): number {
  return calculateDuration(ORIGIN, date)
}

interface Props {
  entries: CareerEntry[]
  width: number
}

export function CareerTimeline({ entries, width }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

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

  const yearTicks: number[] = []
  const startYear = 2015
  const endYear = new Date().getFullYear() + 1
  for (let y = startYear; y <= endYear; y++) {
    yearTicks.push(y)
  }

  function toggleExpand(id: string) {
    setExpandedId(prev => (prev === id ? null : id))
  }

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", width }}>
      {/* Time axis */}
      <svg width={width} height={24} style={{ display: 'block', marginBottom: 8 }}>
        {yearTicks.map(year => {
          const x = xScale(monthOffset(`${year}-01`))
          return (
            <g key={year}>
              <line x1={x} y1={0} x2={x} y2={10} stroke="#374151" strokeWidth={1} />
              <text x={x + 4} y={20} fontSize={10} fill="#6b7280" letterSpacing={1}>
                {year}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Company rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {orderedEntries.map((entry, i) => {
          if (entry.isBreak) {
            const x = xScale(monthOffset(entry.breakStartDate!))
            const w = xScale(monthOffset(entry.breakEndDate!)) - x
            return (
              <div key={entry.id} style={{ position: 'relative', height: 32 }}>
                <svg width={width} height={32} style={{ position: 'absolute', top: 0, left: 0 }}>
                  <rect
                    data-testid="break-bar"
                    x={x} y={4} width={w} height={24}
                    fill="#1f2937" rx={2}
                  />
                  <text x={x + w / 2} y={20} textAnchor="middle" fontSize={9} fill="#6b7280" letterSpacing={0.5}>
                    {entry.breakReason?.toUpperCase()}
                  </text>
                </svg>
              </div>
            )
          }

          const color = PALETTE[i % PALETTE.length]
          const isExpanded = expandedId === entry.id
          const allMetrics = entry.roles.flatMap(r => r.impactMetrics ?? [])

          return (
            <div key={entry.id}>
              <div
                data-testid={`company-row-${entry.id}`}
                onClick={() => toggleExpand(entry.id)}
                style={{ position: 'relative', height: 52, cursor: 'pointer' }}
              >
                <svg width={width} height={52} style={{ position: 'absolute', top: 0, left: 0 }}>
                  {entry.roles.map(role => {
                    const end = role.endDate === 'present' ? presentDate() : role.endDate
                    const x = xScale(monthOffset(role.startDate))
                    const w = Math.max(xScale(monthOffset(end)) - x, 2)
                    return (
                      <g key={role.startDate}>
                        <rect
                          data-testid="role-segment"
                          x={x} y={20} width={w} height={28}
                          fill={color} rx={2} opacity={0.9}
                        />
                        {w > 60 && (
                          <text x={x + 8} y={38} fontSize={10} fill="white" opacity={0.9}>
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
                    left: xScale(monthOffset(entry.roles[0].startDate)),
                    top: 2,
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
                    }}
                  >
                    {entry.company.toUpperCase()}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div
                  data-testid={`expanded-${entry.id}`}
                  style={{
                    marginLeft: xScale(monthOffset(entry.roles[0].startDate)),
                    marginBottom: 8,
                    padding: '12px 16px',
                    borderLeft: `2px solid ${color}`,
                    background: '#111827',
                  }}
                >
                  <p style={{ fontSize: 12, color: '#d1d5db', marginBottom: allMetrics.length ? 10 : 0, lineHeight: 1.6 }}>
                    {entry.roles[entry.roles.length - 1].description}
                  </p>
                  {allMetrics.length > 0 && (
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      {allMetrics.map((m, idx) => (
                        <div key={idx}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: color }}>{m.value}</div>
                          <div style={{ fontSize: 10, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{m.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
