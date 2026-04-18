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

  it('renders break reason in lowercase', () => {
    render(<CareerTimeline entries={career} width={1100} />)
    expect(screen.getByTestId('break-reason')).toHaveTextContent('caregiving for a parent in palliative care')
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

  it('does not render a company row for the career break', () => {
    render(<CareerTimeline entries={career} width={1100} />)
    expect(screen.queryByTestId('company-row-career-break-2024')).not.toBeInTheDocument()
  })

  it('does not render a click-to-expand panel', async () => {
    render(<CareerTimeline entries={career} width={1100} />)
    await userEvent.click(screen.getByTestId('company-row-blackbaud'))
    expect(screen.queryByTestId('expanded-blackbaud')).not.toBeInTheDocument()
  })

  describe('team composition chips', () => {
    it('renders direct reports chip when present', () => {
      render(<CareerTimeline entries={career} width={1100} />)
      const lane = screen.getByTestId('metadata-lane-dealerware')
      expect(lane).toHaveTextContent('4 direct reports')
    })

    it('renders breakdown chips when present', () => {
      render(<CareerTimeline entries={career} width={1100} />)
      const lane = screen.getByTestId('metadata-lane-blackbaud')
      expect(lane).toHaveTextContent('engineers')
    })

    it('does not render team chips when no composition data', () => {
      render(<CareerTimeline entries={career} width={1100} />)
      const lane = screen.getByTestId('metadata-lane-ai-grants')
      expect(lane).not.toHaveTextContent('direct reports')
    })
  })

  describe('metadata lanes', () => {
    it('renders a metadata lane for each non-break entry', () => {
      render(<CareerTimeline entries={career} width={1100} />)
      expect(screen.getByTestId('metadata-lane-blackbaud')).toBeInTheDocument()
      expect(screen.getByTestId('metadata-lane-dealerware')).toBeInTheDocument()
      expect(screen.getByTestId('metadata-lane-shippo')).toBeInTheDocument()
      expect(screen.getByTestId('metadata-lane-heb-digital')).toBeInTheDocument()
      expect(screen.getByTestId('metadata-lane-ai-grants')).toBeInTheDocument()
    })

    it('shows company type in the metadata lane', () => {
      render(<CareerTimeline entries={career} width={1100} />)
      const lane = screen.getByTestId('metadata-lane-blackbaud')
      expect(lane).toHaveTextContent('enterprise')
    })

    it('shows company stage in the metadata lane', () => {
      render(<CareerTimeline entries={career} width={1100} />)
      const lane = screen.getByTestId('metadata-lane-dealerware')
      expect(lane).toHaveTextContent('growth')
    })

    it('shows all unique work types across roles', () => {
      render(<CareerTimeline entries={career} width={1100} />)
      const lane = screen.getByTestId('metadata-lane-blackbaud')
      expect(lane).toHaveTextContent('modernization')
      expect(lane).toHaveTextContent('platform')
      expect(lane).toHaveTextContent('devops')
    })

    it('shows all tech stack items', () => {
      render(<CareerTimeline entries={career} width={1100} />)
      const lane = screen.getByTestId('metadata-lane-blackbaud')
      expect(lane).toHaveTextContent('Java')
      expect(lane).toHaveTextContent('Spring Boot')
      expect(lane).toHaveTextContent('Kafka')
      expect(lane).toHaveTextContent('AWS')
      expect(lane).toHaveTextContent('Azure')
    })

    it('does not render a metadata lane for the career break', () => {
      render(<CareerTimeline entries={career} width={1100} />)
      expect(screen.queryByTestId('metadata-lane-career-break-2024')).not.toBeInTheDocument()
    })
  })

  describe('NOW marker', () => {
    it('renders a NOW marker in proportional mode', () => {
      render(<CareerTimeline entries={career} width={1100} />)
      expect(screen.getByTestId('now-marker')).toBeInTheDocument()
    })

    it('does not render a NOW marker in equal-width mode', async () => {
      render(<CareerTimeline entries={career} width={1100} />)
      await userEvent.click(screen.getByTestId('toggle-equal'))
      expect(screen.queryByTestId('now-marker')).not.toBeInTheDocument()
    })
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
