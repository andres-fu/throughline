import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RolesSection } from '../../src/components/RolesSection'
import { career } from '../../src/data/career'

const blackbaud = career.find(e => e.id === 'blackbaud')!
const shippo = career.find(e => e.id === 'shippo')!

describe('RolesSection', () => {
  it('renders a card for each role', () => {
    render(<RolesSection draft={blackbaud} onChange={() => {}} />)
    expect(screen.getByTestId('role-card-0')).toBeInTheDocument()
    expect(screen.getByTestId('role-card-1')).toBeInTheDocument()
  })

  it('renders role title input with value', () => {
    render(<RolesSection draft={shippo} onChange={() => {}} />)
    expect((screen.getByTestId('role-title-0') as HTMLInputElement).value).toBe('Software Engineering Manager')
  })

  it('renders role start date input with value', () => {
    render(<RolesSection draft={shippo} onChange={() => {}} />)
    expect((screen.getByTestId('role-start-0') as HTMLInputElement).value).toBe('2022-05')
  })

  it('renders role end date input with value', () => {
    render(<RolesSection draft={shippo} onChange={() => {}} />)
    expect((screen.getByTestId('role-end-0') as HTMLInputElement).value).toBe('2023-04')
  })

  it('calls onChange with updated roles when title changes', () => {
    const onChange = vi.fn()
    render(<RolesSection draft={shippo} onChange={onChange} />)
    fireEvent.change(screen.getByTestId('role-title-0'), { target: { value: 'Director' } })
    expect(onChange).toHaveBeenCalledWith({
      roles: [{ ...shippo.roles[0], title: 'Director' }],
    })
  })

  it('calls onChange with a new empty role when add role is clicked', () => {
    const onChange = vi.fn()
    render(<RolesSection draft={shippo} onChange={onChange} />)
    fireEvent.click(screen.getByTestId('add-role'))
    const updatedRoles = onChange.mock.calls[0][0].roles
    expect(updatedRoles).toHaveLength(2)
    expect(updatedRoles[1].title).toBe('')
  })

  it('calls onChange with role removed when remove is clicked', () => {
    const onChange = vi.fn()
    render(<RolesSection draft={blackbaud} onChange={onChange} />)
    fireEvent.click(screen.getByTestId('remove-role-0'))
    const updatedRoles = onChange.mock.calls[0][0].roles
    expect(updatedRoles).toHaveLength(1)
    expect(updatedRoles[0].title).toBe('Sr. Software Engineering Manager')
  })

  describe('team details', () => {
    it('renders a team toggle button for each role', () => {
      render(<RolesSection draft={shippo} onChange={() => {}} />)
      expect(screen.getByTestId('team-toggle-0')).toBeInTheDocument()
    })

    it('team fields are hidden by default', () => {
      render(<RolesSection draft={shippo} onChange={() => {}} />)
      expect(screen.queryByTestId('team-direct-reports-0')).not.toBeInTheDocument()
    })

    it('clicking toggle reveals team fields', () => {
      render(<RolesSection draft={shippo} onChange={() => {}} />)
      fireEvent.click(screen.getByTestId('team-toggle-0'))
      expect(screen.getByTestId('team-direct-reports-0')).toBeInTheDocument()
      expect(screen.getByTestId('team-notes-0')).toBeInTheDocument()
      expect(screen.getByTestId('team-breakdown-engineers-0')).toBeInTheDocument()
    })

    it('clicking toggle again hides team fields', () => {
      render(<RolesSection draft={shippo} onChange={() => {}} />)
      fireEvent.click(screen.getByTestId('team-toggle-0'))
      fireEvent.click(screen.getByTestId('team-toggle-0'))
      expect(screen.queryByTestId('team-direct-reports-0')).not.toBeInTheDocument()
    })

    it('shows existing teamComposition values when expanded', () => {
      render(<RolesSection draft={shippo} onChange={() => {}} />)
      fireEvent.click(screen.getByTestId('team-toggle-0'))
      expect((screen.getByTestId('team-breakdown-engineers-0') as HTMLInputElement).value).toBe('6')
      expect((screen.getByTestId('team-breakdown-managers-0') as HTMLInputElement).value).toBe('2')
    })

    it('calls onChange with updated directReports when changed', () => {
      const onChange = vi.fn()
      render(<RolesSection draft={shippo} onChange={onChange} />)
      fireEvent.click(screen.getByTestId('team-toggle-0'))
      fireEvent.change(screen.getByTestId('team-direct-reports-0'), { target: { value: '5' } })
      const updatedRole = onChange.mock.calls[0][0].roles[0]
      expect(updatedRole.teamComposition?.directReports).toBe(5)
    })

    it('calls onChange with updated breakdown field when changed', () => {
      const onChange = vi.fn()
      render(<RolesSection draft={shippo} onChange={onChange} />)
      fireEvent.click(screen.getByTestId('team-toggle-0'))
      fireEvent.change(screen.getByTestId('team-breakdown-engineers-0'), { target: { value: '8' } })
      const updatedRole = onChange.mock.calls[0][0].roles[0]
      expect(updatedRole.teamComposition?.breakdown?.engineers).toBe(8)
    })

    it('calls onChange with updated notes when changed', () => {
      const onChange = vi.fn()
      render(<RolesSection draft={shippo} onChange={onChange} />)
      fireEvent.click(screen.getByTestId('team-toggle-0'))
      fireEvent.change(screen.getByTestId('team-notes-0'), { target: { value: 'Cross-functional team' } })
      const updatedRole = onChange.mock.calls[0][0].roles[0]
      expect(updatedRole.teamComposition?.notes).toBe('Cross-functional team')
    })
  })
})
