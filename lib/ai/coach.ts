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

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface CoachResponse {
  message: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
    cost_usd: number
  }
}

export async function generateCoachResponse(
  userId: string,
  messages: ChatMessage[],
  options: {
    maxTokens?: number
    temperature?: number
    model?: string
  } = {}
): Promise<CoachResponse> {
  try {
    const supabase = createServiceClient()

    // Get user's financial summary for context
    const since = new Date()
    since.setDate(since.getDate() - 90) // Last 90 days

    const ledgerSummary = await selectLedgerSummary(userId, since)

    // Check if user has consented to AI usage
    const { data: consentData } = await supabase
      .from('users')
      .select('ai_consent_at')
      .eq('id', userId)
      .single()

    // Create system prompt with user's financial context
    const systemPrompt = `You are an AI Financial Coach for a personal finance app. Provide practical, empathetic, and actionable guidance grounded in the user's summarized ledger and goals.

Financial Context (last 90 days):
- Total Income: $${(ledgerSummary.months.reduce((sum, m) => sum + m.income_minor, 0) / 100).toFixed(2)}
- Total Expenses: $${(ledgerSummary.months.reduce((sum, m) => sum + m.expense_minor, 0) / 100).toFixed(2)}
- Net Cash Flow: $${(ledgerSummary.months.reduce((sum, m) => sum + m.net_minor, 0) / 100).toFixed(2)}
- Top Spending Categories: ${ledgerSummary.topCategories.slice(0, 3).map(c => `${c.name || 'Uncategorized'}: $${(c.amount_minor / 100).toFixed(2)}`).join(', ')}

Guardrails:
- Respect cost limits and input truncation windows (last 90 days unless asked)
- Do not execute any financial transactions; suggest next steps only
- Explain how you derived insights from aggregates
- Keep responses under ${options.maxTokens || 500} tokens
- Be conversational but professional
- If asked about sensitive financial actions, redirect to human advisor`

    // Prepare messages for OpenAI
    const openaiMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.slice(-10) // Keep last 10 messages for context
    ]

    // Estimate token count (rough approximation)
    const estimatedTokens = JSON.stringify(openaiMessages).length / 4

    // Cost guardrail: reject if too expensive
    const maxEstimatedCost = 0.10 // $0.10 max per request
    const estimatedCost = (estimatedTokens * 0.00015) + ((options.maxTokens || 500) * 0.0006)

    if (estimatedCost > maxEstimatedCost) {
      throw new Error(`Request too expensive (estimated $${estimatedCost.toFixed(3)}). Please ask a more specific question.`)
    }

    // Call OpenAI
    const openai = getOpenAIClient()
    if (!openai) {
      throw new Error('OpenAI API key not configured')
    }

    const completion = await openai.chat.completions.create({
      model: options.model || 'gpt-3.5-turbo',
      messages: openaiMessages,
      max_tokens: options.maxTokens || 500,
      temperature: options.temperature || 0.7,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from AI coach')
    }

    // Calculate actual cost
    const usage = completion.usage
    const cost_usd = usage
      ? (usage.prompt_tokens * 0.00015) + (usage.completion_tokens * 0.0006)
      : 0

    // Log the interaction (redacted)
    await supabase
      .from('ai_logs')
      .insert({
        user_id: userId,
        kind: 'coach_chat',
        prompt_hash: await hashString(JSON.stringify(openaiMessages)),
        prompt_redacted: redactPII(systemPrompt + '\n' + messages.map(m => m.content).join('\n')),
        response_redacted: redactPII(response),
        token_usage: {
          prompt_tokens: usage?.prompt_tokens || 0,
          completion_tokens: usage?.completion_tokens || 0,
          total_tokens: usage?.total_tokens || 0,
        }
      })

    return {
      message: response,
      usage: usage ? {
        prompt_tokens: usage.prompt_tokens,
        completion_tokens: usage.completion_tokens,
        total_tokens: usage.total_tokens,
        cost_usd,
      } : undefined,
    }
  } catch (error) {
    console.error('AI Coach error:', error)
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
  // Simple PII redaction - replace numbers that look like account numbers, etc.
  return text
    .replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '[CARD_NUMBER]')
    .replace(/\b\d{10,}\b/g, '[ACCOUNT_NUMBER]')
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
}
