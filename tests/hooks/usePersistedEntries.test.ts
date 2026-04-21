import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePersistedEntries } from '../../src/hooks/usePersistedEntries'
import { career } from '../../src/data/career'

const STORAGE_KEY = 'throughline-entries'

const store: Record<string, string> = {}
const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value },
  removeItem: (key: string) => { delete store[key] },
}
vi.stubGlobal('localStorage', localStorageMock)

beforeEach(() => localStorageMock.removeItem(STORAGE_KEY))

describe('usePersistedEntries', () => {
  it('initializes with career data when localStorage is empty', () => {
    const { result } = renderHook(() => usePersistedEntries())
    expect(result.current.entries).toEqual(career)
  })

  it('initializes from localStorage when data exists', () => {
    const saved = [career[0]]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    const { result } = renderHook(() => usePersistedEntries())
    expect(result.current.entries).toEqual(saved)
  })

  it('persists entries to localStorage when entries change', () => {
    const { result } = renderHook(() => usePersistedEntries())
    act(() => result.current.setEntries([career[0]]))
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([career[0]])
  })

  it('reset restores career defaults and persists them', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([career[0]]))
    const { result } = renderHook(() => usePersistedEntries())
    act(() => result.current.reset())
    expect(result.current.entries).toEqual(career)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(career)
  })

  it('falls back to career data when localStorage contains corrupt JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not valid json')
    const { result } = renderHook(() => usePersistedEntries())
    expect(result.current.entries).toEqual(career)
  })
})
