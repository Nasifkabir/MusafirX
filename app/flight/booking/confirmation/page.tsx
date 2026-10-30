"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import {
  CheckCircle2,
  Clock,
  Plane,
  AlertTriangle,
  Download,
  CreditCard,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  Users,
  Luggage,
  Calendar,
  Lock,
  ArrowRight,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AirlineLogo } from "@/components/airline-logo"

function ConfirmationInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const ref = searchParams.get("ref") || ""
  const paymentStatus = searchParams.get("status")

  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0)
  const [copied, setCopied] = useState(false)
  const [payingNow, setPayingNow] = useState(false)

  // Fetch Booking details
  useEffect(() => {
    if (!ref) {
      setError("No booking reference provided.")
      setLoading(false)
      return
    }

    async function loadBooking() {
      try {
        const res = await fetch(`/api/bookings/${encodeURIComponent(ref)}`)
        const data = await res.json()

        if (data.success && data.booking) {
          setBooking(data.booking)
          if (data.secondsRemaining) {
            setSecondsRemaining(data.secondsRemaining)
          }
        } else {
          setError(data.message || "Could not retrieve booking.")
        }
      } catch (err: any) {
        setError(`Failed to load booking: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    loadBooking()
  }, [ref])

  // Live Countdown Timer for Held Bookings
  useEffect(() => {
    if (secondsRemaining <= 0) return

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // Refresh booking status to expired
          if (booking && booking.status === "HELD") {
            setBooking((b: any) => ({ ...b, status: "EXPIRED" }))
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [secondsRemaining, booking])

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60)
    const secs = totalSec % 60
    return `${mins.toString().padStart(2, "0")}m : ${secs.toString().padStart(2, "0")}s`
  }

  const handleCopyPNR = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Handle Pay Now from Hold Voucher
  const handlePayNow = async () => {
    if (!booking) return
    setPayingNow(true)

    try {
      const res = await fetch("/api/bookings/initiate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flight: booking.flightSnapshot,
          contact: { email: booking.contactEmail, phone: booking.contactPhone },
          passengers: booking.passengers,
          fareBreakdown: {
            baseFare: booking.baseFare,
            taxesAndFees: booking.taxesAndFees,
            totalAmount: booking.totalAmount,
            currency: "BDT",
          },
        }),
      })

      const data = await res.json()
      if (data.success && data.gatewayUrl) {
        window.location.href = data.gatewayUrl
      } else {
        alert("Payment initialization error. Please try again.")
        setPayingNow(false)
      }
    } catch {
      alert("Network error connecting to payment gateway.")
      setPayingNow(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="size-8 text-primary animate-spin" />
        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
          Retrieving Sabre PNR & Booking Records...
        </p>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <Card className="max-w-md p-8 rounded-3xl bg-white text-center space-y-4 border border-neutral-200">
          <AlertTriangle className="size-10 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold">Booking Not Found</h2>
          <p className="text-xs text-neutral-500">{error || "Please verify your booking reference or PNR."}</p>
          <Button asChild className="rounded-xl font-bold text-xs">
            <Link href="/">Return to Flight Search</Link>
          </Button>
        </Card>
      </div>
    )
  }

  const isTicketed = booking.status === "TICKETED"
  const isHeld = booking.status === "HELD" && secondsRemaining > 0
  const isExpired = booking.status === "EXPIRED" || (booking.status === "HELD" && secondsRemaining <= 0)

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        {/* Banner based on Status */}
        {isTicketed && (
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="size-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                <CheckCircle2 className="size-8 text-white" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-widest font-black text-emerald-200">
                  Confirmed & Ticketed · Instant Payment Success
                </span>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                  Your Flight is Confirmed!
                </h1>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Electronic ticket issued via Sabre GDS. Sent to <strong>{booking.contactEmail}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={() => window.print()}
                className="bg-white text-emerald-900 hover:bg-neutral-100 font-bold rounded-xl text-xs py-2.5 px-4 shadow-md"
              >
                <Printer className="size-3.5 mr-1.5" />
                Print Ticket
              </Button>
            </div>
          </div>
        )}

        {isHeld && (
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="size-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                <Clock className="size-8 text-white animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-widest font-black text-amber-200">
                  Book Now, Pay Later · 1-Hour Time Limit
                </span>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                  Seats Held on Sabre GDS
                </h1>
                <p className="text-xs text-amber-100 mt-0.5">
                  Complete payment before the time limit expires to issue your e-ticket.
                </p>
              </div>
            </div>

            {/* Countdown HUD Box */}
            <div className="bg-black/30 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center min-w-44">
              <span className="text-[10px] uppercase font-bold text-amber-200 block">
                Time Remaining To Pay
              </span>
              <span className="font-mono text-2xl font-black text-white tracking-widest block">
                {formatTimer(secondsRemaining)}
              </span>
            </div>
          </div>
        )}

        {isExpired && (
          <div className="p-6 md:p-8 rounded-3xl bg-red-600 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="size-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                <AlertTriangle className="size-8 text-white" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-widest font-black text-red-200">
                  Hold Period Elapsed
                </span>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                  Reservation Expired
                </h1>
                <p className="text-xs text-red-100 mt-0.5">
                  The 1-hour payment window has passed. Held seats have been released back to Sabre GDS.
                </p>
              </div>
            </div>

            <Button asChild className="bg-white text-red-900 hover:bg-neutral-100 font-bold rounded-xl text-xs">
              <Link href="/flight/search">Search New Flights</Link>
            </Button>
          </div>
        )}

        {/* Master Flight Voucher Card */}
        <Card className="rounded-3xl bg-white border border-neutral-200 shadow-md overflow-hidden">
          {/* Voucher Header Strip */}
          <div className="bg-neutral-900 text-white p-5 md:p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold block">
                Booking Reference
              </span>
              <span className="text-xl font-mono font-black text-white tracking-wide">
                {booking.bookingReference}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold block">
                  Sabre GDS PNR
                </span>
                <span className="text-xl font-mono font-black text-primary bg-primary/20 px-3 py-0.5 rounded-lg border border-primary/30">
                  {booking.pnr || "HE9LAA"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyPNR(booking.pnr || "")}
                className="size-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 transition-colors"
                title="Copy PNR"
              >
                {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
              </button>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Flight Route Details */}
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3">
                <div className="flex items-center gap-3">
                  <AirlineLogo
                    airlineCode={booking.airlineCode}
                    airlineName={booking.airlineName}
                    className="size-11"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">
                      {booking.airlineName} · Flight {booking.flightNumber}
                    </h3>
                    <span className="text-xs text-neutral-500">Cabin Class: {booking.cabinClass}</span>
                  </div>
                </div>

                {booking.eTicketNumbers && booking.eTicketNumbers.length > 0 && (
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">E-Ticket Number</span>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      {booking.eTicketNumbers[0]}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div>
                  <span className="text-[11px] text-neutral-400 font-medium">Departure Airport</span>
                  <p className="text-2xl font-black text-neutral-900">
                    {booking.originCity} ({booking.originCode})
                  </p>
                  <span className="text-xs text-neutral-500">
                    {new Date(booking.departureDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-bold text-neutral-500 mb-1">Direct Flight</span>
                  <div className="flex items-center gap-1.5 w-full max-w-[140px]">
                    <span className="size-2 rounded-full bg-primary" />
                    <div className="flex-1 border-t-2 border-primary/40 relative">
                      <Plane className="size-3 text-primary absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform -rotate-45" />
                    </div>
                    <span className="size-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-1">Sabre Verified</span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-neutral-400 font-medium">Destination Airport</span>
                  <p className="text-2xl font-black text-neutral-900">
                    {booking.destinationCity} ({booking.destinationCode})
                  </p>
                  <span className="text-xs text-neutral-500">
                    {new Date(booking.departureDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Passengers Manifest */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Users className="size-4 text-primary" />
                <span>Passenger Manifest ({booking.passengers?.length || 1})</span>
              </h3>

              <div className="border border-neutral-200 rounded-2xl overflow-hidden divide-y divide-neutral-200 text-xs">
                {booking.passengers?.map((p: any, idx: number) => (
                  <div key={idx} className="p-3.5 flex flex-wrap items-center justify-between gap-3 bg-white">
                    <div>
                      <span className="font-bold text-neutral-900">
                        {p.title} {p.firstName} {p.lastName}
                      </span>
                      <span className="text-[11px] text-neutral-400 ml-2">
                        ({p.passengerType.toUpperCase()}) · {p.gender}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-neutral-500">
                      <span>Nationality: {p.nationality}</span>
                      {p.passportNumber && <span>Passport: <strong>{p.passportNumber}</strong></span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Fare & Pay Now Action */}
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-neutral-500">Total Booking Amount</span>
                <p className="text-2xl md:text-3xl font-black text-neutral-900">
                  ৳ {booking.totalAmount.toLocaleString()} BDT
                </p>
                <span className="text-[11px] text-neutral-400">All Taxes & Surcharges Included</span>
              </div>

              {isHeld && (
                <Button
                  type="button"
                  disabled={payingNow}
                  onClick={handlePayNow}
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold px-8 py-3.5 rounded-xl shadow-lg shadow-emerald-600/25 cursor-pointer text-sm"
                >
                  {payingNow ? "Connecting SSLCommerz..." : `Pay Now ৳ ${booking.totalAmount.toLocaleString()} via Card/bKash`}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Loading Flight Confirmation...</div>}>
      <ConfirmationInner />
    </Suspense>
  )
}
