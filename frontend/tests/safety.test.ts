import { describe, expect, it } from 'vitest'
import { quickSafetyCheck } from '../lib/safety'

describe('quickSafetyCheck', () => {
  it('detects obvious emergency phrases', () => {
    expect(quickSafetyCheck('Mummy has chest pain')).toBe(true)
    expect(quickSafetyCheck('Dadi behosh ho gayi')).toBe(true)
  })

  it('allows normal wellness questions', () => {
    expect(quickSafetyCheck('What should Papa eat for better sleep?')).toBe(false)
  })
})

