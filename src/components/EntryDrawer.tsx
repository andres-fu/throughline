import { useState, useEffect } from 'react'
import type { CareerEntry } from '../data/career'
import { CompanyInfoSection } from './CompanyInfoSection'
import { RolesSection } from './RolesSection'
import { TechStackSection } from './TechStackSection'

interface Props {
  entry: CareerEntry
  onSave: (updated: CareerEntry) => void
  onClose: () => void
  onDelete?: (id: string) => void
}

const sectionLabel: React.CSSProperties = {
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: '0.1em',
  color: '#9ca3af',
  marginBottom: 10,
  marginTop: 4,
}

export function EntryDrawer({ entry, onSave, onClose, onDelete }: Props) {
  const [draft, setDraft] = useState<CareerEntry>(entry)

  const hasUnsavedChanges = JSON.stringify(draft) !== JSON.stringify(entry)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  function handleChange(patch: Partial<CareerEntry>) {
    setDraft(prev => ({ ...prev, ...patch }))
  }

  function handleSave() {
    onSave(draft)
    onClose()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            data-testid="drawer-title"
            style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#111827' }}
          >
            {entry.company.toUpperCase()}
          </span>
          {hasUnsavedChanges && (
            <span
              data-testid="unsaved-indicator"
              style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}
            />
          )}
        </div>
        <button
          data-testid="drawer-cancel"
          onClick={onClose}
          style={{ fontSize: 10, background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontFamily: 'inherit', letterSpacing: '0.08em', fontWeight: 700 }}
        >
          CANCEL
        </button>
      </div>

      <div key={entry.id} style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 24, animation: 'drawerEnter 0.35s ease-out' }}>
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

      <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          data-testid="drawer-save"
          onClick={handleSave}
          style={{ width: '100%', padding: '8px 0', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', background: '#111827', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          SAVE
        </button>
        {onDelete && (
          <button
            data-testid="drawer-delete"
            onClick={() => {
              if (window.confirm('Delete this entry? This cannot be undone.')) {
                onDelete(entry.id)
                onClose()
              }
            }}
            style={{ width: '100%', padding: '6px 0', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', background: 'none', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            DELETE ENTRY
          </button>
        )}
      </div>
    </div>
  )
}
