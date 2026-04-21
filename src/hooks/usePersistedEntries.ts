import { useState, useEffect } from 'react'
import { career } from '../data/career'
import type { CareerEntry } from '../data/career'

const STORAGE_KEY = 'throughline-entries'

function loadEntries(): CareerEntry[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : career
  } catch {
    return career
  }
}

export function usePersistedEntries() {
  const [entries, setEntries] = useState<CareerEntry[]>(loadEntries)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  function reset() {
    setEntries(career)
  }

  return { entries, setEntries, reset }
}
