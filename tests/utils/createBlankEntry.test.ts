import { describe, it, expect } from 'vitest'
import { createBlankEntry } from '../../src/utils/createBlankEntry'

describe('createBlankEntry', () => {
  it('generates a non-empty id', () => {
    expect(createBlankEntry().id).toBeTruthy()
  })

  it('generates unique ids on each call', () => {
    expect(createBlankEntry().id).not.toBe(createBlankEntry().id)
  })

  it('defaults companyType to startup', () => {
    expect(createBlankEntry().companyType).toBe('startup')
  })

  it('defaults companyStage to early-startup', () => {
    expect(createBlankEntry().companyStage).toBe('early-startup')
  })

  it('starts with one empty role', () => {
    const entry = createBlankEntry()
    expect(entry.roles).toHaveLength(1)
    expect(entry.roles[0].title).toBe('')
  })

  it('has empty tech stack arrays', () => {
    const { techStack } = createBlankEntry()
    expect(techStack.languages).toEqual([])
    expect(techStack.frameworks).toEqual([])
    expect(techStack.tools).toEqual([])
    expect(techStack.cloud).toEqual([])
  })
})
