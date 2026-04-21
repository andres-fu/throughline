import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EntryDrawer } from '../../src/components/EntryDrawer'
import { career } from '../../src/data/career'

const entry = career.find(e => e.id === 'shippo')!

describe('EntryDrawer', () => {
  it('renders company name from entry', () => {
    render(<EntryDrawer entry={entry} onSave={() => {}} onClose={() => {}} />)
    expect((screen.getByTestId('company-name-input') as HTMLInputElement).value).toBe('Shippo')
  })

  it('renders role title from entry', () => {
    render(<EntryDrawer entry={entry} onSave={() => {}} onClose={() => {}} />)
    expect((screen.getByTestId('role-title-0') as HTMLInputElement).value).toBe('Software Engineering Manager')
  })

  it('renders tech stack languages from entry', () => {
    render(<EntryDrawer entry={entry} onSave={() => {}} onClose={() => {}} />)
    expect((screen.getByTestId('tech-languages-input') as HTMLInputElement).value).toBe('Python, Go')
  })

  it('calls onSave with updated draft when save is clicked', () => {
    const onSave = vi.fn()
    render(<EntryDrawer entry={entry} onSave={onSave} onClose={() => {}} />)
    fireEvent.change(screen.getByTestId('company-name-input'), { target: { value: 'Shippo Inc' } })
    fireEvent.click(screen.getByTestId('drawer-save'))
    expect(onSave).toHaveBeenCalledWith({ ...entry, company: 'Shippo Inc' })
  })

  it('calls onClose when cancel is clicked', () => {
    const onClose = vi.fn()
    render(<EntryDrawer entry={entry} onSave={() => {}} onClose={onClose} />)
    fireEvent.click(screen.getByTestId('drawer-cancel'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when save is clicked', () => {
    const onClose = vi.fn()
    render(<EntryDrawer entry={entry} onSave={() => {}} onClose={onClose} />)
    fireEvent.click(screen.getByTestId('drawer-save'))
    expect(onClose).toHaveBeenCalled()
  })

  it('shows company name in uppercase in the header', () => {
    render(<EntryDrawer entry={entry} onSave={() => {}} onClose={() => {}} />)
    expect(screen.getByTestId('drawer-title')).toHaveTextContent('SHIPPO')
  })

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn()
    render(<EntryDrawer entry={entry} onSave={() => {}} onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('does not show unsaved indicator when draft matches entry', () => {
    render(<EntryDrawer entry={entry} onSave={() => {}} onClose={() => {}} />)
    expect(screen.queryByTestId('unsaved-indicator')).not.toBeInTheDocument()
  })

  it('shows unsaved indicator when draft differs from entry', () => {
    render(<EntryDrawer entry={entry} onSave={() => {}} onClose={() => {}} />)
    fireEvent.change(screen.getByTestId('company-name-input'), { target: { value: 'Changed' } })
    expect(screen.getByTestId('unsaved-indicator')).toBeInTheDocument()
  })
})
