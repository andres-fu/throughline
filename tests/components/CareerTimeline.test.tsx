import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CareerTimeline } from '../../src/components/CareerTimeline'
import { career } from '../../src/data/career'

describe('CareerTimeline', () => {
  it('renders one company row per non-break entry', () => {
    render(<CareerTimeline entries={career} width={1100} />)
    const rows = screen.getAllByTestId('company-row')
    expect(rows).toHaveLength(5)
  })

  it('renders one break bar for the career break entry', () => {
    render(<CareerTimeline entries={career} width={1100} />)
    const breakBars = screen.getAllByTestId('break-bar')
    expect(breakBars).toHaveLength(1)
  })

  it('renders two role segments for Blackbaud', () => {
    render(<CareerTimeline entries={career} width={1100} />)
    const blackbaudRow = screen.getByTestId('company-row-blackbaud')
    const segments = blackbaudRow.querySelectorAll('[data-testid="role-segment"]')
    expect(segments).toHaveLength(2)
  })

  it('renders company names in uppercase', () => {
    render(<CareerTimeline entries={career} width={1100} />)
    const label = screen.getByTestId('company-label-blackbaud')
    expect(label.textContent).toBe('Blackbaud'.toUpperCase())
  })

  it('renders role titles on the bars', () => {
    render(<CareerTimeline entries={career} width={1100} />)
    expect(screen.getByText('Engineering Manager')).toBeInTheDocument()
    expect(screen.getByText('Sr. Software Engineering Manager')).toBeInTheDocument()
  })

  it('does not show expanded content before clicking', () => {
    render(<CareerTimeline entries={career} width={1100} />)
    expect(screen.queryByTestId('expanded-blackbaud')).not.toBeInTheDocument()
  })

  it('shows expanded content when a company row is clicked', async () => {
    render(<CareerTimeline entries={career} width={1100} />)
    await userEvent.click(screen.getByTestId('company-row-blackbaud'))
    expect(screen.getByTestId('expanded-blackbaud')).toBeInTheDocument()
  })

  it('shows impact metrics in expanded content', async () => {
    render(<CareerTimeline entries={career} width={1100} />)
    await userEvent.click(screen.getByTestId('company-row-blackbaud'))
    expect(screen.getByText('$4M/yr')).toBeInTheDocument()
  })

  it('collapses when clicked a second time', async () => {
    render(<CareerTimeline entries={career} width={1100} />)
    await userEvent.click(screen.getByTestId('company-row-blackbaud'))
    await userEvent.click(screen.getByTestId('company-row-blackbaud'))
    expect(screen.queryByTestId('expanded-blackbaud')).not.toBeInTheDocument()
  })

  it('only one company is expanded at a time', async () => {
    render(<CareerTimeline entries={career} width={1100} />)
    await userEvent.click(screen.getByTestId('company-row-blackbaud'))
    await userEvent.click(screen.getByTestId('company-row-shippo'))
    expect(screen.queryByTestId('expanded-blackbaud')).not.toBeInTheDocument()
    expect(screen.getByTestId('expanded-shippo')).toBeInTheDocument()
  })

  it('does not render a company row for the career break', () => {
    render(<CareerTimeline entries={career} width={1100} />)
    expect(screen.queryByTestId('company-row-career-break-2024')).not.toBeInTheDocument()
  })

  describe('view mode toggle', () => {
    it('renders a view mode toggle', () => {
      render(<CareerTimeline entries={career} width={1100} />)
      expect(screen.getByTestId('toggle-proportional')).toBeInTheDocument()
      expect(screen.getByTestId('toggle-equal')).toBeInTheDocument()
    })

    it('defaults to proportional mode', () => {
      render(<CareerTimeline entries={career} width={1100} />)
      expect(screen.getByTestId('toggle-proportional')).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByTestId('toggle-equal')).toHaveAttribute('aria-pressed', 'false')
    })

    it('switches to equal mode on click', async () => {
      render(<CareerTimeline entries={career} width={1100} />)
      await userEvent.click(screen.getByTestId('toggle-equal'))
      expect(screen.getByTestId('toggle-equal')).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByTestId('toggle-proportional')).toHaveAttribute('aria-pressed', 'false')
    })

    it('still renders all company rows after switching modes', async () => {
      render(<CareerTimeline entries={career} width={1100} />)
      await userEvent.click(screen.getByTestId('toggle-equal'))
      expect(screen.getAllByTestId('company-row')).toHaveLength(5)
    })
  })
})
