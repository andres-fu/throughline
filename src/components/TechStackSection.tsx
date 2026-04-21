import { useState, useEffect } from 'react'
import type { CareerEntry } from '../data/career'

interface Props {
  draft: CareerEntry
  onChange: (patch: Partial<CareerEntry>) => void
}

const labelStyle = { fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#6b7280', display: 'block', marginBottom: 4 }
const inputStyle = { width: '100%', fontSize: 12, padding: '5px 8px', border: '1px solid #e5e7eb', borderRadius: 4, boxSizing: 'border-box' as const, fontFamily: 'inherit' }

const KEYS = ['languages', 'frameworks', 'tools', 'cloud'] as const
type StackKey = typeof KEYS[number]

function toLocal(draft: CareerEntry): Record<StackKey, string> {
  return {
    languages: draft.techStack.languages.join(', '),
    frameworks: draft.techStack.frameworks.join(', '),
    tools: draft.techStack.tools.join(', '),
    cloud: draft.techStack.cloud.join(', '),
  }
}

function split(value: string): string[] {
  return value.split(',').map(s => s.trim()).filter(Boolean)
}

export function TechStackSection({ draft, onChange }: Props) {
  const [local, setLocal] = useState(() => toLocal(draft))

  useEffect(() => { setLocal(toLocal(draft)) }, [draft.id])

  function handleBlur(key: StackKey) {
    onChange({ techStack: { ...draft.techStack, [key]: split(local[key]) } })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {KEYS.map(key => (
        <div key={key}>
          <label style={labelStyle}>{key.toUpperCase()}</label>
          <input
            data-testid={`tech-${key}-input`}
            style={inputStyle}
            value={local[key]}
            placeholder="comma-separated"
            onChange={e => setLocal(prev => ({ ...prev, [key]: e.target.value }))}
            onBlur={() => handleBlur(key)}
          />
        </div>
      ))}
    </div>
  )
}
