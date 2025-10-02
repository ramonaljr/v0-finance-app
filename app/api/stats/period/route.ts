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
    const period_year = parseInt(yearStr, 10)
    const period_month = parseInt(monthStr, 10)

    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Query kpi_cache for this period
    const { data: kpiData, error } = await supabase
      .from('kpi_cache')
      .select('*')
      .eq('user_id', user.id)
      .eq('period_year', period_year)
      .eq('period_month', period_month)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching KPI data:', error)
      return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
    }

    // Return cached data or zeros if not found
    return NextResponse.json({
      ym,
      income_minor: kpiData?.income_minor || 0,
      expense_minor: kpiData?.expense_minor || 0,
      net_minor: kpiData?.net_minor || 0,
      top_cats: kpiData?.top_cats || [],
      updated_at: kpiData?.updated_at || null,
    })
  } catch (error) {
    console.error('Stats period error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


