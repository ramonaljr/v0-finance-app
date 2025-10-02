import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Find all recurring transactions that are due
    const now = new Date()
    const { data: recurringTransactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('is_recurring', true)
      .not('recur_rule', 'is', null)
      .is('deleted_at', null)

    if (error) {
      throw error
    }

    const createdTransactions = []
    const processedRecurring = []

    for (const recurring of recurringTransactions || []) {
      const nextRun = new Date(recurring.next_run || recurring.created_at)

      // Check if this recurring transaction is due
      if (nextRun <= now) {
        // Create the new transaction
        const { data: newTransaction, error: createError } = await supabase
          .from('transactions')
          .insert({
            user_id: recurring.user_id,
            account_id: recurring.account_id,
            category_id: recurring.category_id,
            amount_minor: recurring.amount_minor,
            currency_code: recurring.currency_code,
            direction: recurring.direction,
            occurred_at: now.toISOString(),
            payee: recurring.payee,
            notes: recurring.notes,
            tags: recurring.tags,
            is_recurring: false, // The new transaction is not recurring
            attachment_url: recurring.attachment_url,
            is_reconciled: false,
            created_at: now.toISOString(),
            updated_at: now.toISOString()
          })
          .select('id')
          .single()

        if (createError) {
          console.error(`Error creating recurring transaction for user ${recurring.user_id}:`, createError)
          continue
        }

        // Calculate next run date based on recur_rule
        let nextRunDate = new Date(nextRun)

        // Simple recurring rules: daily, weekly, monthly, yearly
        if (recurring.recur_rule === 'daily') {
          nextRunDate.setDate(nextRunDate.getDate() + 1)
        } else if (recurring.recur_rule === 'weekly') {
          nextRunDate.setDate(nextRunDate.getDate() + 7)
        } else if (recurring.recur_rule === 'monthly') {
          nextRunDate.setMonth(nextRunDate.getMonth() + 1)
        } else if (recurring.recur_rule === 'yearly') {
          nextRunDate.setFullYear(nextRunDate.getFullYear() + 1)
        } else {
          // Default to monthly if rule is unknown
          nextRunDate.setMonth(nextRunDate.getMonth() + 1)
        }

        // Update the recurring transaction with new next_run
        const { error: updateError } = await supabase
          .from('transactions')
          .update({
            next_run: nextRunDate.toISOString(),
            updated_at: now.toISOString()
          })
          .eq('id', recurring.id)

        if (updateError) {
          console.error(`Error updating recurring transaction ${recurring.id}:`, updateError)
        }

        createdTransactions.push({
          recurring_id: recurring.id,
          new_transaction_id: newTransaction?.id,
          amount_minor: recurring.amount_minor,
          payee: recurring.payee
        })

        processedRecurring.push({
          id: recurring.id,
          next_run: nextRunDate.toISOString()
        })
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        created_transactions: createdTransactions.length,
        processed_recurring: processedRecurring.length,
        created_transactions: createdTransactions,
        processed_recurring: processedRecurring
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Recurring transactions error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

