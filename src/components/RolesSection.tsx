import type { CareerEntry, Role } from '../data/career'

interface Props {
  draft: CareerEntry
  onChange: (patch: Partial<CareerEntry>) => void
}

const labelStyle = { fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#6b7280', display: 'block', marginBottom: 4 }
const inputStyle = { width: '100%', fontSize: 12, padding: '5px 8px', border: '1px solid #e5e7eb', borderRadius: 4, boxSizing: 'border-box' as const, fontFamily: 'inherit' }

function emptyRole(): Role {
  return { title: '', startDate: '', endDate: '', description: '' }
}

function updateRole(roles: Role[], index: number, patch: Partial<Role>): Role[] {
  return roles.map((r, i) => i === index ? { ...r, ...patch } : r)
}

export function RolesSection({ draft, onChange }: Props) {
  const { roles } = draft

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
