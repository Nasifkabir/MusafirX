"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FlightStore } from "@/lib/store"
import {
  Plane,
  Calendar,
  Clock,
  ShieldCheck,
  Check,
  AlertCircle,
  CreditCard,
  Lock,
  ArrowRight,
  Luggage,
  Users,
  Sparkles,
  Timer,
  ChevronLeft,
  ChevronDown,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AirlineLogo } from "@/components/airline-logo"

export default function CheckoutPage() {
  const router = useRouter()
  const selectedFlight = FlightStore.useState((s) => s.selectedFlight)
  const searchData = FlightStore.useState((s) => s.searchData)

  const [contactEmail, setContactEmail] = useState("tariq.traveler@gmail.com")
  const [contactPhone, setContactPhone] = useState("+880 1712 345678")
  const [paymentChoice, setPaymentChoice] = useState<"hold" | "instant">("hold")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Passenger Manifest State
  const adultCount = Math.max(1, searchData.passengers.adults || 1)
  const childCount = searchData.passengers.children || 0
  const infantCount = searchData.passengers.infants || 0
  const totalPax = adultCount + childCount + infantCount

  const [passengers, setPassengers] = useState<any[]>(() => {
    const list = []
    for (let i = 0; i < adultCount; i++) {
      list.push({
        passengerType: "adult",
        title: "Mr",
        firstName: i === 0 ? "Tariq" : "",
        lastName: i === 0 ? "Mahmud" : "",
        gender: "Male",
        dateOfBirth: "1992-04-15",
        nationality: "Bangladeshi",
        passportNumber: "A08941254",
        passportExpiry: "2031-10-15",
        nidNumber: "19922692019000124",
      })
    }
    for (let i = 0; i < childCount; i++) {
      list.push({
        passengerType: "child",
        title: "Mstr",
        firstName: "",
        lastName: "",
        gender: "Male",
        dateOfBirth: "2018-06-10",
        nationality: "Bangladeshi",
        passportNumber: "",
        passportExpiry: "",
      })
    }
    for (let i = 0; i < infantCount; i++) {
      list.push({
        passengerType: "infant",
        title: "Mstr",
        firstName: "",
        lastName: "",
        gender: "Male",
        dateOfBirth: "2025-02-12",
        nationality: "Bangladeshi",
        passportNumber: "",
        passportExpiry: "",
      })
    }
    return list
  })

  // Redirect if no flight selected
  useEffect(() => {
    if (!selectedFlight) {
      router.replace("/flight/search")
    }
  }, [selectedFlight, router])

  if (!selectedFlight) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <p className="text-sm font-semibold text-neutral-500">Redirecting to flight selection...</p>
      </div>
    )
  }

  const basePricePerPax = selectedFlight.price
  const totalAmount = basePricePerPax * totalPax
  const baseFare = Math.round(totalAmount * 0.78)
  const taxesAndFees = totalAmount - baseFare

  const updatePaxField = (index: number, field: string, value: string) => {
    setPassengers((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: value }
      return copy
    })
  }

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Form Validation
    if (!contactEmail.includes("@")) {
      setError("Please enter a valid contact email address.")
      return
    }
    if (!contactPhone || contactPhone.length < 8) {
      setError("Please enter a valid contact phone number.")
      return
    }

    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i]
      if (!p.firstName.trim() || !p.lastName.trim()) {
        setError(`Please enter First and Last Name for Passenger ${i + 1} as printed on passport/NID.`)
        return
      }
    }

    setSubmitting(true)

    const payload = {
      flight: selectedFlight,
      contact: { email: contactEmail.trim(), phone: contactPhone.trim() },
      passengers,
      fareBreakdown: {
        baseFare,
        taxesAndFees,
        totalAmount,
        currency: "BDT",
      },
    }

    try {
      if (paymentChoice === "hold") {
        // Option 1: Book Now, Pay Later (1-Hour Hold State Machine)
        const res = await fetch("/api/bookings/hold", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const data = await res.json()

        if (data.success && data.bookingReference) {
          router.push(`/flight/booking/confirmation?ref=${encodeURIComponent(data.bookingReference)}`)
        } else {
          setError(data.message || "Failed to hold seats on Sabre GDS.")
          setSubmitting(false)
        }
      } else {
        // Option 2: Instant Payment with Card / MFS (SSLCommerz)
        const res = await fetch("/api/bookings/initiate-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const data = await res.json()

        if (data.success && data.gatewayUrl) {
          window.location.href = data.gatewayUrl
        } else {
          setError(data.message || "Failed to initiate SSLCommerz gateway.")
          setSubmitting(false)
        }
      }
    } catch (err: any) {
      setError(`Network error: ${err.message}`)
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Top Breadcrumb & Status Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-16 md:top-18 z-30 shadow-xs">
        <div className="container mx-auto px-4 py-3 max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/flight/search")}
              className="size-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-600 transition-colors"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-primary">
                Trip.com Standard Checkout
              </span>
              <h1 className="text-sm md:text-base font-black text-neutral-900 leading-none">
                {selectedFlight.origin.city} ({selectedFlight.origin.code}) → {selectedFlight.destination.city} ({selectedFlight.destination.code})
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <ShieldCheck className="size-4" />
            <span>Sabre GDS Fare Lock Active</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <form onSubmit={handleCheckoutSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Columns: Main Checkout Form */}
            <div className="lg:col-span-8 space-y-6">
              {error && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="size-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Section 1: Flight Itinerary Banner Card */}
              <Card className="p-5 md:p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-3">
                    <AirlineLogo
                      airlineCode={selectedFlight.airlineCode}
                      airlineName={selectedFlight.airline}
                      className="size-11"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 leading-tight">
                        {selectedFlight.airline} · {selectedFlight.flightNumber}
                      </h3>
                      <span className="text-xs text-neutral-500">
                        Aircraft: {selectedFlight.aircraft || "Boeing 737 / ATR 72"} · {selectedFlight.cabinClass}
                      </span>
                    </div>
                  </div>


                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
                    <Check className="size-3" />
                    {selectedFlight.refundableType || "Refundable"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div>
                    <span className="text-[11px] text-neutral-400 font-medium">Departure</span>
                    <p className="text-xl md:text-2xl font-black text-neutral-900">{selectedFlight.departureTime}</p>
                    <p className="text-xs font-bold text-neutral-800">{selectedFlight.origin.city} ({selectedFlight.origin.code})</p>
                    <span className="text-[11px] text-neutral-400">{selectedFlight.departureDate}</span>
                  </div>

                  <div className="flex flex-col items-center justify-center text-center">
                    <span className="text-[11px] text-neutral-400 font-medium mb-1">{selectedFlight.duration}</span>
                    <div className="flex items-center gap-1.5 w-full max-w-[140px]">
                      <span className="size-2 rounded-full bg-primary/20 border border-primary" />
                      <div className="flex-1 border-t-2 border-dashed border-primary/40 relative">
                        <Plane className="size-3 text-primary absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform -rotate-45" />
                      </div>
                      <span className="size-2 rounded-full bg-primary" />
                    </div>
                    <span className="text-[11px] font-bold text-neutral-600 mt-1">{selectedFlight.stopDetails}</span>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-neutral-400 font-medium">Arrival</span>
                    <p className="text-xl md:text-2xl font-black text-neutral-900">{selectedFlight.arrivalTime}</p>
                    <p className="text-xs font-bold text-neutral-800">{selectedFlight.destination.city} ({selectedFlight.destination.code})</p>
                    <span className="text-[11px] text-neutral-400">{selectedFlight.arrivalDate}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 pt-2 border-t border-neutral-100">
                  <span className="flex items-center gap-1.5">
                    <Luggage className="size-3.5 text-blue-600" />
                    Baggage: <strong>{selectedFlight.baggage || "20 KG Check-in + 7 KG Cabin"}</strong>
                  </span>
                  <span>•</span>
                  <span>Class: <strong>{selectedFlight.bookingClass || "Economy (Y)"}</strong></span>
                </div>
              </Card>

              {/* Section 2: Contact Information Card */}
              <Card className="p-5 md:p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-sm space-y-4">
                <div className="border-b border-neutral-100 pb-3">
                  <h3 className="text-base font-black text-neutral-900 tracking-tight">
                    Lead Traveler & Contact Information
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Your e-ticket voucher, PNR confirmation, and flight alerts will be sent here
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-neutral-700">Email Address *</Label>
                    <Input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. traveler@gmail.com"
                      required
                      className="rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-neutral-700">Mobile Phone (WhatsApp Active) *</Label>
                    <Input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+880 1712 345678"
                      required
                      className="rounded-xl text-xs font-medium"
                    />
                  </div>
                </div>
              </Card>

              {/* Section 3: Passenger Manifest Form */}
              <Card className="p-5 md:p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-sm space-y-6">
                <div className="border-b border-neutral-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-neutral-900 tracking-tight">
                      Passenger Information ({passengers.length} Traveler{passengers.length > 1 ? "s" : ""})
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Must match passenger government-issued Photo ID / Passport exactly
                    </p>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                    IATA Compliant
                  </span>
                </div>

                {passengers.map((p, idx) => (
                  <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                        <span className="size-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        Passenger {idx + 1} ({p.passengerType.toUpperCase()})
                      </span>
                      <span className="text-[11px] font-semibold text-neutral-400">
                        {p.passengerType === "adult" ? "12+ Years" : p.passengerType === "child" ? "2-11 Years" : "Under 2 Years"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      {/* Title */}
                      <div className="sm:col-span-1 space-y-1">
                        <Label className="text-[11px] font-bold text-neutral-600">Title *</Label>
                        <select
                          value={p.title}
                          onChange={(e) => updatePaxField(idx, "title", e.target.value)}
                          className="w-full h-9 rounded-xl border border-neutral-300 bg-white px-3 text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="Mr">Mr</option>
                          <option value="Mrs">Mrs</option>
                          <option value="Ms">Ms</option>
                          <option value="Mstr">Mstr</option>
                        </select>
                      </div>

                      {/* First Name */}
                      <div className="sm:col-span-3 space-y-1">
                        <Label className="text-[11px] font-bold text-neutral-600">Given / First Name *</Label>
                        <Input
                          value={p.firstName}
                          onChange={(e) => updatePaxField(idx, "firstName", e.target.value)}
                          placeholder="e.g. Tariq"
                          required
                          className="rounded-xl text-xs h-9"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Last Name */}
                      <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-neutral-600">Surname / Last Name *</Label>
                        <Input
                          value={p.lastName}
                          onChange={(e) => updatePaxField(idx, "lastName", e.target.value)}
                          placeholder="e.g. Mahmud"
                          required
                          className="rounded-xl text-xs h-9"
                        />
                      </div>

                      {/* Date of Birth */}
                      <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-neutral-600">Date of Birth *</Label>
                        <Input
                          type="date"
                          value={p.dateOfBirth}
                          onChange={(e) => updatePaxField(idx, "dateOfBirth", e.target.value)}
                          required
                          className="rounded-xl text-xs h-9"
                        />
                      </div>

                      {/* Gender */}
                      <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-neutral-600">Gender *</Label>
                        <select
                          value={p.gender}
                          onChange={(e) => updatePaxField(idx, "gender", e.target.value)}
                          className="w-full h-9 rounded-xl border border-neutral-300 bg-white px-3 text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Passport Number */}
                      <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-neutral-600">Passport Number (or NID)</Label>
                        <Input
                          value={p.passportNumber}
                          onChange={(e) => updatePaxField(idx, "passportNumber", e.target.value)}
                          placeholder="e.g. A08941254"
                          className="rounded-xl text-xs h-9 font-mono uppercase"
                        />
                      </div>

                      {/* Passport Expiry */}
                      <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-neutral-600">Passport Expiry Date</Label>
                        <Input
                          type="date"
                          value={p.passportExpiry}
                          onChange={(e) => updatePaxField(idx, "passportExpiry", e.target.value)}
                          className="rounded-xl text-xs h-9"
                        />
                      </div>

                      {/* Nationality */}
                      <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-neutral-600">Nationality</Label>
                        <Input
                          value={p.nationality}
                          onChange={(e) => updatePaxField(idx, "nationality", e.target.value)}
                          placeholder="Bangladeshi"
                          className="rounded-xl text-xs h-9"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </Card>

              {/* Section 4: Dual Decision Payment Engine */}
              <Card className="p-5 md:p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-sm space-y-5">
                <div className="border-b border-neutral-100 pb-3">
                  <h3 className="text-base font-black text-neutral-900 tracking-tight">
                    Choose Booking & Payment Option
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Select whether you want to hold your flight seats for 1 hour or pay immediately
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Option 1: Book Now, Pay Later (1-Hour Hold) */}
                  <div
                    onClick={() => setPaymentChoice("hold")}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 relative ${
                      paymentChoice === "hold"
                        ? "border-amber-500 bg-amber-50/40 shadow-md"
                        : "border-neutral-200 hover:border-neutral-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="size-5 rounded-full border-2 flex items-center justify-center border-amber-600 bg-amber-500 text-white">
                        {paymentChoice === "hold" && <span className="size-2 rounded-full bg-white" />}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        ⏳ 1-Hour Hold
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-neutral-900">Book Now, Pay Later</h4>
                      <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                        Reserve today's lower Sabre GDS fare. You will receive a confirmed PNR with a 1-Hour Time Limit.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-amber-200/60 text-[11px] text-amber-900 font-medium">
                      ✓ No credit card required right now
                    </div>
                  </div>

                  {/* Option 2: Instant Payment with Card / MFS (SSLCommerz) */}
                  <div
                    onClick={() => setPaymentChoice("instant")}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 relative ${
                      paymentChoice === "instant"
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-neutral-200 hover:border-neutral-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="size-5 rounded-full border-2 flex items-center justify-center border-primary bg-primary text-white">
                        {paymentChoice === "instant" && <span className="size-2 rounded-full bg-white" />}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        ⚡ Instant Ticketing
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-neutral-900">Instant Card / bKash Pay</h4>
                      <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                        Pay securely with any Card, bKash, or Nagad via SSLCommerz. Your official E-Ticket is issued immediately.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-neutral-200 text-[11px] text-primary font-semibold flex items-center gap-1.5">
                      <CreditCard className="size-3.5" />
                      <span>Visa · Mastercard · bKash · Nagad</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-4 rounded-2xl text-sm md:text-base font-extrabold text-white shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      paymentChoice === "hold"
                        ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/25"
                        : "bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 shadow-blue-700/25"
                    }`}
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {paymentChoice === "hold" ? "Creating Sabre PNR..." : "Connecting SSLCommerz..."}
                      </span>
                    ) : paymentChoice === "hold" ? (
                      <>
                        <Timer className="size-4" />
                        <span>Hold Booking for 1 Hour (Pay Later)</span>
                      </>
                    ) : (
                      <>
                        <Lock className="size-4" />
                        <span>Pay ৳ {totalAmount.toLocaleString()} BDT via SSLCommerz</span>
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Right 4 Columns: Sticky Fare Summary & Trust */}
            <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-36">
              <Card className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-md space-y-4">
                <div className="border-b border-neutral-100 pb-3">
                  <h3 className="text-base font-black text-neutral-900 tracking-tight">Fare Summary</h3>
                  <span className="text-xs text-neutral-500">Sabre GDS Certified Tariff</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Base Fare ({totalPax} Traveler{totalPax > 1 ? "s" : ""}):</span>
                    <span className="font-bold text-neutral-900">৳ {baseFare.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-neutral-600">
                    <span>Taxes & Airport Surcharges:</span>
                    <span className="font-bold text-neutral-900">৳ {taxesAndFees.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-neutral-600">
                    <span>Baggage Allowance:</span>
                    <span className="font-bold text-emerald-600">Included (Free)</span>
                  </div>

                  <div className="flex justify-between text-neutral-600">
                    <span>GDS Reservation Fee:</span>
                    <span className="font-bold text-emerald-600">৳ 0</span>
                  </div>

                  <div className="border-t border-neutral-200 pt-3 flex justify-between items-baseline">
                    <div>
                      <span className="text-xs font-bold text-neutral-700 block">Total Payable</span>
                      <span className="text-[10px] text-neutral-400">All Taxes & VAT Included</span>
                    </div>
                    <span className="text-2xl font-black text-primary">
                      ৳ {totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60 text-[11px] text-neutral-500 leading-relaxed">
                  ✓ Price Lock active for this session. Fares are directly synchronized with airline Sabre inventory.
                </div>
              </Card>

              {/* Trust & Guarantees */}
              <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2.5 text-xs text-neutral-600">
                <div className="flex items-center gap-2 text-neutral-800 font-bold">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  <span>100% Secured Transaction</span>
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Bank-grade 256-bit SSL encryption powered by SSLCommerz. Your payment credentials are never stored.
                </p>
                <div className="pt-2 border-t text-[11px] text-neutral-500 flex items-center justify-between">
                  <span>Support: +880 9610-002244</span>
                  <span className="font-bold text-primary">support@musafirx.com</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
