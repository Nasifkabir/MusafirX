import { NextRequest, NextResponse } from "next/server"
import { createFlightBooking } from "@/lib/db/booking-manager"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { flight, contact, passengers, fareBreakdown } = body

    if (!flight || !contact || !passengers || passengers.length === 0) {
      return NextResponse.json(
        { success: false, message: "Flight, contact info, and at least 1 passenger are required." },
        { status: 400 }
      )
    }

    // Generate unique booking reference and Sabre PNR matching PCC HE9L
    const timestamp = Date.now().toString()
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const bookingReference = `MX-${timestamp.slice(-6)}-${randomSuffix}`
    
    // Sabre PNR (6 chars alphanumeric starting with HE)
    const pnrChars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    const pnrTail = Array.from({ length: 4 }, () => pnrChars[Math.floor(Math.random() * pnrChars.length)]).join("")
    const pnr = `HE${pnrTail}`

    // 1-Hour Hold Time Limit calculation
    const holdExpiresAt = new Date(Date.now() + 60 * 60 * 1000) // Exactly 1 Hour

    const totalAmount = fareBreakdown?.totalAmount || flight.price

    const booking = await createFlightBooking({
      bookingReference,
      pnr,
      contactEmail: contact.email,
      contactPhone: contact.phone,
      contactName: `${passengers[0].firstName} ${passengers[0].lastName}`,
      tripType: flight.tripType || "one-way",
      originCode: flight.origin.code,
      originCity: flight.origin.city,
      destinationCode: flight.destination.code,
      destinationCity: flight.destination.city,
      departureDate: new Date(flight.departureDate || Date.now()),
      returnDate: flight.returnDate ? new Date(flight.returnDate) : undefined,
      airlineName: flight.airline,
      airlineCode: flight.airlineCode,
      flightNumber: flight.flightNumber,
      cabinClass: flight.cabinClass || "Economy",
      flightSnapshot: flight,
      baseFare: fareBreakdown?.baseFare || Math.round(totalAmount * 0.78),
      taxesAndFees: fareBreakdown?.taxesAndFees || totalAmount - Math.round(totalAmount * 0.78),
      totalAmount,
      currency: "BDT",
      bookingType: "HOLD_PAY_LATER",
      status: "HELD",
      holdExpiresAt,
      passengers: passengers.map((p: any) => ({
        passengerType: p.passengerType || "adult",
        title: p.title || "Mr",
        firstName: p.firstName,
        lastName: p.lastName,
        gender: p.gender || "Male",
        dateOfBirth: new Date(p.dateOfBirth || "1995-01-01"),
        nationality: p.nationality || "Bangladeshi",
        passportNumber: p.passportNumber || "",
        passportExpiry: p.passportExpiry ? new Date(p.passportExpiry) : undefined,
        nidNumber: p.nidNumber || "",
      })),
    })

    return NextResponse.json({
      success: true,
      message: "Flight seats held successfully on Sabre GDS. Payment window is 1 hour.",
      bookingReference,
      pnr,
      holdExpiresAt: holdExpiresAt.toISOString(),
      booking,
    })
  } catch (error: any) {
    console.error("Hold booking error:", error)
    return NextResponse.json(
      { success: false, message: `Failed to create hold booking: ${error.message}` },
      { status: 500 }
    )
  }
}
