import fs from "fs"
import path from "path"

export interface Passenger {
  title: "Mr" | "Mrs" | "Ms" | "Mstr"
  firstName: string
  lastName: string
  gender: "Male" | "Female" | "Other"
  dob: string
  passportNumber?: string
  passportExpiry?: string
  nidNumber?: string
  nationality: string
}

export interface BookingRecord {
  id: string
  pnr: string
  flightId: string
  airline: string
  airlineCode: string
  flightNumber: string
  originCode: string
  originCity: string
  destinationCode: string
  destinationCity: string
  departureDate: string
  departureTime: string
  arrivalDate: string
  arrivalTime: string
  duration: string
  cabinClass: string
  passengers: Passenger[]
  contactEmail: string
  contactPhone: string
  totalAmount: number
  currency: string
  status: "confirmed" | "ticketed" | "cancelled" | "pending"
  source: "sabre" | "musafirx_gds"
  createdAt: string
  eTicketNumber?: string
}

const BOOKINGS_FILE = path.join(process.cwd(), "data", "bookings.json")

const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: "bk-1001",
    pnr: "MX-SB7829",
    flightId: "MX-2A-101",
    airline: "Air Astra",
    airlineCode: "2A",
    flightNumber: "2A-455",
    originCode: "DAC",
    originCity: "Dhaka",
    destinationCode: "CXB",
    destinationCity: "Cox's Bazar",
    departureDate: "2026-11-06",
    departureTime: "19:50",
    arrivalDate: "2026-11-06",
    arrivalTime: "20:55",
    duration: "1 hour 5 minutes",
    cabinClass: "Economy",
    passengers: [
      {
        title: "Mr",
        firstName: "Tariq",
        lastName: "Mahmud",
        gender: "Male",
        dob: "1992-04-15",
        nationality: "Bangladeshi",
        nidNumber: "19922692019000124",
      },
    ],
    contactEmail: "tariq@example.com",
    contactPhone: "+880 1712 345678",
    totalAmount: 4578,
    currency: "BDT",
    status: "ticketed",
    source: "sabre",
    createdAt: "2026-10-30T10:15:00Z",
    eTicketNumber: "774-2490182741",
  },
  {
    id: "bk-1002",
    pnr: "MX-SB9410",
    flightId: "MX-BS-102",
    airline: "US Bangla Airlines",
    airlineCode: "BS",
    flightNumber: "BS-157",
    originCode: "DAC",
    originCity: "Dhaka",
    destinationCode: "CXB",
    destinationCity: "Cox's Bazar",
    departureDate: "2026-11-06",
    departureTime: "18:30",
    arrivalDate: "2026-11-06",
    arrivalTime: "19:35",
    duration: "1 hour 5 minutes",
    cabinClass: "Economy",
    passengers: [
      {
        title: "Mrs",
        firstName: "Farzana",
        lastName: "Akter",
        gender: "Female",
        dob: "1995-08-20",
        nationality: "Bangladeshi",
        nidNumber: "19952692019000889",
      },
    ],
    contactEmail: "farzana@example.com",
    contactPhone: "+880 1819 876543",
    totalAmount: 4583,
    currency: "BDT",
    status: "confirmed",
    source: "musafirx_gds",
    createdAt: "2026-10-30T14:22:00Z",
    eTicketNumber: "779-1192840192",
  },
]

export function getBookings(): BookingRecord[] {
  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      const data = fs.readFileSync(BOOKINGS_FILE, "utf-8")
      return JSON.parse(data)
    }
  } catch (e) {
    console.error("Error reading bookings:", e)
  }
  saveBookings(INITIAL_BOOKINGS)
  return INITIAL_BOOKINGS
}

export function saveBookings(bookings: BookingRecord[]): void {
  try {
    const dir = path.dirname(BOOKINGS_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf-8")
  } catch (e) {
    console.error("Error saving bookings:", e)
  }
}
