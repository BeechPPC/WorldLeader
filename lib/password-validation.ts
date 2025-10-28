export interface PasswordStrength {
  isValid: boolean
  score: number // 0-4
  feedback: string[]
}

export function validatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = []
  let score = 0

  // Check minimum length
  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters long')
    return { isValid: false, score: 0, feedback }
  }
  score++

  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    feedback.push('Add at least one uppercase letter')
  } else {
    score++
  }

  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    feedback.push('Add at least one lowercase letter')
  } else {
    score++
  }

  // Check for numbers
  if (!/\d/.test(password)) {
    feedback.push('Add at least one number')
  } else {
    score++
  }

  // Check for special characters
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push('Add at least one special character (!@#$%^&* etc.)')
  } else {
    score++
  }

  // Check for common patterns
  const commonPatterns = [
    /^123456/,
    /^password/i,
    /^qwerty/i,
    /^abc123/i,
    /^111111/,
    /^letmein/i,
  ]

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      feedback.push('Avoid common password patterns')
      score = Math.max(0, score - 2)
      break
    }
  }

  // Check for sequential characters
  if (/(.)\1{2,}/.test(password)) {
    feedback.push('Avoid repeating characters')
    score = Math.max(0, score - 1)
  }

  const isValid = score >= 3 // Require at least 3 out of 5 criteria

  if (isValid && feedback.length === 0) {
    feedback.push('Strong password!')
  }

  return { isValid, score, feedback }
}

export function getPasswordStrengthLabel(score: number): string {
  switch (score) {
    case 0:
    case 1:
      return 'Weak'
    case 2:
      return 'Fair'
    case 3:
      return 'Good'
    case 4:
    case 5:
      return 'Strong'
    default:
      return 'Unknown'
  }
}
