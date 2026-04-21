import { useState, useRef } from 'react'
import { scaleLinear } from 'd3-scale'
import type { CareerEntry, CompanyType, CompanyStage } from '../data/career'
import { sortEntriesByDate } from '../utils/sortEntriesByDate'
import { calculateDuration } from '../utils/calculateDuration'
import { formatDuration } from '../utils/formatDuration'
import { layoutChips, estimateChipWidth } from '../utils/layoutChips'

// ── Geometry constants ──────────────────────────────────────────────────────
const ORIGIN        = '2014-12'
const MIN_CARD_W    = 130
const ACCENT_W      = 4
const AXIS_H        = 32
const LABEL_H       = 36
const BAR_H         = 36
const ENTRY_BAR_H   = LABEL_H + BAR_H   // 72
const BREAK_H       = 36
const ENTRY_GAP     = 12
const META_PAD_TOP  = 6
const META_PAD_BOT  = 8
const META_PAD_X    = 8
const LABEL_COL_W   = 38
const CHIP_H        = 16
const CHIP_H_GAP    = 4
const CHIP_V_GAP    = 4
const ROW_SPACING   = 5

// ── Colours ─────────────────────────────────────────────────────────────────
const PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
const WORK_TYPE_COLOR = '#374151'
const TECH_COLOR      = '#9ca3af'

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

// ── Pure helpers ─────────────────────────────────────────────────────────────
function presentDate(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function monthOffset(date: string): number {
  return calculateDuration(ORIGIN, date)
}

// ── SVG chip ─────────────────────────────────────────────────────────────────
interface SvgChipProps {
  label: string; x: number; y: number; w: number
  color: string; outline?: boolean
}
function SvgChip({ label, x, y, w, color, outline = false }: SvgChipProps) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={CHIP_H} rx={CHIP_H / 2}
        fill={outline ? 'none' : color} stroke={color} strokeWidth={1} />
      <text x={x + w / 2} y={y + CHIP_H / 2 + 3.5} textAnchor="middle"
        fontSize={9} fontWeight={600} letterSpacing={0.5}
        fill={outline ? color : 'white'}>
        {label}
      </text>
    </g>
  )
}

// ── Metadata row layout helper ───────────────────────────────────────────────
interface MetaRowDef {
  sectionLabel: string
  chips: Array<{ label: string; color: string; outline: boolean }>
}

function computeMetaSection(rows: MetaRowDef[], metaW: number) {
  const chipsStartX = LABEL_COL_W
  const chipsMaxX   = metaW - META_PAD_X

  let y = META_PAD_TOP
  const laid = rows.map((row, i) => {
    const labels  = row.chips.map(c => c.label)
    const { chips: positions, totalHeight } = layoutChips(
      labels, chipsStartX, chipsMaxX, CHIP_H, CHIP_H_GAP, CHIP_V_GAP,
    )
    const rowY = y
    y += totalHeight + (i < rows.length - 1 ? ROW_SPACING : 0)
    return { ...row, positions, rowY }
  })

  return { rows: laid, totalHeight: y + META_PAD_BOT }
}

// ── Props ────────────────────────────────────────────────────────────────────
interface Props {
  entries: CareerEntry[]
  width: number
  onEntryClick?: (id: string) => void
  svgRef?: React.RefObject<SVGSVGElement>
}

