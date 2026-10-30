import { NextResponse } from "next/server"
import { getSabreCredentials } from "@/lib/sabre/sabre-store"
import { SabreClient } from "@/lib/sabre/sabre-client"
import type { FlightSearchParams } from "@/lib/sabre/types"
import { AIRPORTS } from "@/lib/airports"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const rawDate = String(body.departureDate || new Date().toISOString().split("T")[0])
    const cleanDate = rawDate.includes("T") ? rawDate.split("T")[0] : rawDate

    const params: FlightSearchParams = {
      originCode: body.originCode || "DAC",
      destinationCode: body.destinationCode || "CXB",
      departureDate: cleanDate,
      returnDate: body.returnDate,
      tripType: body.tripType || "one-way",
      passengers: {
        adults: body.passengers?.adults || 1,
        children: body.passengers?.children || 0,
        infants: body.passengers?.infants || 0,
      },
      cabinClass: body.cabinClass || "Economy",
      allowDemoFallback: Boolean(body.allowDemoFallback),
    }

    const credentials = getSabreCredentials()
    const client = new SabreClient(credentials)

    const { flights, source, sabreConfigured, sabreStatus, message, debugInfo } =
      await client.searchFlights(params)

    // Build airline summary pills
    const airlineMap: Record<
      string,
      { code: string; name: string; count: number; minPrice: number }
    > = {}

    flights.forEach((f) => {
      if (!airlineMap[f.airlineCode]) {
        airlineMap[f.airlineCode] = {
          code: f.airlineCode,
          name: f.airline,
          count: 0,
          minPrice: f.price,
        }
      }
      airlineMap[f.airlineCode].count += 1
      if (f.price < airlineMap[f.airlineCode].minPrice) {
        airlineMap[f.airlineCode].minPrice = f.price
      }
    })

    const origin = AIRPORTS.find((a) => a.code === params.originCode) || {
      code: params.originCode,
      name: "Airport",
      city: params.originCode,
    }

    const destination = AIRPORTS.find((a) => a.code === params.destinationCode) || {
      code: params.destinationCode,
      name: "Airport",
      city: params.destinationCode,
    }

    return NextResponse.json({
      success: true,
      origin,
      destination,
      departureDate: params.departureDate,
      tripType: params.tripType,
      passengers: params.passengers,
      cabinClass: params.cabinClass,
      flights,
      totalFound: flights.length,
      cheapestPrice: flights.length > 0 ? Math.min(...flights.map((f) => f.price)) : 0,
      fastestDuration: flights.length > 0 ? flights[0].duration : "1h 5m",
      airlineSummary: Object.values(airlineMap),
      source,
      sabreConfigured,
      sabreStatus,
      message,
      debugInfo,
    })
  } catch (error: any) {
    console.error("Flight search error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
