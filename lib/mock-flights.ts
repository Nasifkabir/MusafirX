import type { Flight, Airport } from "./store"

export function generateMockFlights(origin: Airport, destination: Airport, date: Date): Flight[] {
  const airlines = [
    { name: "Biman Bangladesh Airlines", code: "BG" },
    { name: "US-Bangla Airlines", code: "BS" },
    { name: "Novoair", code: "VQ" },
    { name: "Emirates", code: "EK" },
    { name: "Qatar Airways", code: "QR" },
    { name: "Singapore Airlines", code: "SQ" },
  ]

  const flights: Flight[] = []

  for (let i = 0; i < 6; i++) {
    const airline = airlines[i % airlines.length]
    const departureHour = 6 + i * 3
    const duration = 2 + Math.floor(Math.random() * 4)
    const arrivalHour = (departureHour + duration) % 24
    const stops = Math.random() > 0.6 ? 1 : 0
    const basePrice = 5000 + Math.floor(Math.random() * 15000)

    flights.push({
      id: `FL${1000 + i}`,
      airline: airline.name,
      flightNumber: `${airline.code}${100 + i}`,
      origin,
      destination,
      departureTime: `${departureHour.toString().padStart(2, "0")}:${((i * 15) % 60).toString().padStart(2, "0")}`,
      arrivalTime: `${arrivalHour.toString().padStart(2, "0")}:${((i * 15 + 30) % 60).toString().padStart(2, "0")}`,
      duration: `${duration}h ${Math.floor(Math.random() * 60)}m`,
      price: basePrice,
      stops,
      aircraft: stops === 0 ? "Boeing 737" : "Airbus A320",
    })
  }

  return flights.sort((a, b) => a.price - b.price)
}
