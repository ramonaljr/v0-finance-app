import { describe, it, expect, beforeEach, vi } from 'vitest'
import { parseRecurRule, calculateNextOccurrence, runRecurringEngine } from '@/lib/recurring/engine'

describe('parseRecurRule', () => {
  it('should parse daily recurrence', () => {
    const result = parseRecurRule('FREQ=DAILY;INTERVAL=1')
    expect(result.freq).toBe('DAILY')
    expect(result.interval).toBe(1)
  })

  it('should parse weekly recurrence', () => {
    const result = parseRecurRule('FREQ=WEEKLY;INTERVAL=2')
    expect(result.freq).toBe('WEEKLY')
    expect(result.interval).toBe(2)
  })

  it('should parse monthly recurrence', () => {
    const result = parseRecurRule('FREQ=MONTHLY;INTERVAL=1')
    expect(result.freq).toBe('MONTHLY')
    expect(result.interval).toBe(1)
  })

  it('should parse yearly recurrence', () => {
    const result = parseRecurRule('FREQ=YEARLY;INTERVAL=1')
    expect(result.freq).toBe('YEARLY')
    expect(result.interval).toBe(1)
  })

  it('should default to monthly with interval 1', () => {
    const result = parseRecurRule('')
    expect(result.freq).toBe('MONTHLY')
    expect(result.interval).toBe(1)
  })
})

describe('calculateNextOccurrence', () => {
  it('should calculate next daily occurrence', () => {
    const lastOccurrence = new Date('2025-01-01')
    const next = calculateNextOccurrence(lastOccurrence, 'FREQ=DAILY;INTERVAL=1')
    expect(next.toISOString().split('T')[0]).toBe('2025-01-02')
  })

  it('should calculate next weekly occurrence', () => {
    const lastOccurrence = new Date('2025-01-01')
    const next = calculateNextOccurrence(lastOccurrence, 'FREQ=WEEKLY;INTERVAL=1')
    expect(next.toISOString().split('T')[0]).toBe('2025-01-08')
  })

  it('should calculate next monthly occurrence', () => {
    const lastOccurrence = new Date('2025-01-15')
    const next = calculateNextOccurrence(lastOccurrence, 'FREQ=MONTHLY;INTERVAL=1')
    expect(next.toISOString().split('T')[0]).toBe('2025-02-15')
  })

  it('should calculate next yearly occurrence', () => {
    const lastOccurrence = new Date('2025-01-01')
    const next = calculateNextOccurrence(lastOccurrence, 'FREQ=YEARLY;INTERVAL=1')
    expect(next.toISOString().split('T')[0]).toBe('2026-01-01')
  })

  it('should handle intervals > 1', () => {
    const lastOccurrence = new Date('2025-01-01')
    const next = calculateNextOccurrence(lastOccurrence, 'FREQ=MONTHLY;INTERVAL=3')
    expect(next.toISOString().split('T')[0]).toBe('2025-04-01')
  })
})

