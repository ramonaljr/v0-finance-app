import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

    if (authError || !authUser) {
      console.error('[API /user] Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[API /user] Authenticated user:', authUser.id, authUser.email)

    // Try to get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle()  // Use maybeSingle instead of single to avoid error on no rows

    console.log('[API /user] Query result:', { user, error })

    // If user doesn't exist, create it
    if (!user && !error) {
      console.log('[API /user] User not found, creating new record')
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          email: authUser.email,
          currency_code: 'USD',
          country: null,
          ai_consent_at: null
        })
        .select()
        .single()

      if (createError) {
        console.error('[API /user] Failed to create user:', createError)
        return NextResponse.json({
          error: 'Failed to create user record',
          details: createError.message,
          code: createError.code
        }, { status: 500 })
      }

      console.log('[API /user] User created successfully')
      return NextResponse.json({ user: { ...newUser, email: authUser.email } })
    }

    // If error occurred during query, return it
    if (error) {
      console.error('[API /user] Database error:', error)
      return NextResponse.json({
        error: error.message,
        code: error.code,
        details: error.details
      }, { status: 500 })
    }

    console.log('[API /user] Returning existing user')
    return NextResponse.json({ user: { ...user, email: authUser.email } })
  } catch (err: any) {
    console.error('[API /user] Unexpected error:', err)
    return NextResponse.json({
      error: 'Internal server error',
      message: err.message
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const supabase = await createClient()

  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

  if (authError || !authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { currency_code, country, ai_consent_at } = body

  const { data: user, error } = await supabase
    .from('users')
    .update({ currency_code, country, ai_consent_at })
    .eq('id', authUser.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ user: { ...user, email: authUser.email } })
}