export function CareerTimeline({ entries, width, onEntryClick, svgRef: externalRef }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('proportional')
  const internalRef = useRef<SVGSVGElement>(null)
  const svgRef = externalRef ?? internalRef

  const totalMonths = monthOffset(presentDate())
  const xScale      = scaleLinear().domain([0, totalMonths]).range([0, width])

  const nonBreakEntries = sortEntriesByDate(entries.filter(e => !e.isBreak))
  const breakEntries    = entries.filter(e => e.isBreak)
  const breakAsEntry    = (b: CareerEntry): CareerEntry => ({
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
      const lastEnd    = entry.roles[entry.roles.length - 1].endDate
      const barStart   = xScale(monthOffset(firstStart))
      const barEnd     = xScale(monthOffset(lastEnd === 'present' ? presentDate() : lastEnd))
      return { barStart, barWidth: barEnd - barStart }
    }
    return { barStart: slotIndex * slotWidth, barWidth: slotWidth }
  }

  function getRoleGeometry(
    role: { startDate: string; endDate: string | 'present' },
    barStart: number, barWidth: number, entryStart: string, entryEnd: string,
  ) {
    if (viewMode === 'proportional') {
      const x   = xScale(monthOffset(role.startDate))
      const end = role.endDate === 'present' ? presentDate() : role.endDate
      return { x, w: Math.max(xScale(monthOffset(end)) - x, 2) }
    }
    const entryDur = calculateDuration(entryStart, entryEnd === 'present' ? presentDate() : entryEnd)
    const roleOff  = calculateDuration(entryStart, role.startDate)
    const roleDur  = calculateDuration(role.startDate, role.endDate === 'present' ? presentDate() : role.endDate)
    const x = barStart + (entryDur > 0 ? (roleOff / entryDur) * barWidth : 0)
    const w = Math.max(entryDur > 0 ? (roleDur / entryDur) * barWidth : barWidth, 2)
    return { x, w }
  }

  // ── Compute per-entry heights ──────────────────────────────────────────────
  function entryHeight(entry: CareerEntry, slotIndex: number): number {
    if (entry.isBreak) return BREAK_H

    const { barWidth } = getBarGeometry(entry, slotIndex)
    const cardW  = Math.max(barWidth, MIN_CARD_W)
    const metaW  = cardW - ACCENT_W - META_PAD_X

    const allWorkTypes = [...new Set(entry.roles.flatMap(r => r.workType ?? []))]
    const teamChips    = buildTeamChips(entry)
    const allTech      = [...entry.techStack.languages, ...entry.techStack.frameworks,
                          ...entry.techStack.tools, ...entry.techStack.cloud].filter(Boolean)

    const metaRows = buildMetaRows(entry, allWorkTypes, teamChips, allTech)
    const { totalHeight: metaH } = computeMetaSection(metaRows, metaW + META_PAD_X)
    return ENTRY_BAR_H + metaH
  }

  const entryHeights  = orderedEntries.map((e, i) => entryHeight(e, i))
  const entryYOffsets = entryHeights.reduce<number[]>((acc, h, i) => {
    acc.push(i === 0 ? AXIS_H : acc[i - 1] + entryHeights[i - 1] + ENTRY_GAP)
    return acc
  }, [])
  const totalSvgH = AXIS_H + entryHeights.reduce((s, h) => s + h, 0) + (orderedEntries.length - 1) * ENTRY_GAP
  const svgW      = width + 32

  const yearTicks: number[] = []
  for (let y = 2015; y <= new Date().getFullYear() + 1; y++) yearTicks.push(y)
  const visibleYearTicks = yearTicks.filter(y => width + 16 - xScale(monthOffset(`${y}-01`)) > 50)

  // ── Toggle style ─────────────────────────────────────────────────────────
  const toggleStyle = (active: boolean): React.CSSProperties => ({
    fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', padding: '3px 10px',
    border: '1px solid #111827',
    background: active ? '#111827' : 'transparent',
    color: active ? 'white' : '#111827',
    cursor: 'pointer', fontFamily: 'inherit',
  })

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", width: svgW }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4, marginBottom: 12 }}>
        <button data-testid="toggle-proportional" aria-pressed={viewMode === 'proportional'}
          onClick={() => setViewMode('proportional')} style={toggleStyle(viewMode === 'proportional')}>
          PROPORTIONAL
        </button>
        <button data-testid="toggle-equal" aria-pressed={viewMode === 'equal'}
          onClick={() => setViewMode('equal')} style={toggleStyle(viewMode === 'equal')}>
          EQUAL WIDTH
        </button>
      </div>

      <svg ref={svgRef} width={svgW} height={totalSvgH}
        viewBox={`0 0 ${svgW} ${totalSvgH}`}
        style={{ display: 'block', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

        {/* ── Axis ── */}
        {viewMode === 'proportional' && (
          <g>
            {visibleYearTicks.map(year => {
              const x = xScale(monthOffset(`${year}-01`))
              return (
                <g key={year}>
                  <line x1={x} y1={0} x2={x} y2={10} stroke="#d1d5db" strokeWidth={1} />
                  <text x={x + 4} y={20} fontSize={10} fill="#9ca3af" letterSpacing={1}>{year}</text>
                </g>
              )
            })}
            <line x1={width + 16} y1={0} x2={width + 16} y2={10} stroke="#ef4444" strokeWidth={1.5} />
            <text x={width + 16} y={20} fontSize={10} fill="#ef4444" textAnchor="middle" letterSpacing={1}>NOW</text>
          </g>
        )}
        {viewMode === 'equal' && (
          <g>
            {orderedEntries.map((_, i) => (
              <line key={i} x1={i * slotWidth} y1={0} x2={i * slotWidth} y2={10} stroke="#d1d5db" strokeWidth={1} />
            ))}
          </g>
        )}

        {/* ── Year grid lines ── */}
        {viewMode === 'proportional' && (
          <g data-testid="year-grid">
            {visibleYearTicks.map(year => {
              const x = xScale(monthOffset(`${year}-01`))
              return <line key={year} x1={x} y1={AXIS_H} x2={x} y2={totalSvgH} stroke="#e5e7eb" strokeWidth={1} />
            })}
          </g>
        )}

        {/* ── NOW marker ── */}
        {viewMode === 'proportional' && (
          <line data-testid="now-marker"
            x1={width + 16} y1={AXIS_H} x2={width + 16} y2={totalSvgH}
            stroke="#ef4444" strokeWidth={3} opacity={0.35} />
        )}

        {/* ── Entries ── */}
        {orderedEntries.map((entry, i) => {
          const yOff = entryYOffsets[i]

          // ── Break entry ──
          if (entry.isBreak) {
            const bx = viewMode === 'proportional'
              ? xScale(monthOffset(entry.breakStartDate!))
              : i * slotWidth
            const bw = viewMode === 'proportional'
              ? xScale(monthOffset(entry.breakEndDate!)) - bx
              : slotWidth
            return (
              <g key={entry.id} transform={`translate(0, ${yOff})`}>
                <rect data-testid="break-bar"
                  x={bx} y={0} width={bw} height={BREAK_H}
                  fill="#f9fafb" stroke="#9ca3af" strokeWidth={1} strokeDasharray="4 3" rx={2} />
                <clipPath id={`clip-break-${entry.id}`}>
                  <rect x={bx + 4} y={0} width={Math.max(bw - 8, 0)} height={BREAK_H} />
                </clipPath>
                <text data-testid="break-reason"
                  x={bx + 8} y={22} fontSize={9} fill="#9ca3af"
                  fontStyle="italic" letterSpacing={0.3}
                  clipPath={`url(#clip-break-${entry.id})`}>
                  {entry.breakReason?.toLowerCase()}
                </text>
              </g>
            )
          }

          // ── Regular entry ──
          const color      = PALETTE[i % PALETTE.length]
          const entryStart = entry.roles[0].startDate
          const entryEnd   = entry.roles[entry.roles.length - 1].endDate
          const { barStart, barWidth } = getBarGeometry(entry, i)
          const cardW      = Math.max(barWidth, MIN_CARD_W)
          const metaW      = cardW - ACCENT_W

          const allWorkTypes = [...new Set(entry.roles.flatMap(r => r.workType ?? []))]
          const teamChips    = buildTeamChips(entry)
          const allTech      = [...entry.techStack.languages, ...entry.techStack.frameworks,
                                ...entry.techStack.tools, ...entry.techStack.cloud].filter(Boolean)

          const metaRows = buildMetaRows(entry, allWorkTypes, teamChips, allTech)
          const { rows: laidRows, totalHeight: metaH } = computeMetaSection(metaRows, metaW)
          const totalEntryH = ENTRY_BAR_H + metaH

          const dateRange = `${entryStart.split('-')[0]} — ${entryEnd === 'present' ? 'NOW' : entryEnd.split('-')[0]} · ${formatDuration(calculateDuration(entryStart, entryEnd === 'present' ? presentDate() : entryEnd))}`

          return (
            <g key={entry.id}
              data-testid={`company-row-${entry.id}`}
              transform={`translate(0, ${yOff})`}
              onClick={() => onEntryClick?.(entry.id)}
              style={{ cursor: onEntryClick ? 'pointer' : 'default' }}>

              {/* Test marker for count queries */}
              <rect data-testid="company-row" x={barStart} y={0}
                width={cardW} height={totalEntryH} fill="transparent" />

              {/* Accent stripe */}
              <rect x={barStart} y={0} width={ACCENT_W} height={totalEntryH}
                fill={color} rx={2} />

              {/* Label area */}
              <text data-testid={`company-label-${entry.id}`}
                x={barStart + ACCENT_W + 4} y={14}
                fontSize={10} fontWeight={700} letterSpacing={1} fill={color}>
                {entry.company.toUpperCase()}
              </text>
              <text x={barStart + ACCENT_W + 4} y={26}
                fontSize={9} fill={TECH_COLOR} letterSpacing={0.5}>
                {dateRange}
              </text>

              {/* Role bars */}
              {entry.roles.map(role => {
                const { x, w } = getRoleGeometry(role, barStart, barWidth, entryStart, entryEnd)
                const adjW = viewMode === 'proportional' ? Math.max(w, MIN_CARD_W) : w
                return (
                  <g key={role.startDate}>
                    <clipPath id={`clip-${entry.id}-${role.startDate}`}>
                      <rect x={x + 4} y={LABEL_H} width={Math.max(adjW - 8, 0)} height={BAR_H} />
                    </clipPath>
                    <rect data-testid="role-segment"
                      x={x} y={LABEL_H} width={adjW} height={BAR_H}
                      fill={color} rx={2} />
                    {w > 24 && (
                      <text x={x + 8} y={LABEL_H + 22} fontSize={10} fill="white"
                        clipPath={`url(#clip-${entry.id}-${role.startDate})`}>
                        {role.title}
                      </text>
                    )}
                  </g>
                )
              })}

              {/* Metadata lane */}
              <g data-testid={`metadata-lane-${entry.id}`}
                transform={`translate(${barStart + ACCENT_W}, ${ENTRY_BAR_H})`}>
                <rect x={0} y={0} width={metaW} height={metaH} fill="#f9fafb" />
                {laidRows.map(row => (
                  <g key={row.sectionLabel} transform={`translate(${META_PAD_X}, ${row.rowY})`}>
                    <text x={0} y={CHIP_H - 4} fontSize={8} fontWeight={700}
                      letterSpacing={1} fill="#9ca3af">
                      {row.sectionLabel}
                    </text>
                    {row.positions.map((pos, pi) => {
                      const chipDef = row.chips[pi] ?? { color: TECH_COLOR, outline: true }
                      return (
                        <SvgChip key={pos.label}
                          label={pos.label} x={pos.x} y={pos.y}
                          w={pos.w} color={chipDef.color} outline={chipDef.outline} />
                      )
                    })}
                  </g>
                ))}
              </g>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ── Chip data builders ────────────────────────────────────────────────────────
function buildTeamChips(entry: CareerEntry): string[] {
  return entry.roles.flatMap(r => {
    const tc = r.teamComposition
    if (!tc) return []
    const chips: string[] = []
    if (tc.directReports != null && tc.directReports > 0) chips.push(`${tc.directReports} direct reports`)
    if (tc.breakdown) {
      const { engineers, architects, managers, designers, qa, data, other } = tc.breakdown
      if (engineers)  chips.push(`${engineers} engineers`)
      if (architects) chips.push(`${architects} architects`)
      if (managers)   chips.push(`${managers} managers`)
      if (designers)  chips.push(`${designers} designers`)
      if (qa)         chips.push(`${qa} qa`)
      if (data)       chips.push(`${data} data`)
      if (other)      chips.push(`${other} other`)
    }
    return chips
  })
}

function buildMetaRows(
  entry: CareerEntry,
  allWorkTypes: string[],
  teamChips: string[],
  allTech: string[],
): MetaRowDef[] {
  const rows: MetaRowDef[] = [
    {
      sectionLabel: 'TYPE',
      chips: [
        { label: entry.companyType, color: COMPANY_TYPE_COLORS[entry.companyType], outline: false },
        ...(entry.companyStage !== entry.companyType
          ? [{ label: entry.companyStage, color: COMPANY_STAGE_COLORS[entry.companyStage], outline: false }]
          : []),
      ],
    },
  ]
  if (allWorkTypes.length > 0) {
    rows.push({
      sectionLabel: 'WORK',
      chips: allWorkTypes.map(wt => ({ label: wt, color: WORK_TYPE_COLOR, outline: true })),
    })
  }
  if (teamChips.length > 0) {
    rows.push({
      sectionLabel: 'TEAM',
      chips: teamChips.map(t => ({ label: t, color: '#6b7280', outline: true })),
    })
  }
  if (allTech.length > 0) {
    rows.push({
      sectionLabel: 'STACK',
      chips: allTech.map(t => ({ label: t, color: TECH_COLOR, outline: true })),
    })
  }
  return rows
}