describe('runRecurringEngine', () => {
  let mockSupabaseClient: any

  beforeEach(() => {
    mockSupabaseClient = {
      from: vi.fn(() => mockSupabaseClient),
      select: vi.fn(() => mockSupabaseClient),
      eq: vi.fn(() => mockSupabaseClient),
      not: vi.fn(() => mockSupabaseClient),
      is: vi.fn(() => mockSupabaseClient),
      gte: vi.fn(() => mockSupabaseClient),
      lte: vi.fn(() => mockSupabaseClient),
      limit: vi.fn(() => mockSupabaseClient),
      insert: vi.fn(() => Promise.resolve({ error: null })),
      update: vi.fn(() => Promise.resolve({ error: null })),
    }
  })

  it('should process recurring transactions that are due', async () => {
    const mockRecurringTxs = [
      {
        id: 'tx-1',
        user_id: 'user-123',
        account_id: 'acc-1',
        category_id: 'cat-1',
        amount_minor: 1000,
        currency_code: 'USD',
        direction: 'out',
        occurred_at: '2025-01-01T00:00:00Z',
        payee: 'Netflix',
        notes: 'Monthly subscription',
        tags: ['subscription'],
        attachment_url: null,
        is_recurring: true,
        recur_rule: 'FREQ=MONTHLY;INTERVAL=1',
      },
    ]

    mockSupabaseClient.select
      .mockResolvedValueOnce({
        // First call: get recurring transactions
        data: mockRecurringTxs,
        error: null,
      })
      .mockResolvedValueOnce({
        // Second call: check for existing transactions
        data: [],
        error: null,
      })

    const asOfDate = new Date('2025-02-15') // After next occurrence
    const result = await runRecurringEngine(mockSupabaseClient, asOfDate)

    expect(result.processed).toBe(1)
    expect(result.created).toBe(1)
    expect(result.errors).toHaveLength(0)
    expect(mockSupabaseClient.insert).toHaveBeenCalled()
  })

  it('should skip if next occurrence is in the future', async () => {
    const mockRecurringTxs = [
      {
        id: 'tx-1',
        user_id: 'user-123',
        account_id: 'acc-1',
        category_id: null,
        amount_minor: 1000,
        currency_code: 'USD',
        direction: 'out',
        occurred_at: '2025-01-01T00:00:00Z',
        payee: 'Netflix',
        notes: null,
        tags: [],
        attachment_url: null,
        is_recurring: true,
        recur_rule: 'FREQ=MONTHLY;INTERVAL=1',
      },
    ]

    mockSupabaseClient.select.mockResolvedValueOnce({
      data: mockRecurringTxs,
      error: null,
    })

    const asOfDate = new Date('2025-01-15') // Before next occurrence
    const result = await runRecurringEngine(mockSupabaseClient, asOfDate)

    expect(result.processed).toBe(1)
    expect(result.created).toBe(0)
    expect(mockSupabaseClient.insert).not.toHaveBeenCalled()
  })

  it('should skip if transaction already exists for period', async () => {
    const mockRecurringTxs = [
      {
        id: 'tx-1',
        user_id: 'user-123',
        account_id: 'acc-1',
        category_id: null,
        amount_minor: 1000,
        currency_code: 'USD',
        direction: 'out',
        occurred_at: '2025-01-01T00:00:00Z',
        payee: 'Netflix',
        notes: null,
        tags: [],
        attachment_url: null,
        is_recurring: true,
        recur_rule: 'FREQ=MONTHLY;INTERVAL=1',
      },
    ]

    mockSupabaseClient.select
      .mockResolvedValueOnce({
        // Get recurring transactions
        data: mockRecurringTxs,
        error: null,
      })
      .mockResolvedValueOnce({
        // Check for existing - found one
        data: [{ id: 'existing-tx' }],
        error: null,
      })

    const asOfDate = new Date('2025-02-15')
    const result = await runRecurringEngine(mockSupabaseClient, asOfDate)

    expect(result.processed).toBe(1)
    expect(result.created).toBe(0)
    expect(mockSupabaseClient.insert).not.toHaveBeenCalled()
  })

  it('should handle errors gracefully', async () => {
    const mockRecurringTxs = [
      {
        id: 'tx-1',
        user_id: 'user-123',
        account_id: 'acc-1',
        category_id: null,
        amount_minor: 1000,
        currency_code: 'USD',
        direction: 'out',
        occurred_at: '2025-01-01T00:00:00Z',
        payee: 'Netflix',
        notes: null,
        tags: [],
        attachment_url: null,
        is_recurring: true,
        recur_rule: 'FREQ=MONTHLY;INTERVAL=1',
      },
    ]

    mockSupabaseClient.select
      .mockResolvedValueOnce({
        data: mockRecurringTxs,
        error: null,
      })
      .mockResolvedValueOnce({
        data: [],
        error: null,
      })

    mockSupabaseClient.insert.mockResolvedValueOnce({
      error: { message: 'Insert failed' },
    })

    const asOfDate = new Date('2025-02-15')
    const result = await runRecurringEngine(mockSupabaseClient, asOfDate)

    expect(result.processed).toBe(1)
    expect(result.created).toBe(0)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].id).toBe('tx-1')
  })
})
