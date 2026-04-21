import { useState } from 'react'
import type { CareerEntry, Role, TeamBreakdown } from '../data/career'

interface Props {
  draft: CareerEntry
  onChange: (patch: Partial<CareerEntry>) => void
}

const labelStyle = { fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#6b7280', display: 'block', marginBottom: 4 }
const inputStyle = { width: '100%', fontSize: 12, padding: '5px 8px', border: '1px solid #e5e7eb', borderRadius: 4, boxSizing: 'border-box' as const, fontFamily: 'inherit' }
const numInputStyle = { ...inputStyle, width: '100%' }

const BREAKDOWN_FIELDS: Array<{ key: keyof TeamBreakdown; label: string }> = [
  { key: 'engineers',  label: 'ENG' },
  { key: 'managers',   label: 'MGR' },
  { key: 'architects', label: 'ARCH' },
  { key: 'designers',  label: 'DES' },
  { key: 'qa',         label: 'QA' },
  { key: 'data',       label: 'DATA' },
  { key: 'other',      label: 'OTHER' },
]

function emptyRole(): Role {
  return { title: '', startDate: '', endDate: '', description: '' }
}

function updateRole(roles: Role[], index: number, patch: Partial<Role>): Role[] {
  return roles.map((r, i) => i === index ? { ...r, ...patch } : r)
}

export function RolesSection({ draft, onChange }: Props) {
  const { roles } = draft
  const [expandedTeam, setExpandedTeam] = useState<Set<number>>(new Set())

  function toggleTeam(i: number) {
    setExpandedTeam(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  function patchTeam(i: number, patch: Partial<Role['teamComposition']>) {
    const existing = roles[i].teamComposition ?? {}
    onChange({ roles: updateRole(roles, i, { teamComposition: { ...existing, ...patch } }) })
  }

  function patchBreakdown(i: number, key: keyof TeamBreakdown, value: number | undefined) {
    const existing = roles[i].teamComposition ?? {}
    const breakdown = { ...(existing.breakdown ?? {}), [key]: value }
    onChange({ roles: updateRole(roles, i, { teamComposition: { ...existing, breakdown } }) })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {roles.map((role, i) => (
        <div key={i} data-testid={`role-card-${i}`} style={{ border: '1px solid #e5e7eb', borderRadius: 4, padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ ...labelStyle, marginBottom: 0 }}>ROLE {i + 1}</span>
            <button
              data-testid={`remove-role-${i}`}
              onClick={() => onChange({ roles: roles.filter((_, j) => j !== i) })}
              style={{ fontSize: 10, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              REMOVE
            </button>
          </div>
          <div>
            <label style={labelStyle}>TITLE</label>
            <input
              data-testid={`role-title-${i}`}
              style={inputStyle}
              value={role.title}
              onChange={e => onChange({ roles: updateRole(roles, i, { title: e.target.value }) })}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>START</label>
              <input
                data-testid={`role-start-${i}`}
                style={inputStyle}
                value={role.startDate}
                placeholder="YYYY-MM"
                onChange={e => onChange({ roles: updateRole(roles, i, { startDate: e.target.value }) })}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>END</label>
              <input
                data-testid={`role-end-${i}`}
                style={inputStyle}
                value={role.endDate === 'present' ? 'present' : role.endDate}
                placeholder="YYYY-MM or present"
                onChange={e => onChange({ roles: updateRole(roles, i, { endDate: e.target.value }) })}
              />
            </div>
          </div>

          <button
            data-testid={`team-toggle-${i}`}
            onClick={() => toggleTeam(i)}
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', padding: '4px 0', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontFamily: 'inherit', textAlign: 'left' }}
          >
            {expandedTeam.has(i) ? '▾ TEAM DETAILS' : '▸ TEAM DETAILS'}
          </button>

          {expandedTeam.has(i) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4, borderTop: '1px solid #f3f4f6' }}>
              <div>
                <label style={labelStyle}>DIRECT REPORTS</label>
                <input
                  data-testid={`team-direct-reports-${i}`}
                  type="number"
                  min={0}
                  style={numInputStyle}
                  value={role.teamComposition?.directReports ?? ''}
                  onChange={e => patchTeam(i, { directReports: e.target.value === '' ? undefined : Number(e.target.value) })}
                />
              </div>
              <div>
                <label style={labelStyle}>BREAKDOWN</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                  {BREAKDOWN_FIELDS.map(({ key, label }) => (
                    <div key={key}>
                      <label style={{ ...labelStyle, marginBottom: 2 }}>{label}</label>
                      <input
                        data-testid={`team-breakdown-${key}-${i}`}
                        type="number"
                        min={0}
                        style={numInputStyle}
                        value={role.teamComposition?.breakdown?.[key] ?? ''}
                        onChange={e => patchBreakdown(i, key, e.target.value === '' ? undefined : Number(e.target.value))}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>NOTES</label>
                <input
                  data-testid={`team-notes-${i}`}
                  style={inputStyle}
                  value={role.teamComposition?.notes ?? ''}
                  onChange={e => patchTeam(i, { notes: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>
      ))}
      <button
        data-testid="add-role"
        onClick={() => onChange({ roles: [...roles, emptyRole()] })}
        style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', padding: '6px 12px', border: '1px dashed #d1d5db', borderRadius: 4, background: 'none', cursor: 'pointer', color: '#6b7280', fontFamily: 'inherit' }}
      >
        + ADD ROLE
      </button>
    </div>
  )
}
