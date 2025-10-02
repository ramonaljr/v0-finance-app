import { describe, it, expect, beforeEach, vi } from 'vitest'
import { materializeKpiCache, materializeKpiCacheForUser } from '@/lib/cache/materialize-kpi'

// Mock Supabase client
const mockSupabaseClient = {
  from: vi.fn(() => mockSupabaseClient),
  select: vi.fn(() => mockSupabaseClient),
  eq: vi.fn(() => mockSupabaseClient),
  gte: vi.fn(() => mockSupabaseClient),
  lte: vi.fn(() => mockSupabaseClient),
  is: vi.fn(() => mockSupabaseClient),
  upsert: vi.fn(() => Promise.resolve({ error: null })),
}

describe('materializeKpiCache', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should calculate income and expense totals correctly', async () => {
    const mockTransactions = [
      { direction: 'in', amount_minor: 100000, category_id: null },
      { direction: 'out', amount_minor: 50000, category_id: 'cat-1' },
      { direction: 'out', amount_minor: 30000, category_id: 'cat-2' },
      { direction: 'in', amount_minor: 50000, category_id: null },
    ]

    mockSupabaseClient.select.mockResolvedValueOnce({
      data: mockTransactions,
      error: null,
    })

    const result = await materializeKpiCache(
      mockSupabaseClient as any,
      'user-123',
      2025,
      1
    )

    expect(result.income_minor).toBe(150000)
    expect(result.expense_minor).toBe(80000)
    expect(result.net_minor).toBe(70000)
  })

  it('should identify top 5 spending categories', async () => {
    const mockTransactions = [
      { direction: 'out', amount_minor: 100000, category_id: 'cat-1' },
      { direction: 'out', amount_minor: 80000, category_id: 'cat-2' },
      { direction: 'out', amount_minor: 60000, category_id: 'cat-3' },
      { direction: 'out', amount_minor: 40000, category_id: 'cat-4' },
      { direction: 'out', amount_minor: 20000, category_id: 'cat-5' },
      { direction: 'out', amount_minor: 10000, category_id: 'cat-6' },
      { direction: 'out', amount_minor: 50000, category_id: 'cat-1' }, // Add more to cat-1
    ]

    mockSupabaseClient.select.mockResolvedValueOnce({
      data: mockTransactions,
      error: null,
    })

    const result = await materializeKpiCache(
      mockSupabaseClient as any,
      'user-123',
      2025,
      1
    )

    expect(result.top_cats).toHaveLength(5)
    expect(result.top_cats[0].category_id).toBe('cat-1')
    expect(result.top_cats[0].amount_minor).toBe(150000)
  })

  it('should handle periods with no transactions', async () => {
    mockSupabaseClient.select.mockResolvedValueOnce({
      data: [],
      error: null,
    })

    const result = await materializeKpiCache(
      mockSupabaseClient as any,
      'user-123',
      2025,
      1
    )

    expect(result.income_minor).toBe(0)
    expect(result.expense_minor).toBe(0)
    expect(result.net_minor).toBe(0)
    expect(result.top_cats).toHaveLength(0)
  })

  it('should upsert to kpi_cache table', async () => {
    mockSupabaseClient.select.mockResolvedValueOnce({
      data: [{ direction: 'in', amount_minor: 100000, category_id: null }],
      error: null,
    })

    await materializeKpiCache(mockSupabaseClient as any, 'user-123', 2025, 1)

    expect(mockSupabaseClient.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-123',
        period_year: 2025,
        period_month: 1,
      }),
      expect.objectContaining({
        onConflict: 'user_id,period_year,period_month',
      })
    )
  })

  it('should throw error if transaction fetch fails', async () => {
    mockSupabaseClient.select.mockResolvedValueOnce({
      data: null,
      error: { message: 'Database error' },
    })

    await expect(
      materializeKpiCache(mockSupabaseClient as any, 'user-123', 2025, 1)
    ).rejects.toThrow('Failed to fetch transactions')
  })
})

describe('materializeKpiCacheForUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should materialize last 12 months by default', async () => {
    mockSupabaseClient.select.mockResolvedValue({
      data: [],
      error: null,
    })

    const results = await materializeKpiCacheForUser(
      mockSupabaseClient as any,
      'user-123'
    )

    expect(results).toHaveLength(12)
  })

  it('should materialize specified periods', async () => {
    mockSupabaseClient.select.mockResolvedValue({
      data: [],
      error: null,
    })

    const periods = [
      { year: 2025, month: 1 },
      { year: 2025, month: 2 },
    ]

    const results = await materializeKpiCacheForUser(
      mockSupabaseClient as any,
      'user-123',
      periods
    )

    expect(results).toHaveLength(2)
    expect(results[0].period_year).toBe(2025)
    expect(results[0].period_month).toBe(1)
  })
})
