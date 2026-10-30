import { NextRequest, NextResponse } from "next/server"
import { getBookingByReference, updateBookingStatus } from "@/lib/db/booking-manager"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
  try {
    const { reference } = await params
    if (!reference) {
      return NextResponse.json({ success: false, message: "Reference required" }, { status: 400 })
    }

    const booking = await getBookingByReference(reference)
    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found with this Reference or PNR." },
        { status: 404 }
      )
    }

    // Check if Hold is expired
    let isExpired = false
    let secondsRemaining = 0

    if (booking.status === "HELD" && booking.holdExpiresAt) {
      const now = Date.now()
      const expiry = new Date(booking.holdExpiresAt).getTime()
      if (expiry <= now) {
        isExpired = true
        booking.status = "EXPIRED"
        await updateBookingStatus(reference, "EXPIRED")
      } else {
        secondsRemaining = Math.max(0, Math.floor((expiry - now) / 1000))
      }
    }

    return NextResponse.json({
      success: true,
      booking,
      isExpired,
      secondsRemaining,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Error fetching booking: ${error.message}` },
      { status: 500 }
    )
  }
}
