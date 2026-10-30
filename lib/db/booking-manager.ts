import { connectToDatabase } from "./mongodb"
import { FlightBooking, IFlightBooking, IPassenger, IPaymentTransaction } from "./models/FlightBooking"
import fs from "fs"
import path from "path"

const FALLBACK_FILE = path.join(process.cwd(), "data", "bookings.json")

function getFallbackBookings(): any[] {
  try {
    if (fs.existsSync(FALLBACK_FILE)) {
      return JSON.parse(fs.readFileSync(FALLBACK_FILE, "utf-8"))
    }
  } catch {}
  return []
}

function saveFallbackBookings(bookings: any[]) {
  try {
    const dir = path.dirname(FALLBACK_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(bookings, null, 2), "utf-8")
  } catch (e) {
    console.error("Error saving fallback bookings:", e)
  }
}

export async function createFlightBooking(data: {
  bookingReference: string
  pnr?: string
  contactEmail: string
  contactPhone: string
  contactName: string
  tripType: "one-way" | "round-trip" | "multi-city"
  originCode: string
  originCity: string
  destinationCode: string
  destinationCity: string
  departureDate: Date
  returnDate?: Date
  airlineName: string
  airlineCode: string
  flightNumber: string
  cabinClass: string
  flightSnapshot: any
  baseFare: number
  taxesAndFees: number
  totalAmount: number
  currency: string
  bookingType: "HOLD_PAY_LATER" | "INSTANT_PAY"
  status?: "PENDING" | "HELD" | "TICKETED" | "EXPIRED" | "CANCELLED"
  holdExpiresAt?: Date
  passengers: IPassenger[]
  paymentTransaction?: IPaymentTransaction
}) {
  try {
    const db = await connectToDatabase()
    if (db) {
      const doc = new FlightBooking(data)
      const saved = await doc.save()
      return saved.toObject()
    }
  } catch (err) {
    console.warn("[MongoDB] Using fallback storage for booking:", err)
  }

  // Fallback to local storage if MongoDB daemon is offline during testing
  const fallbackList = getFallbackBookings()
  const fallbackRecord = {
    ...data,
    id: `bk-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  fallbackList.unshift(fallbackRecord)
  saveFallbackBookings(fallbackList)
  return fallbackRecord
}

export async function getBookingByReference(ref: string) {
  try {
    const db = await connectToDatabase()
    if (db) {
      const booking = await FlightBooking.findOne({
        $or: [{ bookingReference: ref }, { pnr: ref }],
      }).lean()
      if (booking) return booking
    }
  } catch (err) {
    console.warn("[MongoDB] Fallback for getBookingByReference:", err)
  }

  const fallbackList = getFallbackBookings()
  return (
    fallbackList.find(
      (b: any) =>
        b.bookingReference?.toLowerCase() === ref.toLowerCase() ||
        b.pnr?.toLowerCase() === ref.toLowerCase()
    ) || null
  )
}

export async function getAllBookings(filter?: { status?: string; email?: string }) {
  try {
    const db = await connectToDatabase()
    if (db) {
      const query: any = {}
      if (filter?.status) query.status = filter.status
      if (filter?.email) query.contactEmail = filter.email.toLowerCase()
      return await FlightBooking.find(query).sort({ createdAt: -1 }).lean()
    }
  } catch (err) {
    console.warn("[MongoDB] Fallback for getAllBookings:", err)
  }

  let list = getFallbackBookings()
  if (filter?.status) list = list.filter((b: any) => b.status === filter.status)
  if (filter?.email) list = list.filter((b: any) => b.contactEmail?.toLowerCase() === filter.email?.toLowerCase())
  return list
}

export async function updateBookingStatus(
  ref: string,
  status: "PENDING" | "HELD" | "TICKETED" | "EXPIRED" | "CANCELLED",
  updates?: Record<string, any>
) {
  try {
    const db = await connectToDatabase()
    if (db) {
      const updated = await FlightBooking.findOneAndUpdate(
        { $or: [{ bookingReference: ref }, { pnr: ref }] },
        { $set: { status, updatedAt: new Date(), ...(updates || {}) } },
        { new: true }
      ).lean()
      if (updated) return updated
    }
  } catch (err) {
    console.warn("[MongoDB] Fallback for updateBookingStatus:", err)
  }

  const list = getFallbackBookings()
  const idx = list.findIndex(
    (b: any) =>
      b.bookingReference?.toLowerCase() === ref.toLowerCase() ||
      b.pnr?.toLowerCase() === ref.toLowerCase()
  )
  if (idx !== -1) {
    list[idx] = {
      ...list[idx],
      status,
      updatedAt: new Date().toISOString(),
      ...(updates || {}),
    }
    saveFallbackBookings(list)
    return list[idx]
  }
  return null
}

export async function releaseExpiredHoldBookings() {
  const now = new Date()
  let releasedCount = 0

  try {
    const db = await connectToDatabase()
    if (db) {
      const result = await FlightBooking.updateMany(
        {
          status: "HELD",
          holdExpiresAt: { $lte: now },
        },
        {
          $set: { status: "EXPIRED", updatedAt: now },
        }
      )
      releasedCount = result.modifiedCount || 0
      return { releasedCount }
    }
  } catch (err) {
    console.warn("[MongoDB] Fallback for releaseExpiredHoldBookings:", err)
  }

  const list = getFallbackBookings()
  list.forEach((b: any) => {
    if (b.status === "HELD" && b.holdExpiresAt && new Date(b.holdExpiresAt) <= now) {
      b.status = "EXPIRED"
      b.updatedAt = now.toISOString()
      releasedCount++
    }
  })
  if (releasedCount > 0) saveFallbackBookings(list)
  return { releasedCount }
}
