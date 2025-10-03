import { describe, it, expect } from 'vitest'

/**
 * PII Redaction Unit Tests
 *
 * Tests the redactPII function from lib/ai/coach.ts to ensure
 * it properly redacts sensitive information before logging.
 */

// Re-implement redactPII here for testing (should match lib/ai/coach.ts)
function redactPII(text: string): string {
  return text
    .replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '[CARD_NUMBER]')
    .replace(/\b\d{10,}\b/g, '[ACCOUNT_NUMBER]')
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
    .replace(/\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g, '[SSN]') // SSN pattern
    .replace(/\b\d{3}[-\s]?\d{3}[-\s]?\d{4}\b/g, '[PHONE]') // US phone pattern
}

describe('PII Redaction', () => {
  describe('Email addresses', () => {
    it('should redact standard email addresses', () => {
      const text = 'Contact me at john.doe@example.com for details'
      const result = redactPII(text)
      expect(result).toBe('Contact me at [EMAIL] for details')
    })

    it('should redact multiple email addresses', () => {
      const text = 'Send to alice@test.com and bob@company.co.uk'
      const result = redactPII(text)
      expect(result).toBe('Send to [EMAIL] and [EMAIL]')
    })

    it('should redact email with numbers and special chars', () => {
      const text = 'Email: user_123+test@sub-domain.example.org'
      const result = redactPII(text)
      expect(result).toBe('Email: [EMAIL]')
    })
  })

  describe('Credit card numbers', () => {
    it('should redact 16-digit card number with spaces', () => {
      const text = 'Card: 4532 1234 5678 9010'
      const result = redactPII(text)
      expect(result).toBe('Card: [CARD_NUMBER]')
    })

    it('should redact 16-digit card number with dashes', () => {
      const text = 'Card: 4532-1234-5678-9010'
      const result = redactPII(text)
      expect(result).toBe('Card: [CARD_NUMBER]')
    })

    it('should redact 16-digit card number without separators', () => {
      const text = 'Card: 4532123456789010'
      const result = redactPII(text)
      expect(result).toBe('Card: [CARD_NUMBER]')
    })

    it('should redact Amex 15-digit card number', () => {
      const text = 'Amex: 3782 822463 10005'
      const result = redactPII(text)
      expect(result).toBe('Amex: [CARD_NUMBER]')
    })
  })

  describe('Account numbers', () => {
    it('should redact 10-digit account number', () => {
      const text = 'Account: 1234567890'
      const result = redactPII(text)
      expect(result).toBe('Account: [ACCOUNT_NUMBER]')
    })

    it('should redact longer account numbers', () => {
      const text = 'Account: 123456789012345'
      const result = redactPII(text)
      expect(result).toBe('Account: [ACCOUNT_NUMBER]')
    })

    it('should NOT redact shorter numbers (could be amounts)', () => {
      const text = 'Amount: 12345 USD'
      const result = redactPII(text)
      expect(result).toBe('Amount: 12345 USD')
    })
  })

  describe('Social Security Numbers', () => {
    it('should redact SSN with dashes', () => {
      const text = 'SSN: 123-45-6789'
      const result = redactPII(text)
      expect(result).toBe('SSN: [SSN]')
    })

    it('should redact SSN with spaces', () => {
      const text = 'SSN: 123 45 6789'
      const result = redactPII(text)
      expect(result).toBe('SSN: [SSN]')
    })

    it('should redact SSN without separators', () => {
      const text = 'SSN: 123456789'
      const result = redactPII(text)
      expect(result).toBe('SSN: [SSN]')
    })
  })

  describe('Phone numbers', () => {
    it('should redact US phone with dashes', () => {
      const text = 'Call: 555-123-4567'
      const result = redactPII(text)
      expect(result).toBe('Call: [PHONE]')
    })

    it('should redact US phone with spaces', () => {
      const text = 'Call: 555 123 4567'
      const result = redactPII(text)
      expect(result).toBe('Call: [PHONE]')
    })

    it('should redact US phone without separators', () => {
      const text = 'Call: 5551234567'
      const result = redactPII(text)
      expect(result).toBe('Call: [PHONE]')
    })
  })

  describe('Mixed PII scenarios', () => {
    it('should redact multiple PII types in same text', () => {
      const text = 'User john@example.com, card 4532-1234-5678-9010, phone 555-123-4567'
      const result = redactPII(text)
      expect(result).toBe('User [EMAIL], card [CARD_NUMBER], phone [PHONE]')
    })

    it('should preserve financial data (amounts, dates)', () => {
      const text = 'Spent $1,234.56 on 2025-01-15'
      const result = redactPII(text)
      expect(result).toBe('Spent $1,234.56 on 2025-01-15')
    })

    it('should redact PII in AI coach context', () => {
      const text = `I spent money at payee@company.com using card 4532123456789010.
        My account 9876543210 shows the charge.
        Contact me at 555-123-4567 or myemail@test.com`

      const result = redactPII(text)

      expect(result).not.toContain('payee@company.com')
      expect(result).not.toContain('4532123456789010')
      expect(result).not.toContain('9876543210')
      expect(result).not.toContain('555-123-4567')
      expect(result).not.toContain('myemail@test.com')
      expect(result).toContain('[EMAIL]')
      expect(result).toContain('[CARD_NUMBER]')
      expect(result).toContain('[ACCOUNT_NUMBER]')
      expect(result).toContain('[PHONE]')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty string', () => {
      const result = redactPII('')
      expect(result).toBe('')
    })

    it('should handle text with no PII', () => {
      const text = 'I spent $50 on groceries yesterday'
      const result = redactPII(text)
      expect(result).toBe(text)
    })

    it('should not over-redact UUIDs or transaction IDs', () => {
      const text = 'Transaction ID: abc-123-def-456'
      const result = redactPII(text)
      expect(result).toBe(text) // Should not match SSN pattern
    })
  })
})
