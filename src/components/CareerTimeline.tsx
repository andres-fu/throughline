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

type ViewMode = 'proportional' | 'equal'

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

  function toggleExpand(id: string) {
    setExpandedId(prev => (prev === id ? null : id))
  }

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
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", width }}>
      {/* View toggle */}
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

      {/* Time axis — only meaningful in proportional mode */}
      {viewMode === 'proportional' && (
        <svg width={width} height={24} style={{ display: 'block', marginBottom: 8 }}>
          {yearTicks.map(year => {
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
        </svg>
      )}

      {/* Equal mode: company name ticks along the bottom axis */}
      {viewMode === 'equal' && (
        <div style={{ height: 24, marginBottom: 8, position: 'relative' }}>
          {orderedEntries.filter(e => !e.isBreak).map((_, i) => {
            const x = i * slotWidth
            return (
              <div key={i} style={{ position: 'absolute', left: x, top: 0, width: slotWidth }}>
                <svg width={slotWidth} height={24}>
                  <line x1={0} y1={0} x2={0} y2={10} stroke="#d1d5db" strokeWidth={1} />
                </svg>
              </div>
            )
          })}
        </div>
      )}

      {/* Company rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {orderedEntries.map((entry, i) => {
          if (entry.isBreak) {
            if (viewMode === 'equal') return null
            const x = xScale(monthOffset(entry.breakStartDate!))
            const w = xScale(monthOffset(entry.breakEndDate!)) - x
            return (
              <div key={entry.id} style={{ position: 'relative', height: 32 }}>
                <svg width={width} height={32} style={{ position: 'absolute', top: 0, left: 0 }}>
                  <rect data-testid="break-bar" x={x} y={4} width={w} height={24} fill="#e5e7eb" rx={2} />
                  <text x={x + w / 2} y={20} textAnchor="middle" fontSize={9} fill="#9ca3af" letterSpacing={0.5}>
                    {entry.breakReason?.toUpperCase()}
                  </text>
                </svg>
              </div>
            )
          }

          const color = PALETTE[i % PALETTE.length]
          const isExpanded = expandedId === entry.id
          const allMetrics = entry.roles.flatMap(r => r.impactMetrics ?? [])
          const entryStart = entry.roles[0].startDate
          const entryEnd = entry.roles[entry.roles.length - 1].endDate
          const { barStart, barWidth } = getBarGeometry(entry, i)

          return (
            <div key={entry.id}>
              <div
                data-testid={`company-row-${entry.id}`}
                onClick={() => toggleExpand(entry.id)}
                style={{ position: 'relative', height: 52, cursor: 'pointer' }}
              >
                <svg width={width} height={52} style={{ position: 'absolute', top: 0, left: 0 }}>
                  {entry.roles.map(role => {
                    const { x, w } = getRoleGeometry(role, barStart, barWidth, entryStart, entryEnd)
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
                    left: barStart,
                    top: 2,
                    width: barWidth,
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
                </div>
              </div>

              {isExpanded && (
                <div
                  data-testid={`expanded-${entry.id}`}
                  style={{
                    marginLeft: barStart,
                    marginBottom: 8,
                    padding: '12px 16px',
                    borderLeft: `2px solid ${color}`,
                    background: '#f9fafb',
                  }}
                >
                  <p style={{ fontSize: 12, color: '#374151', marginBottom: allMetrics.length ? 10 : 0, lineHeight: 1.6 }}>
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
