import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateCoachResponse, type ChatMessage } from "@/lib/ai/coach"
import { z } from "zod"

export const dynamic = 'force-dynamic'

const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
  })),
  options: z.object({
    maxTokens: z.number().optional(),
    temperature: z.number().optional(),
    model: z.string().optional(),
  }).optional(),
})

// POST /api/ai/coach
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)

    // Validate request body
    const validation = ChatRequestSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({
        error: "Invalid request body",
        details: validation.error.errors
      }, { status: 400 })
    }

    const { messages, options } = validation.data

    if (messages.length === 0) {
      return NextResponse.json({ error: "At least one message required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has consented to AI usage
    const { data: consentData } = await supabase
      .from('users')
      .select('ai_consent_at')
      .eq('id', user.id)
      .single()

    if (!consentData?.ai_consent_at) {
      return NextResponse.json({
        error: "AI consent required",
        requires_consent: true
      }, { status: 403 })
    }

    // Generate coach response
    const response = await generateCoachResponse(
      user.id,
      messages as ChatMessage[],
      options
    )

    return NextResponse.json({
      message: response.message,
      usage: response.usage,
    })
  } catch (error) {
    console.error('AI Coach API error:', error)

    if (error instanceof Error && error.message.includes('expensive')) {
      return NextResponse.json({
        error: error.message,
        code: 'TOO_EXPENSIVE'
      }, { status: 400 })
    }

    return NextResponse.json({
      error: "Failed to generate coach response",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}


