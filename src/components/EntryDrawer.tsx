import { useState } from 'react'
import type { CareerEntry } from '../data/career'
import { CompanyInfoSection } from './CompanyInfoSection'
import { RolesSection } from './RolesSection'
import { TechStackSection } from './TechStackSection'

interface Props {
  entry: CareerEntry
  onSave: (updated: CareerEntry) => void
  onClose: () => void
}

const sectionLabel: React.CSSProperties = {
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: '0.1em',
  color: '#9ca3af',
  marginBottom: 10,
  marginTop: 4,
}

export function EntryDrawer({ entry, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<CareerEntry>(entry)

  function handleChange(patch: Partial<CareerEntry>) {
    setDraft(prev => ({ ...prev, ...patch }))
  }

  function handleSave() {
    onSave(draft)
    onClose()
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: 420,
      background: 'white',
      boxShadow: '-4px 0 24px rgba(0,0,0,0.10)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    }}>
      <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#111827' }}>EDIT ENTRY</span>
        <button
          data-testid="drawer-cancel"
          onClick={onClose}
          style={{ fontSize: 10, background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontFamily: 'inherit', letterSpacing: '0.08em', fontWeight: 700 }}
        >
          CANCEL
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <div style={sectionLabel}>COMPANY INFO</div>
          <CompanyInfoSection draft={draft} onChange={handleChange} />
        </div>
        <div>
          <div style={sectionLabel}>ROLES</div>
          <RolesSection draft={draft} onChange={handleChange} />
        </div>
        <div>
          <div style={sectionLabel}>TECH STACK</div>
          <TechStackSection draft={draft} onChange={handleChange} />
        </div>
      </div>

      <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb' }}>
        <button
          data-testid="drawer-save"
          onClick={handleSave}
          style={{ width: '100%', padding: '8px 0', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', background: '#111827', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          SAVE
        </button>
      </div>
    </div>
  )
}
