import { describe, it, expect } from 'vitest'
import { validatePasswordStrength, getPasswordStrengthLabel } from '@/lib/password-validation'

describe('validatePasswordStrength', () => {
  it('rejects short passwords', () => {
    const result = validatePasswordStrength('Ab1!')
    expect(result.isValid).toBe(false)
    expect(result.score).toBe(0)
    expect(result.feedback).toContain('Password must be at least 8 characters long')
  })

  it('scores increase with complexity', () => {
    const weak = validatePasswordStrength('abcdefgh')
    const medium = validatePasswordStrength('Abcdefgh')
    const strong = validatePasswordStrength('Abcdefg1!')

    expect(weak.score).toBeLessThan(medium.score)
    expect(medium.score).toBeLessThan(strong.score)
  })

  it('detects common patterns', () => {
    const result = validatePasswordStrength('password123!')
    expect(result.feedback).toContain('Avoid common password patterns')
  })

  it('detects repeating characters', () => {
    const result = validatePasswordStrength('AAAaaabb1!')
    expect(result.feedback).toContain('Avoid repeating characters')
  })

  it('validates a strong password', () => {
    const result = validatePasswordStrength('MyStr0ng!Pass')
    expect(result.isValid).toBe(true)
    expect(result.score).toBeGreaterThanOrEqual(3)
  })
})

describe('getPasswordStrengthLabel', () => {
  it('returns Weak for score 0-1', () => {
    expect(getPasswordStrengthLabel(0)).toBe('Weak')
    expect(getPasswordStrengthLabel(1)).toBe('Weak')
  })

  it('returns Fair for score 2', () => {
    expect(getPasswordStrengthLabel(2)).toBe('Fair')
  })

  it('returns Good for score 3', () => {
    expect(getPasswordStrengthLabel(3)).toBe('Good')
  })

  it('returns Strong for score 4-5', () => {
    expect(getPasswordStrengthLabel(4)).toBe('Strong')
    expect(getPasswordStrengthLabel(5)).toBe('Strong')
  })

  it('returns Unknown for out-of-range scores', () => {
    expect(getPasswordStrengthLabel(6)).toBe('Unknown')
    expect(getPasswordStrengthLabel(-1)).toBe('Unknown')
  })
})
