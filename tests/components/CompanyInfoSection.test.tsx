import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CompanyInfoSection } from '../../src/components/CompanyInfoSection'
import { career } from '../../src/data/career'

const entry = career.find(e => e.id === 'blackbaud')!

describe('CompanyInfoSection', () => {
  it('renders company name input with draft value', () => {
    render(<CompanyInfoSection draft={entry} onChange={() => {}} />)
    expect((screen.getByTestId('company-name-input') as HTMLInputElement).value).toBe('Blackbaud')
  })

  it('renders location input with draft value', () => {
    render(<CompanyInfoSection draft={entry} onChange={() => {}} />)
    expect((screen.getByTestId('location-input') as HTMLInputElement).value).toBe('Austin, TX')
  })

  it('renders company type select with draft value', () => {
    render(<CompanyInfoSection draft={entry} onChange={() => {}} />)
    expect((screen.getByTestId('company-type-select') as HTMLSelectElement).value).toBe('enterprise')
  })

  it('renders company stage select with draft value', () => {
    render(<CompanyInfoSection draft={entry} onChange={() => {}} />)
    expect((screen.getByTestId('company-stage-select') as HTMLSelectElement).value).toBe('enterprise')
  })

  it('calls onChange with updated company name', () => {
    const onChange = vi.fn()
    render(<CompanyInfoSection draft={entry} onChange={onChange} />)
    fireEvent.change(screen.getByTestId('company-name-input'), { target: { value: 'New Corp' } })
    expect(onChange).toHaveBeenCalledWith({ company: 'New Corp' })
  })

  it('calls onChange with updated company type', () => {
    const onChange = vi.fn()
    render(<CompanyInfoSection draft={entry} onChange={onChange} />)
    fireEvent.change(screen.getByTestId('company-type-select'), { target: { value: 'startup' } })
    expect(onChange).toHaveBeenCalledWith({ companyType: 'startup' })
  })

  it('calls onChange with updated company stage', () => {
    const onChange = vi.fn()
    render(<CompanyInfoSection draft={entry} onChange={onChange} />)
    fireEvent.change(screen.getByTestId('company-stage-select'), { target: { value: 'growth' } })
    expect(onChange).toHaveBeenCalledWith({ companyStage: 'growth' })
  })

  it('calls onChange with updated location', () => {
    const onChange = vi.fn()
    render(<CompanyInfoSection draft={entry} onChange={onChange} />)
    fireEvent.change(screen.getByTestId('location-input'), { target: { value: 'Remote' } })
    expect(onChange).toHaveBeenCalledWith({ location: 'Remote' })
  })
})
