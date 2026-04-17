import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CareerTimeline } from '../../src/components/CareerTimeline'
import { career } from '../../src/data/career'

describe('CareerTimeline', () => {
  it('renders one company row per non-break entry', () => {
    render(<CareerTimeline entries={career} width={800} />)
    const rows = screen.getAllByTestId('company-row')
    expect(rows).toHaveLength(5)
  })

  it('renders one break bar for the career break entry', () => {
    render(<CareerTimeline entries={career} width={800} />)
    const breakBars = screen.getAllByTestId('break-bar')
    expect(breakBars).toHaveLength(1)
  })

  it('renders two role segments for Blackbaud', () => {
    render(<CareerTimeline entries={career} width={800} />)
    const blackbaudRow = screen.getByTestId('company-row-blackbaud')
    const segments = blackbaudRow.querySelectorAll('[data-testid="role-segment"]')
    expect(segments).toHaveLength(2)
  })

  it('renders all company name labels', () => {
    render(<CareerTimeline entries={career} width={800} />)
    expect(screen.getByText('Blackbaud')).toBeInTheDocument()
    expect(screen.getByText('Dealerware')).toBeInTheDocument()
    expect(screen.getByText('Shippo')).toBeInTheDocument()
    expect(screen.getByText('HEB Digital')).toBeInTheDocument()
    expect(screen.getByText('AI Grants')).toBeInTheDocument()
  })

  it('does not render a company row for the career break', () => {
    render(<CareerTimeline entries={career} width={800} />)
    const rows = screen.getAllByTestId('company-row')
    const ids = rows.map(r => r.getAttribute('data-testid'))
    expect(ids).not.toContain('company-row-career-break-2024')
  })
})
