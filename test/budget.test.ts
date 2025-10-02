import { describe, it, expect, beforeEach, jest } from 'vitest'
import { generateAutoBudget } from '@/lib/ai/auto-budget'
import { createServiceClient } from '@/lib/supabase/server'

// Mock the Supabase service client
jest.mock('@/lib/supabase/server')
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({
          data: [
            { id: 'cat-1', name: 'Food & Drink' },
            { id: 'cat-2', name: 'Transportation' },
            { id: 'cat-3', name: 'Housing' }
          ],
          error: null
        }))
      }))
    }))
  }))
}

beforeEach(() => {
  (createServiceClient as jest.Mock).mockReturnValue(mockSupabase)
})

describe('Auto Budget Generation', () => {
  it('should generate budget proposals for a user', async () => {
    const userId = 'test-user-id'
    const periodYear = 2024
    const periodMonth = 10

    // Mock selectLedgerSummary to return test data
    jest.doMock('@/lib/ai/select-ledger', () => ({
      selectLedgerSummary: jest.fn(() => Promise.resolve({
        months: [
          { ym: '2024-09', income_minor: 500000, expense_minor: 400000, net_minor: 100000 },
          { ym: '2024-08', income_minor: 500000, expense_minor: 380000, net_minor: 120000 }
        ],
        topCategories: [
          { category_id: 'cat-1', name: 'Food & Drink', amount_minor: 150000 }
        ]
      }))
    }))

    // Mock category spending data
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'transactions') {
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              eq: jest.fn(() => ({
                eq: jest.fn(() => ({
                  gte: jest.fn(() => ({
                    lte: jest.fn(() => ({
                      is: jest.fn(() => Promise.resolve({
                        data: [
                          {
                            category_id: 'cat-1',
                            amount_minor: 50000,
                            categories: { name: 'Food & Drink' }
                          },
                          {
                            category_id: 'cat-2',
                            amount_minor: 30000,
                            categories: { name: 'Transportation' }
                          }
                        ],
                        error: null
                      }))
                    }))
                  }))
                }))
              }))
            }))
          }))
        }
      }
      return {
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({
              data: [
                { id: 'cat-1', name: 'Food & Drink' },
                { id: 'cat-2', name: 'Transportation' }
              ],
              error: null
            }))
          }))
        }))
      }
    })

    const result = await generateAutoBudget(userId, periodYear, periodMonth)

    expect(result).toBeDefined()
    expect(result.proposals).toBeInstanceOf(Array)
    expect(result.proposals.length).toBeGreaterThan(0)
    expect(result.total_income).toBe(500000) // From mocked data
    expect(result.period_year).toBe(periodYear)
    expect(result.period_month).toBe(periodMonth)
    expect(result.methodology).toContain('budgeting')
  })

  it('should handle zero-based budgeting option', async () => {
    const userId = 'test-user-id'
    const periodYear = 2024
    const periodMonth = 10

    const result = await generateAutoBudget(userId, periodYear, periodMonth, {
      zeroBased: true,
      targetSavingsRate: 25
    })

    expect(result).toBeDefined()
    expect(result.methodology).toContain('Zero-based')
  })

  it('should handle custom savings rate', async () => {
    const userId = 'test-user-id'
    const periodYear = 2024
    const periodMonth = 10

    const result = await generateAutoBudget(userId, periodYear, periodMonth, {
      targetSavingsRate: 30
    })

    expect(result).toBeDefined()
    // The savings rate should influence the budget calculations
    expect(result.total_allocated).toBeLessThan(result.total_income)
  })

  it('should validate budget proposal structure', async () => {
    const userId = 'test-user-id'
    const periodYear = 2024
    const periodMonth = 10

    const result = await generateAutoBudget(userId, periodYear, periodMonth)

    result.proposals.forEach(proposal => {
      expect(proposal).toHaveProperty('category_id')
      expect(proposal).toHaveProperty('category_name')
      expect(proposal).toHaveProperty('limit_minor')
      expect(proposal).toHaveProperty('rationale')
      expect(proposal).toHaveProperty('confidence')

      // Validate data types
      expect(typeof proposal.category_id).toBe('string')
      expect(typeof proposal.category_name).toBe('string')
      expect(typeof proposal.limit_minor).toBe('number')
      expect(typeof proposal.rationale).toBe('string')
      expect(typeof proposal.confidence).toBe('number')

      // Validate ranges
      expect(proposal.limit_minor).toBeGreaterThanOrEqual(0)
      expect(proposal.confidence).toBeGreaterThanOrEqual(0)
      expect(proposal.confidence).toBeLessThanOrEqual(100)
    })
  })

  it('should handle errors gracefully', async () => {
    const userId = 'invalid-user-id'
    const periodYear = 2024
    const periodMonth = 10

    // Mock an error scenario
    jest.doMock('@/lib/ai/select-ledger', () => ({
      selectLedgerSummary: jest.fn(() => Promise.reject(new Error('Database error')))
    }))

    await expect(generateAutoBudget(userId, periodYear, periodMonth))
      .rejects.toThrow('Database error')
  })
})

describe('Budget Calculations', () => {
  it('should calculate total allocation correctly', async () => {
    const userId = 'test-user-id'
    const periodYear = 2024
    const periodMonth = 10

    const result = await generateAutoBudget(userId, periodYear, periodMonth)

    const calculatedTotal = result.proposals.reduce((sum, proposal) => sum + proposal.limit_minor, 0)
    expect(calculatedTotal).toBe(result.total_allocated)
  })

  it('should ensure budget limits are in minor units', async () => {
    const userId = 'test-user-id'
    const periodYear = 2024
    const periodMonth = 10

    const result = await generateAutoBudget(userId, periodYear, periodMonth)

    result.proposals.forEach(proposal => {
      // All amounts should be in minor units (cents)
      expect(proposal.limit_minor % 1).toBe(0)
      expect(proposal.limit_minor).toBeGreaterThanOrEqual(0)
    })
  })
})
