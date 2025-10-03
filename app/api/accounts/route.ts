import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { z } from "zod"

export const dynamic = 'force-dynamic'

const CreateAccountSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['checking', 'savings', 'credit', 'investment', 'cash']),
  currency_code: z.string().default('USD'),
  balance_minor: z.number().int().default(0),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = CreateAccountSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({
        error: "Invalid request body",
        details: validation.error.errors
      }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('accounts')
      .insert({
        ...validation.data,
        user_id: user.id
      })
      .select()
      .single()

    if (error) {
      console.error('Account creation error:', error)
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Account POST error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: accounts, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .order('name')

    if (error) {
      console.error('Error fetching accounts:', error)
      return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 })
    }

    return NextResponse.json({ accounts: accounts || [] })
  } catch (error) {
    console.error('Account GET error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
