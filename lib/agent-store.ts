import { Store } from "pullstate"

export interface Booking {
  id: string
  reference: string
  customerName: string
  customerEmail: string
  flightNumber: string
  airline: string
  route: string
  departureDate: string
  passengers: number
  amount: number
  commission: number
  status: "confirmed" | "pending" | "cancelled"
  createdAt: string
}

export interface AgentStats {
  totalBookings: number
  totalRevenue: number
  totalCommission: number
  pendingBookings: number
}

interface AgentState {
  bookings: Booking[]
  stats: AgentStats
}

// Mock data for demonstration
const mockBookings: Booking[] = [
  {
    id: "1",
    reference: "SKY12345678",
    customerName: "Rajesh Kumar",
    customerEmail: "rajesh@example.com",
    flightNumber: "AI 101",
    airline: "Air India",
    route: "DEL → BOM",
    departureDate: "2025-01-15",
    passengers: 2,
    amount: 15680,
    commission: 1568,
    status: "confirmed",
    createdAt: "2025-01-05T10:30:00Z",
  },
  {
    id: "2",
    reference: "SKY12345679",
    customerName: "Priya Sharma",
    customerEmail: "priya@example.com",
    flightNumber: "6E 202",
    airline: "IndiGo",
    route: "BLR → HYD",
    departureDate: "2025-01-18",
    passengers: 1,
    amount: 4500,
    commission: 450,
    status: "confirmed",
    createdAt: "2025-01-06T14:20:00Z",
  },
  {
    id: "3",
    reference: "SKY12345680",
    customerName: "Amit Patel",
    customerEmail: "amit@example.com",
    flightNumber: "SG 303",
    airline: "SpiceJet",
    route: "MAA → CCU",
    departureDate: "2025-01-20",
    passengers: 3,
    amount: 22500,
    commission: 2250,
    status: "pending",
    createdAt: "2025-01-07T09:15:00Z",
  },
  {
    id: "4",
    reference: "SKY12345681",
    customerName: "Sneha Reddy",
    customerEmail: "sneha@example.com",
    flightNumber: "UK 404",
    airline: "Vistara",
    route: "DEL → GOI",
    departureDate: "2025-01-22",
    passengers: 2,
    amount: 18900,
    commission: 1890,
    status: "confirmed",
    createdAt: "2025-01-08T11:45:00Z",
  },
  {
    id: "5",
    reference: "SKY12345682",
    customerName: "Vikram Singh",
    customerEmail: "vikram@example.com",
    flightNumber: "AI 505",
    airline: "Air India",
    route: "BOM → DXB",
    departureDate: "2025-01-25",
    passengers: 1,
    amount: 32000,
    commission: 3200,
    status: "confirmed",
    createdAt: "2025-01-09T16:30:00Z",
  },
]

const calculateStats = (bookings: Booking[]): AgentStats => {
  return {
    totalBookings: bookings.length,
    totalRevenue: bookings.reduce((sum, b) => sum + b.amount, 0),
    totalCommission: bookings.reduce((sum, b) => sum + b.commission, 0),
    pendingBookings: bookings.filter((b) => b.status === "pending").length,
  }
}

export const AgentStore = new Store<AgentState>({
  bookings: mockBookings,
  stats: calculateStats(mockBookings),
})
