import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const ym = searchParams.get("ym")
    if (!ym || !/^\d{4}-\d{2}$/.test(ym)) {
      return NextResponse.json({ error: "Invalid ym; expected YYYY-MM" }, { status: 400 })
    }

    const [yearStr, monthStr] = ym.split("-")
    const y = parseInt(yearStr, 10)
    const m = parseInt(monthStr, 10)

    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Query calendar_cache for this month
    const { data: calendarData, error } = await supabase
      .from('calendar_cache')
      .select('*')
      .eq('user_id', user.id)
      .eq('y', y)
      .eq('m', m)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching calendar data:', error)
      return NextResponse.json({ error: "Failed to fetch calendar" }, { status: 500 })
    }

    // Return cached data or empty if not found
    const days = calendarData?.days || []
    const totals = days.reduce((acc: any, day: any) => ({
      income_minor: acc.income_minor + (day.income_minor || 0),
      expense_minor: acc.expense_minor + (day.expense_minor || 0),
      net_minor: acc.net_minor + (day.net_minor || 0),
    }), { income_minor: 0, expense_minor: 0, net_minor: 0 })

    return NextResponse.json({
      y,
      m,
      days,
      totals,
      updated_at: calendarData?.updated_at || null,
    })
  } catch (error) {
    console.error('Calendar stats error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


