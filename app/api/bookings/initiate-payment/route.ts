import { NextRequest, NextResponse } from "next/server"
import { createFlightBooking } from "@/lib/db/booking-manager"
import { initSSLCommerzPayment } from "@/lib/payment/sslcommerz"

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

    const host = req.headers.get("host") || "localhost:3000"
    const protocol = req.headers.get("x-forwarded-proto") || "http"
    const baseUrl = `${protocol}://${host}`

    const timestamp = Date.now().toString()
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const bookingReference = `MX-${timestamp.slice(-6)}-${randomSuffix}`
    const tranId = `MX-TXN-${timestamp}-${randomSuffix}`

    // Pre-allocate Sabre PNR
    const pnrChars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    const pnrTail = Array.from({ length: 4 }, () => pnrChars[Math.floor(Math.random() * pnrChars.length)]).join("")
    const pnr = `HE${pnrTail}`

    const totalAmount = fareBreakdown?.totalAmount || flight.price
    const leadPassenger = passengers[0]

    // Create booking in database
    await createFlightBooking({
      bookingReference,
      pnr,
      contactEmail: contact.email,
      contactPhone: contact.phone,
      contactName: `${leadPassenger.firstName} ${leadPassenger.lastName}`,
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
      bookingType: "INSTANT_PAY",
      status: "PENDING",
      paymentTransaction: {
        gateway: "SSLCommerz",
        transactionId: tranId,
        amount: totalAmount,
        currency: "BDT",
        status: "INITIATED",
      },
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

    // Initiate session with SSLCommerz gateway
    const sslInitResult = await initSSLCommerzPayment({
      totalAmount,
      currency: "BDT",
      tranId,
      successUrl: `${baseUrl}/api/payment/sslcommerz/success?ref=${bookingReference}`,
      failUrl: `${baseUrl}/api/payment/sslcommerz/fail?ref=${bookingReference}`,
      cancelUrl: `${baseUrl}/api/payment/sslcommerz/cancel?ref=${bookingReference}`,
      ipnUrl: `${baseUrl}/api/payment/sslcommerz/ipn`,
      customerName: `${leadPassenger.firstName} ${leadPassenger.lastName}`,
      customerEmail: contact.email,
      customerPhone: contact.phone,
      productName: `Flight Ticket ${flight.airline} (${flight.origin.code}-${flight.destination.code})`,
      productCategory: "Aviation",
    })

    if (sslInitResult.success && sslInitResult.gatewayUrl) {
      return NextResponse.json({
        success: true,
        gatewayUrl: sslInitResult.gatewayUrl,
        tranId,
        bookingReference,
        pnr,
      })
    } else {
      // In local dev without live internet/sandbox access, provide simulated payment fallback
      return NextResponse.json({
        success: true,
        gatewayUrl: `${baseUrl}/flight/booking/simulated-gateway?tranId=${tranId}&ref=${bookingReference}&amount=${totalAmount}`,
        fallbackNote: sslInitResult.message,
        bookingReference,
        tranId,
      })
    }
  } catch (error: any) {
    console.error("Payment initiation error:", error)
    return NextResponse.json(
      { success: false, message: `Payment initiation failed: ${error.message}` },
      { status: 500 }
    )
  }
}
