import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Call the edge function to refresh caches for all users
    const { data, error } = await supabase.functions.invoke('refresh-caches')

    if (error) {
      console.error('Edge function error:', error)
      return NextResponse.json({ error: "Failed to refresh caches" }, { status: 500 })
    }

    // Find the result for the current user
    const userResult = data?.results?.find((r: any) => r.user_id === user.id)

    return NextResponse.json({
      success: true,
      message: "Caches refreshed successfully",
      user_result: userResult,
      all_results: data
    })
  } catch (error) {
    console.error('Cache refresh error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
