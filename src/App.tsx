import { useState, useRef } from 'react'
import type { CareerEntry } from './data/career'
import { usePersistedEntries } from './hooks/usePersistedEntries'
import { createBlankEntry } from './utils/createBlankEntry'
import { exportSvgToPng, EXPORT_PRESETS } from './utils/exportSvgToPng'
import { CareerTimeline } from './components/CareerTimeline'
import { EntryDrawer } from './components/EntryDrawer'

const SIDEBAR_COLLAPSED = 220
const SIDEBAR_EXPANDED = 400

export default function App() {
  const { entries, setEntries, reset } = usePersistedEntries()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [exportPresetIdx, setExportPresetIdx] = useState(0)
  const timelineSvgRef = useRef<SVGSVGElement>(null)

  const selectedEntry = selectedId ? entries.find(e => e.id === selectedId) ?? null : null
  const sidebarWidth = selectedEntry ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED
  const timelineWidth = Math.max(window.innerWidth - SIDEBAR_EXPANDED - 64, 800)

  function handleSave(updated: CareerEntry) {
    setEntries(prev => prev.map(e => e.id === updated.id ? updated : e))
  }

  function handleAdd() {
    const blank = createBlankEntry()
    setEntries(prev => [...prev, blank])
    setSelectedId(blank.id)
  }

  function handleDelete(id: string) {
    setEntries(prev => prev.filter(e => e.id !== id))
    setSelectedId(null)
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
            onDelete={handleDelete}
          />
        ) : (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: '#111827' }}>THROUGHLINE</span>
              <span style={{ fontSize: 11, color: '#9ca3af', letterSpacing: '0.04em' }}>Select an entry to edit</span>
            </div>
            <button
              onClick={handleAdd}
              style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', padding: '6px 10px', border: '1px solid #111827', borderRadius: 4, background: '#111827', cursor: 'pointer', color: 'white', fontFamily: 'inherit', textAlign: 'left' }}
            >
              + NEW ENTRY
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <select
                value={exportPresetIdx}
                onChange={e => setExportPresetIdx(Number(e.target.value))}
                style={{ fontSize: 10, padding: '5px 8px', border: '1px solid #e5e7eb', borderRadius: 4, fontFamily: 'inherit', color: '#374151', background: 'white' }}
              >
                {EXPORT_PRESETS.map((p, i) => (
                  <option key={i} value={i}>{p.label}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  if (timelineSvgRef.current) {
                    exportSvgToPng(timelineSvgRef.current, EXPORT_PRESETS[exportPresetIdx])
                  }
                }}
                style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', padding: '6px 10px', border: '1px solid #6366f1', borderRadius: 4, background: 'none', cursor: 'pointer', color: '#6366f1', fontFamily: 'inherit', textAlign: 'left' }}
              >
                EXPORT PNG
              </button>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Reset all entries to defaults? This cannot be undone.')) {
                  reset()
                  setSelectedId(null)
                }
              }}
              style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: 4, background: 'none', cursor: 'pointer', color: '#9ca3af', fontFamily: 'inherit', textAlign: 'left' }}
            >
              RESET TO DEFAULTS
            </button>
          </div>
        )}
      </div>

      <main style={{ flex: 1, padding: 32, overflowX: 'auto' }}>
        <CareerTimeline
          entries={entries}
          width={timelineWidth}
          onEntryClick={id => setSelectedId(prev => prev === id ? null : id)}
          svgRef={timelineSvgRef}
        />
      </main>
    </div>
  )
}
