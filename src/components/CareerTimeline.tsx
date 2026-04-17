import { scaleLinear } from 'd3-scale'
import type { CareerEntry } from '../data/career'
import { sortEntriesByDate } from '../utils/sortEntriesByDate'
import { calculateDuration } from '../utils/calculateDuration'

const ORIGIN = '2014-12'
const LABEL_HEIGHT = 16
const SEGMENT_HEIGHT = 24
const ROW_GAP = 24
const ROW_HEIGHT = LABEL_HEIGHT + SEGMENT_HEIGHT + ROW_GAP
const PADDING_TOP = 32
const PADDING_HORIZONTAL = 16

function monthOffset(date: string): number {
  return calculateDuration(ORIGIN, date)
}

function presentDate(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

interface Props {
  entries: CareerEntry[]
  width: number
}

export function CareerTimeline({ entries, width }: Props) {
  const totalMonths = monthOffset(presentDate())
  const xScale = scaleLinear()
    .domain([0, totalMonths])
    .range([PADDING_HORIZONTAL, width - PADDING_HORIZONTAL])

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

  const svgHeight = PADDING_TOP + orderedEntries.length * ROW_HEIGHT

  return (
    <svg width={width} height={svgHeight} role="img" aria-label="Career timeline">
      {orderedEntries.map((entry, i) => {
        const rowY = PADDING_TOP + i * ROW_HEIGHT

        if (entry.isBreak) {
          const x = xScale(monthOffset(entry.breakStartDate!))
          const w = xScale(monthOffset(entry.breakEndDate!)) - x
          return (
            <g key={entry.id} data-testid="break-bar" transform={`translate(0, ${rowY})`}>
              <rect x={x} y={LABEL_HEIGHT} width={w} height={SEGMENT_HEIGHT} fill="#4b5563" opacity={0.5} rx={3} />
              <text x={x + w / 2} y={LABEL_HEIGHT + SEGMENT_HEIGHT / 2 + 4} textAnchor="middle" fontSize={10} fill="#9ca3af">
                {entry.breakReason}
              </text>
            </g>
          )
        }

        return (
          <g key={entry.id} data-testid={`company-row-${entry.id}`}>
            <text
              x={xScale(monthOffset(entry.roles[0].startDate))}
              y={rowY + LABEL_HEIGHT - 2}
              fontSize={12}
              fontWeight="bold"
              fill="#f3f4f6"
            >
              {entry.company}
            </text>
            <g data-testid="company-row">
              {entry.roles.map(role => {
                const end = role.endDate === 'present' ? presentDate() : role.endDate
                const x = xScale(monthOffset(role.startDate))
                const w = Math.max(xScale(monthOffset(end)) - x, 2)
                return (
                  <rect
                    key={role.startDate}
                    data-testid="role-segment"
                    x={x}
                    y={rowY + LABEL_HEIGHT}
                    width={w}
                    height={SEGMENT_HEIGHT}
                    fill="#3b82f6"
                    rx={3}
                  />
                )
              })}
            </g>
          </g>
        )
      })}
    </svg>
  )
}
