export interface SabreCredentials {
  pcc: string
  clientId: string
  clientSecret: string
  domain: string
  environment: "sandbox" | "production"
  conversationId: string
  enabled: boolean
  status: "connected" | "error" | "untested"
  lastTested?: string | null
  lastError?: string | null
  tokenExpiresAt?: string | null
}

export interface SabreAuthResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export interface FlightSegment {
  flightNumber: string
  airline: string
  airlineCode: string
  origin: string
  originName: string
  destination: string
  destinationName: string
  departureTime: string
  arrivalTime: string
  duration: string
  aircraft: string
  cabinClass: string
}

export interface FlightOffer {
  id: string
  airline: string
  airlineCode: string
  airlineLogo?: string
  flightNumber: string
  origin: {
    code: string
    name: string
    city: string
    terminal?: string
  }
  destination: {
    code: string
    name: string
    city: string
    terminal?: string
  }
  departureTime: string
  departureDate: string
  arrivalTime: string
  arrivalDate: string
  duration: string
  durationMinutes: number
  stops: number
  stopDetails: string
  aircraft: string
  cabinClass: string
  bookingClass: string
  seatsAvailable: number
  refundable: boolean
  refundableType: "Refundable" | "Partially Refundable" | "Non-Refundable"
  baggage: string
  cabinBaggage: string
  price: number
  basePrice: number
  taxesAndFees: number
  currency: string
  source: "sabre" | "musafirx_gds"
  sabreItineraryId?: string
  segments?: FlightSegment[]
}

export interface FlightSearchParams {
  originCode: string
  destinationCode: string
  departureDate: string
  returnDate?: string
  tripType: "one-way" | "round-trip" | "multi-city"
  passengers: {
    adults: number
    children: number
    infants: number
  }
  cabinClass: "Economy" | "Premium Economy" | "Business" | "First"
  allowDemoFallback?: boolean
}
