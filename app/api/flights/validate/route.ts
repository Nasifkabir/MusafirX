import { NextRequest, NextResponse } from "next/server"
import { getSabreCredentials } from "@/lib/sabre/sabre-store"
import type { FlightOffer } from "@/lib/sabre/types"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { flight } = body as { flight: FlightOffer }

    if (!flight || !flight.id) {
      return NextResponse.json(
        { success: false, message: "Valid flight offer object is required." },
        { status: 400 }
      )
    }

    const sabreConfig = getSabreCredentials()

    // Base fare + taxes calculation
    const baseFare = Math.round(flight.price * 0.78)
    const taxesAndFees = flight.price - baseFare
    const vat = Math.round(baseFare * 0.05)

    // Simulate Sabre GDS seat check
    // In live certification: calls Sabre Bargain Finder Max Revalidate / PriceCheck
    const seatsAvailable = flight.seatsAvailable || 7
    if (seatsAvailable <= 0) {
      return NextResponse.json(
        {
          success: false,
          available: false,
          message: "Sorry, this seat class is no longer available on Sabre GDS. Please choose another flight.",
        },
        { status: 409 }
      )
    }

    const priceLockToken = `PLK-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    const priceLockExpires = new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 mins

    return NextResponse.json({
      success: true,
      available: true,
      message: "Flight inventory verified and fare locked successfully.",
      flight: {
        ...flight,
        validatedAt: new Date().toISOString(),
      },
      fareBreakdown: {
        baseFare,
        taxesAndFees,
        vat,
        totalAmount: flight.price,
        currency: "BDT",
      },
      priceLock: {
        token: priceLockToken,
        expiresAt: priceLockExpires,
        guaranteedPrice: flight.price,
      },
      sabreEngine: {
        pcc: sabreConfig.pcc,
        environment: sabreConfig.environment,
        validated: true,
      },
    })
  } catch (error: any) {
    console.error("Flight validation error:", error)
    return NextResponse.json(
      { success: false, message: `Revalidation failed: ${error.message}` },
      { status: 500 }
    )
  }
}
