import { Store } from "pullstate"

export interface Airport {
  code: string
  name: string
  city: string
  country: string
}

export interface PassengerCount {
  adults: number
  children: number
  infants: number
}

export interface FlightSearchData {
  flightType: "one-way" | "round-trip" | "multi-city"
  origin: Airport | null
  destination: Airport | null
  departureDate: Date | null
  returnDate: Date | null
  passengers: PassengerCount
}

import type { FlightOffer } from "./sabre/types"

export interface Flight {
  id: string
  airline: string
  airlineCode?: string
  flightNumber: string
  origin: Airport
  destination: Airport
  departureTime: string
  departureDate?: string
  arrivalTime: string
  arrivalDate?: string
  duration: string
  price: number
  stops: number
  aircraft: string
  baggage?: string
  refundableType?: string
  seatsAvailable?: number
  bookingClass?: string
  source?: "sabre" | "musafirx_gds"
}

interface AppState {
  searchData: FlightSearchData
  searchResults: FlightOffer[]
  selectedFlight: FlightOffer | null
}

export const FlightStore = new Store<AppState>({
  searchData: {
    flightType: "one-way",
    origin: null,
    destination: null,
    departureDate: null,
    returnDate: null,
    passengers: {
      adults: 1,
      children: 0,
      infants: 0,
    },
  },
  searchResults: [],
  selectedFlight: null,
})
