import { NextResponse } from "next/server"
import { releaseExpiredHoldBookings } from "@/lib/db/booking-manager"

export async function GET() {
  try {
    const result = await releaseExpiredHoldBookings()
    return NextResponse.json({
      success: true,
      message: `Released ${result.releasedCount} expired hold bookings.`,
      releasedCount: result.releasedCount,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Cron execution error: ${error.message}` },
      { status: 500 }
    )
  }
}
