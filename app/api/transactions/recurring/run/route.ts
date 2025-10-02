import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"
import { runRecurringEngine } from "@/lib/recurring/engine"

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const supabase = createServiceClient()

    // Run recurring transactions engine
    const results = await runRecurringEngine(supabase)

    // Trigger cache refresh if transactions were created
    if (results.created > 0) {
      try {
        await supabase.functions.invoke('refresh-caches')
      } catch (refreshError) {
        console.error('Cache refresh failed:', refreshError)
        // Don't fail if cache refresh fails
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.processed,
      created: results.created,
      errors: results.errors,
    })
  } catch (error) {
    console.error('Recurring transactions run error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


