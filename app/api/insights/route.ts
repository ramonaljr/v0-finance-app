import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Query insights for current user
    const { data: insights, error } = await supabase
      .from('insights')
      .select('*')
      .eq('user_id', user.id)
      .is('dismissed_at', null)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error fetching insights:', error)
      return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 })
    }

    return NextResponse.json({ 
      items: insights || [],
      count: insights?.length || 0
    })
  } catch (error) {
    console.error('Insights GET error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


