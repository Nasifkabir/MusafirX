import { Store } from "pullstate"

export interface VisaService {
  id: string
  country: string
  visaType: string
  processingTime: string
  price: number
  validity: string
  requirements: string[]
  image: string
  popular?: boolean
}

const mockVisaServices: VisaService[] = [
  {
    id: "1",
    country: "United States",
    visaType: "Tourist Visa (B1/B2)",
    processingTime: "15-20 Days",
    price: 18000,
    validity: "10 Years",
    requirements: ["Valid Passport", "Photographs", "Bank Statements", "Travel Itinerary"],
    image: "query=usa statue of liberty",
    popular: true,
  },
  {
    id: "2",
    country: "United Kingdom",
    visaType: "Standard Visitor Visa",
    processingTime: "10-15 Days",
    price: 15000,
    validity: "6 Months",
    requirements: ["Valid Passport", "Photographs", "Financial Proof", "Accommodation Details"],
    image: "query=london big ben",
    popular: true,
  },
  {
    id: "3",
    country: "Schengen (Europe)",
    visaType: "Tourist Visa",
    processingTime: "12-18 Days",
    price: 12000,
    validity: "90 Days",
    requirements: ["Valid Passport", "Travel Insurance", "Hotel Bookings", "Flight Tickets"],
    image: "query=eiffel tower paris",
    popular: true,
  },
  {
    id: "4",
    country: "Dubai (UAE)",
    visaType: "Tourist Visa",
    processingTime: "3-5 Days",
    price: 8000,
    validity: "30 Days",
    requirements: ["Valid Passport", "Photographs", "Return Tickets"],
    image: "query=dubai burj khalifa",
    popular: true,
  },
  {
    id: "5",
    country: "Singapore",
    visaType: "Tourist Visa",
    processingTime: "5-7 Days",
    price: 6500,
    validity: "30 Days",
    requirements: ["Valid Passport", "Photographs", "Financial Proof", "Travel Plan"],
    image: "query=singapore marina bay",
  },
  {
    id: "6",
    country: "Australia",
    visaType: "Visitor Visa (600)",
    processingTime: "20-25 Days",
    price: 16000,
    validity: "12 Months",
    requirements: ["Valid Passport", "Health Insurance", "Financial Documents", "Purpose of Visit"],
    image: "query=sydney opera house",
  },
]

interface VisaState {
  services: VisaService[]
}

export const VisaStore = new Store<VisaState>({
  services: mockVisaServices,
})
