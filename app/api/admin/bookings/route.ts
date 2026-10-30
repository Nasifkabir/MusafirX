import { NextResponse } from "next/server"
import { getAllBookings, getBookingByReference, updateBookingStatus } from "@/lib/db/booking-manager"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const pnr = searchParams.get("pnr") || searchParams.get("ref")
    const status = searchParams.get("status")

    if (pnr) {
      const found = await getBookingByReference(pnr)
      if (!found) {
        return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 })
      }
      return NextResponse.json({ success: true, booking: found })
    }

    const filter: any = {}
    if (status && status !== "ALL") {
      filter.status = status.toUpperCase()
    }

    const bookings = await getAllBookings(filter)

    // Calculate live statistics
    const stats = {
      total: bookings.length,
      ticketed: bookings.filter((b: any) => b.status === "TICKETED").length,
      held: bookings.filter((b: any) => b.status === "HELD").length,
      expired: bookings.filter((b: any) => b.status === "EXPIRED").length,
      cancelled: bookings.filter((b: any) => b.status === "CANCELLED").length,
      totalRevenue: bookings
        .filter((b: any) => b.status === "TICKETED")
        .reduce((sum: number, b: any) => sum + (Number(b.totalAmount) || 0), 0),
    }

    return NextResponse.json({
      success: true,
      bookings,
      stats,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { reference, status, updates } = body

    if (!reference || !status) {
      return NextResponse.json(
        { success: false, message: "Reference and target status are required" },
        { status: 400 }
      )
    }

    const updated = await updateBookingStatus(reference, status, updates)
    return NextResponse.json({
      success: true,
      booking: updated,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
