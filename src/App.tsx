import { useState } from 'react'
import { career } from './data/career'
import type { CareerEntry } from './data/career'
import { CareerTimeline } from './components/CareerTimeline'
import { EntryDrawer } from './components/EntryDrawer'

export default function App() {
  const [entries, setEntries] = useState<CareerEntry[]>(career)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedEntry = selectedId ? entries.find(e => e.id === selectedId) ?? null : null

  function handleSave(updated: CareerEntry) {
    setEntries(prev => prev.map(e => e.id === updated.id ? updated : e))
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
      <h1 className="text-2xl font-bold tracking-tight mb-8">throughline</h1>
      <CareerTimeline
        entries={entries}
        width={1100}
        onEntryClick={setSelectedId}
      />
      {selectedEntry && (
        <EntryDrawer
          entry={selectedEntry}
          onSave={handleSave}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  )
}
