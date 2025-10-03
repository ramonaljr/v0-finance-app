import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/server"
import { materializeKpiCacheForUser } from "@/lib/cache/materialize-kpi"
import { materializeCalendarCacheForUser } from "@/lib/cache/materialize-calendar"

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body for optional parameters
    const body = await request.json().catch(() => ({}))
    const periods = body.periods // Optional: specific periods to refresh

    // Use service client for cache operations (bypasses RLS)
    const serviceClient = createServiceClient()

    // Materialize KPI cache for the user
    const kpiResults = await materializeKpiCacheForUser(
      serviceClient,
      user.id,
      periods
    )

    // Materialize calendar cache for the user
    const calendarResults = await materializeCalendarCacheForUser(
      serviceClient,
      user.id,
      periods
    )

    return NextResponse.json({
      success: true,
      message: "Caches refreshed successfully",
      kpi_periods: kpiResults.length,
      calendar_periods: calendarResults.length,
      kpi_results: kpiResults,
      calendar_results: calendarResults
    })
  } catch (error) {
    console.error('Cache refresh error:', error)
    return NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
