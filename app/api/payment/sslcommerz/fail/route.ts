import { NextRequest, NextResponse } from "next/server"
import { updateBookingStatus } from "@/lib/db/booking-manager"

export async function POST(req: NextRequest) {
  const url = new URL(req.url)
  const ref = url.searchParams.get("ref") || "unknown"

  try {
    await updateBookingStatus(ref, "PENDING", {
      "paymentTransaction.status": "FAILED",
    })
  } catch {}

  const targetUrl = new URL(`/flight/booking/confirmation`, req.url)
  targetUrl.searchParams.set("ref", ref)
  targetUrl.searchParams.set("status", "failed")
  return NextResponse.redirect(targetUrl, 303)
}
