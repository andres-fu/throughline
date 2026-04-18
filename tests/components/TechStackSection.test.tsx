import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TechStackSection } from '../../src/components/TechStackSection'
import { career } from '../../src/data/career'

const blackbaud = career.find(e => e.id === 'blackbaud')!

describe('TechStackSection', () => {
  it('renders languages as comma-separated string', () => {
    render(<TechStackSection draft={blackbaud} onChange={() => {}} />)
    expect((screen.getByTestId('tech-languages-input') as HTMLInputElement).value).toBe('Java')
  })

  it('renders frameworks as comma-separated string', () => {
    render(<TechStackSection draft={blackbaud} onChange={() => {}} />)
    expect((screen.getByTestId('tech-frameworks-input') as HTMLInputElement).value).toBe('Spring Boot')
  })

  it('renders tools as comma-separated string', () => {
    render(<TechStackSection draft={blackbaud} onChange={() => {}} />)
    expect((screen.getByTestId('tech-tools-input') as HTMLInputElement).value).toBe('Kafka')
  })

  it('renders cloud as comma-separated string', () => {
    render(<TechStackSection draft={blackbaud} onChange={() => {}} />)
    expect((screen.getByTestId('tech-cloud-input') as HTMLInputElement).value).toBe('AWS, Azure')
  })

  it('calls onChange with split array when languages input changes', () => {
    const onChange = vi.fn()
    render(<TechStackSection draft={blackbaud} onChange={onChange} />)
    fireEvent.change(screen.getByTestId('tech-languages-input'), { target: { value: 'Java, Python' } })
    expect(onChange).toHaveBeenCalledWith({
      techStack: { ...blackbaud.techStack, languages: ['Java', 'Python'] },
    })
  })

  it('calls onChange with split array when cloud input changes', () => {
    const onChange = vi.fn()
    render(<TechStackSection draft={blackbaud} onChange={onChange} />)
    fireEvent.change(screen.getByTestId('tech-cloud-input'), { target: { value: 'AWS, Azure, GCP' } })
    expect(onChange).toHaveBeenCalledWith({
      techStack: { ...blackbaud.techStack, cloud: ['AWS', 'Azure', 'GCP'] },
    })
  })
})
