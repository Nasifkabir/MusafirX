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

export interface Flight {
  id: string
  airline: string
  flightNumber: string
  origin: Airport
  destination: Airport
  departureTime: string
  arrivalTime: string
  duration: string
  price: number
  stops: number
  aircraft: string
}

interface AppState {
  searchData: FlightSearchData
  searchResults: Flight[]
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
})
