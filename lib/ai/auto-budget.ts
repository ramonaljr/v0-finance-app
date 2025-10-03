import { selectLedgerSummary } from './select-ledger'
import { createServiceClient } from '@/lib/supabase/server'

// Lazy initialize OpenAI client to avoid issues during build
let openaiClient: any = null

function getOpenAIClient() {
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    const OpenAI = require('openai').default
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiClient
}

export interface BudgetProposal {
  category_id: string
  category_name: string
  limit_minor: number
  rationale: string
  confidence: number // 0-100
}

export interface AutoBudgetResponse {
  proposals: BudgetProposal[]
  total_allocated: number
  total_income: number
  period_year: number
  period_month: number
  methodology: string
}

export async function generateAutoBudget(
  userId: string,
  periodYear: number,
  periodMonth: number,
  options: {
    targetSavingsRate?: number
    zeroBased?: boolean
    includeRollover?: boolean
  } = {}
): Promise<AutoBudgetResponse> {
  try {
    const supabase = createServiceClient()

    // Get user's financial summary for the last 6 months
    const since = new Date()
    since.setMonth(since.getMonth() - 6)

    const ledgerSummary = await selectLedgerSummary(userId, since)

    // Get user's categories
    const { data: categories } = await supabase
      .from('categories')
      .select('id, name')
      .eq('user_id', userId)
      .order('name')

    if (!categories || categories.length === 0) {
      throw new Error('No categories found. Please create some categories first.')
    }

    // Calculate average monthly income from last 6 months
    const monthlyIncome = ledgerSummary.months.reduce((sum, m) => sum + m.income_minor, 0) / Math.max(ledgerSummary.months.length, 1)
    const targetSavingsRate = options.targetSavingsRate || 20 // Default 20% savings rate
    const targetSavings = (monthlyIncome * targetSavingsRate) / 100

    // Calculate total expenses by category from last 6 months
    const categoryTotals = new Map<string, { name: string; total_minor: number; count: number }>()

    ledgerSummary.months.forEach(month => {
      // This would need to be implemented in selectLedgerSummary to include category breakdowns
      // For now, we'll use the top categories as a proxy
    })

    // Get more detailed category spending from transactions
    const startDate = new Date(periodYear, periodMonth - 1, 1)
    const endDate = new Date(periodYear, periodMonth, 0, 23, 59, 59)

    const { data: categorySpending } = await supabase
      .from('transactions')
      .select(`
        category_id,
        amount_minor,
        categories!inner(name)
      `)
      .eq('user_id', userId)
      .eq('direction', 'out')
      .gte('occurred_at', startDate.toISOString())
      .lte('occurred_at', endDate.toISOString())
      .is('deleted_at', null)

    // Group by category
    const categoryBreakdown = new Map<string, { name: string; total_minor: number; count: number }>()

    categorySpending?.forEach(tx => {
      const categoryId = tx.category_id || 'uncategorized'
      const categoryName = (tx.categories as any)?.name || 'Uncategorized'

      const current = categoryBreakdown.get(categoryId) || { name: categoryName, total_minor: 0, count: 0 }
      current.total_minor += tx.amount_minor
      current.count += 1
      categoryBreakdown.set(categoryId, current)
    })

    // Create system prompt for budget proposal
    const systemPrompt = `You are an AI budget advisor. Create a monthly budget proposal based on the user's historical spending patterns and financial goals.

User's Financial Profile:
- Average Monthly Income: $${(monthlyIncome / 100).toFixed(2)}
- Target Savings Rate: ${targetSavingsRate}%
- Target Monthly Savings: $${(targetSavings / 100).toFixed(2)}
- Available for Budgeting: $${((monthlyIncome - targetSavings) / 100).toFixed(2)}

Spending Patterns (last 6 months):
${Array.from(categoryBreakdown.entries()).map(([id, data]) =>
  `- ${data.name}: $${(data.total_minor / 100).toFixed(2)} (${data.count} transactions)`
).join('\n')}

Available Categories:
${categories.map(c => `- ${c.name} (${c.id})`).join('\n')}

Guidelines:
- Use zero-based budgeting by default (allocate all available income)
- Prioritize essential categories (housing, food, transportation, utilities)
- Suggest realistic limits based on historical spending
- Include buffer for unexpected expenses
- Provide confidence score for each allocation (based on spending consistency)
- Explain rationale for each category allocation

Return budget proposals as a JSON array with category_id, category_name, limit_minor, rationale, and confidence.`

    // Call OpenAI to generate budget proposal
    const openai = getOpenAIClient()
    if (!openai) {
      throw new Error('OpenAI API key not configured')
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using GPT-4o-mini for best cost/performance
      messages: [
        { role: 'system', content: systemPrompt }
      ],
      max_tokens: 1000,
      temperature: 0.3, // Lower temperature for more consistent budgeting
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from budget AI')
    }

    // Parse the JSON response (expecting an array of budget proposals)
    let proposals: BudgetProposal[]
    try {
      proposals = JSON.parse(response)
    } catch (parseError) {
      throw new Error('Invalid budget proposal response format')
    }

    // Validate and enhance proposals
    const validProposals = proposals.map(proposal => ({
      ...proposal,
      limit_minor: Math.max(0, Math.round(proposal.limit_minor)),
      confidence: Math.max(0, Math.min(100, proposal.confidence || 50)),
    }))

    // Calculate total allocated
    const totalAllocated = validProposals.reduce((sum, p) => sum + p.limit_minor, 0)

    // Log the interaction
    await supabase
      .from('ai_logs')
      .insert({
        user_id: userId,
        kind: 'auto_budget',
        prompt_hash: await hashString(systemPrompt),
        prompt_redacted: redactPII(systemPrompt),
        response_redacted: redactPII(JSON.stringify(validProposals)),
        token_usage: {
          prompt_tokens: completion.usage?.prompt_tokens || 0,
          completion_tokens: completion.usage?.completion_tokens || 0,
          total_tokens: completion.usage?.total_tokens || 0,
        }
      })

    return {
      proposals: validProposals,
      total_allocated: totalAllocated,
      total_income: Math.round(monthlyIncome),
      period_year: periodYear,
      period_month: periodMonth,
      methodology: options.zeroBased
        ? 'Zero-based budgeting with historical spending analysis'
        : 'Category-based budgeting with savings rate optimization'
    }
  } catch (error) {
    console.error('Auto-budget generation error:', error)
    throw error
  }
}

// Simple hash function for prompt caching
async function hashString(str: string): Promise<string> {
  // Simple hash implementation for Node.js environment
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).substring(0, 16)
}

// PII redaction for logging
function redactPII(text: string): string {
  return text
    .replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '[CARD_NUMBER]')
    .replace(/\b\d{10,}\b/g, '[ACCOUNT_NUMBER]')
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
}
