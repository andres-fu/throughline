import { useState } from 'react'
import { career } from './data/career'
import type { CareerEntry } from './data/career'
import { CareerTimeline } from './components/CareerTimeline'
import { EntryDrawer } from './components/EntryDrawer'

const SIDEBAR_COLLAPSED = 220
const SIDEBAR_EXPANDED = 400

export default function App() {
  const [entries, setEntries] = useState<CareerEntry[]>(career)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedEntry = selectedId ? entries.find(e => e.id === selectedId) ?? null : null
  const sidebarWidth = selectedEntry ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED
  const timelineWidth = Math.max(window.innerWidth - SIDEBAR_EXPANDED - 64, 800)

  function handleSave(updated: CareerEntry) {
    setEntries(prev => prev.map(e => e.id === updated.id ? updated : e))
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <div style={{
        width: sidebarWidth,
        flexShrink: 0,
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflow: 'hidden',
        transition: 'width 0.25s ease',
      }}>
        {selectedEntry ? (
          <EntryDrawer
            key={selectedId}
            entry={selectedEntry}
            onSave={handleSave}
            onClose={() => setSelectedId(null)}
          />
        ) : (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: '#111827' }}>THROUGHLINE</span>
            <span style={{ fontSize: 11, color: '#9ca3af', letterSpacing: '0.04em' }}>Select an entry to edit</span>
          </div>
        )}
      </div>

      <main style={{ flex: 1, padding: 32, overflowX: 'auto' }}>
        <CareerTimeline
          entries={entries}
          width={timelineWidth}
          onEntryClick={id => setSelectedId(prev => prev === id ? null : id)}
        />
      </main>
    </div>
  )
}
