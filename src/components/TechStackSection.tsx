import type { CareerEntry } from '../data/career'

interface Props {
  draft: CareerEntry
  onChange: (patch: Partial<CareerEntry>) => void
}

const labelStyle = { fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#6b7280', display: 'block', marginBottom: 4 }
const inputStyle = { width: '100%', fontSize: 12, padding: '5px 8px', border: '1px solid #e5e7eb', borderRadius: 4, boxSizing: 'border-box' as const, fontFamily: 'inherit' }

function split(value: string): string[] {
  return value.split(',').map(s => s.trim()).filter(Boolean)
}

export function TechStackSection({ draft, onChange }: Props) {
  const { techStack } = draft

  function update(key: keyof typeof techStack, value: string) {
    onChange({ techStack: { ...techStack, [key]: split(value) } })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {(['languages', 'frameworks', 'tools', 'cloud'] as const).map(key => (
        <div key={key}>
          <label style={labelStyle}>{key.toUpperCase()}</label>
          <input
            data-testid={`tech-${key}-input`}
            style={inputStyle}
            value={techStack[key].join(', ')}
            placeholder="comma-separated"
            onChange={e => update(key, e.target.value)}
          />
        </div>
      ))}
    </div>
  )
}
