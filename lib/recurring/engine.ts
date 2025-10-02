// Recurring transactions engine
import { SupabaseClient } from '@supabase/supabase-js'

export interface RecurringTransaction {
  id: string
  user_id: string
  account_id: string | null
  category_id: string | null
  amount_minor: number
  currency_code: string
  direction: 'in' | 'out'
  payee: string | null
  notes: string | null
  tags: string[]
  attachment_url: string | null
  recur_rule: string
  occurred_at: string
}

/**
 * Parse a simple recurrence rule (RRULE-lite)
 * Format: "FREQ=DAILY;INTERVAL=1" or "FREQ=WEEKLY;INTERVAL=1" or "FREQ=MONTHLY;INTERVAL=1"
 */
export function parseRecurRule(rule: string): {
  freq: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
  interval: number
} {
  const parts = rule.split(';')
  let freq: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' = 'MONTHLY'
  let interval = 1

  parts.forEach(part => {
    const [key, value] = part.split('=')
    if (key === 'FREQ') {
      freq = value as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
    } else if (key === 'INTERVAL') {
      interval = parseInt(value, 10)
    }
  })

  return { freq, interval }
}

/**
 * Calculate next occurrence date based on recurrence rule
 */
export function calculateNextOccurrence(
  lastOccurrence: Date,
  rule: string
): Date {
  const { freq, interval } = parseRecurRule(rule)
  const next = new Date(lastOccurrence)

  switch (freq) {
    case 'DAILY':
      next.setDate(next.getDate() + interval)
      break
    case 'WEEKLY':
      next.setDate(next.getDate() + interval * 7)
      break
    case 'MONTHLY':
      next.setMonth(next.getMonth() + interval)
      break
    case 'YEARLY':
      next.setFullYear(next.getFullYear() + interval)
      break
  }

  return next
}

/**
 * Run recurring transactions engine - creates new transactions for recurring templates
 */
export async function runRecurringEngine(
  supabase: SupabaseClient,
  asOfDate?: Date
): Promise<{
  processed: number
  created: number
  errors: Array<{ id: string; error: string }>
}> {
  const now = asOfDate || new Date()
  const results = {
    processed: 0,
    created: 0,
    errors: [] as Array<{ id: string; error: string }>,
  }

  // Find all recurring transactions that are templates
  // (is_recurring = true and have a recur_rule)
  const { data: recurringTxs, error: fetchError } = await supabase
    .from('transactions')
    .select('*')
    .eq('is_recurring', true)
    .not('recur_rule', 'is', null)
    .is('deleted_at', null)

  if (fetchError) {
    throw new Error(`Failed to fetch recurring transactions: ${fetchError.message}`)
  }

  if (!recurringTxs || recurringTxs.length === 0) {
    return results
  }

  // Process each recurring transaction
  for (const tx of recurringTxs as RecurringTransaction[]) {
    results.processed++

    try {
      const lastOccurrence = new Date(tx.occurred_at)
      const nextOccurrence = calculateNextOccurrence(lastOccurrence, tx.recur_rule)

      // If next occurrence is in the future, skip
      if (nextOccurrence > now) {
        continue
      }

      // Check if we already created a transaction for this occurrence
      const { data: existingTxs } = await supabase
        .from('transactions')
        .select('id')
        .eq('user_id', tx.user_id)
        .eq('payee', tx.payee || '')
        .eq('amount_minor', tx.amount_minor)
        .eq('direction', tx.direction)
        .gte('occurred_at', nextOccurrence.toISOString())
        .lte('occurred_at', new Date(nextOccurrence.getTime() + 86400000).toISOString()) // +24 hours
        .is('deleted_at', null)
        .limit(1)

      if (existingTxs && existingTxs.length > 0) {
        // Already exists, update the template's occurred_at to next occurrence
        await supabase
          .from('transactions')
          .update({ occurred_at: nextOccurrence.toISOString() })
          .eq('id', tx.id)
        continue
      }

      // Create new transaction instance
      const newTx = {
        user_id: tx.user_id,
        account_id: tx.account_id,
        category_id: tx.category_id,
        amount_minor: tx.amount_minor,
        currency_code: tx.currency_code,
        direction: tx.direction,
        occurred_at: nextOccurrence.toISOString(),
        payee: tx.payee,
        notes: tx.notes,
        tags: tx.tags || [],
        attachment_url: tx.attachment_url,
        is_recurring: false, // Instances are not recurring
        recur_rule: null,
        is_reconciled: false,
      }

      const { error: insertError } = await supabase
        .from('transactions')
        .insert(newTx)

      if (insertError) {
        results.errors.push({ id: tx.id, error: insertError.message })
        continue
      }

      // Update the template's occurred_at to next occurrence
      await supabase
        .from('transactions')
        .update({ occurred_at: nextOccurrence.toISOString() })
        .eq('id', tx.id)

      results.created++
    } catch (error: any) {
      results.errors.push({ id: tx.id, error: error.message })
    }
  }

  return results
}
