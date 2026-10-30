"use client"

import { useEffect, useState, useMemo, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { FlightStore } from "@/lib/store"
import type { FlightOffer } from "@/lib/sabre/types"
import { FlightRadarMap } from "@/components/flight-radar-map"
import { FlightSearchForm } from "@/components/flight-search-form"
import { AIRPORTS } from "@/lib/airports"
import {
  Plane,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Calendar,
  Users,
  Luggage,
  ShieldCheck,
  Check,
  Sparkles,
  Info,
  DollarSign,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Zap,
  AlertTriangle,
  Key,
  ShieldAlert,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AirlineLogo } from "@/components/airline-logo"

function SearchResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromParam = searchParams.get("from")
  const toParam = searchParams.get("to")
  const dateParam = searchParams.get("date")
  const typeParam = searchParams.get("type") as "one-way" | "round-trip" | "multi-city" | null
  const tsParam = searchParams.get("ts")

  const searchData = FlightStore.useState((s) => s.searchData)

  const [loading, setLoading] = useState(true)
  const [showRadar, setShowRadar] = useState(false)
  const [showEditSearch, setShowEditSearch] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [flights, setFlights] = useState<FlightOffer[]>([])
  const [airlineSummaries, setAirlineSummaries] = useState<
    Array<{ code: string; name: string; count: number; minPrice: number }>
  >([])
  const [sourceEngine, setSourceEngine] = useState<string>("none")
  const [sabreConfigured, setSabreConfigured] = useState<boolean>(false)
  const [sabreStatus, setSabreStatus] = useState<string>("untested")
  const [statusMessage, setStatusMessage] = useState<string>("")

  // Sync flight type from URL if specified
  useEffect(() => {
    if (typeParam && ["one-way", "round-trip", "multi-city"].includes(typeParam)) {
      if (searchData.flightType !== typeParam) {
        FlightStore.update((s) => {
          s.searchData.flightType = typeParam
        })
      }
    }
  }, [typeParam, searchData.flightType])

  // Filter & Sort State
  const [sortBy, setSortBy] = useState<"cheapest" | "fastest">("cheapest")
  const [selectedAirlineFilter, setSelectedAirlineFilter] = useState<string | null>(null)
  const [maxPrice, setMaxPrice] = useState<number>(35000)
  const [timeSlotFilter, setTimeSlotFilter] = useState<string | null>(null)
  const [stopsFilter, setStopsFilter] = useState<number | null>(null)
  const [expandedFlightId, setExpandedFlightId] = useState<string | null>(null)

  // Countdown Session Timer
  const [secondsRemaining, setSecondsRemaining] = useState<number>(19 * 60 + 50)

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60)
    const secs = totalSec % 60
    return `${mins.toString().padStart(2, "0")} : ${secs.toString().padStart(2, "0")}`
  }

  // Fallback defaults or URL query parameters
  const origin = useMemo(() => {
    if (fromParam) {
      const match = AIRPORTS.find((a) => a.code === fromParam.toUpperCase())
      if (match) return match
    }
    return searchData.origin || AIRPORTS.find((a) => a.code === "DAC") || AIRPORTS[0]
  }, [fromParam, searchData.origin])

  const destination = useMemo(() => {
    if (toParam) {
      const match = AIRPORTS.find((a) => a.code === toParam.toUpperCase())
      if (match) return match
    }
    return searchData.destination || AIRPORTS.find((a) => a.code === "CXB") || AIRPORTS[1]
  }, [toParam, searchData.destination])

  // Stable departure date ISO string (prevents infinite re-render loops from new Date() references)
  const depDateIso = useMemo(() => {
    if (dateParam) return dateParam.split("T")[0]
    if (!searchData.departureDate) {
      return new Date().toISOString().split("T")[0]
    }
    try {
      const d = new Date(searchData.departureDate)
      return isNaN(d.getTime()) ? new Date().toISOString().split("T")[0] : d.toISOString().split("T")[0]
    } catch {
      return new Date().toISOString().split("T")[0]
    }
  }, [dateParam, searchData.departureDate])

  const departureDateStr = useMemo(() => {
    try {
      const d = new Date(depDateIso)
      return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "2-digit",
      }).format(d)
    } catch {
      return depDateIso
    }
  }, [depDateIso])

  // Fetch flights from unified Sabre GDS API
  const loadFlights = async (allowDemo = false) => {
    setShowEditSearch(false)
    setLoading(true)
    const startTime = Date.now()
    try {
      const res = await fetch("/api/flights/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originCode: origin.code,
          destinationCode: destination.code,
          departureDate: depDateIso,
          tripType: typeParam || searchData.flightType,
          passengers: searchData.passengers,
          allowDemoFallback: allowDemo,
        }),
      })

      const data = await res.json()

      // Allow the scanning radar map to complete its animation smoothly (~1600ms)
      const elapsed = Date.now() - startTime
      if (elapsed < 1600) {
        await new Promise((r) => setTimeout(r, 1600 - elapsed))
      }

      if (data.success) {
        setShowEditSearch(false)
        setFlights(data.flights || [])
        setAirlineSummaries(data.airlineSummary || [])
        setSourceEngine(data.source)
        setSabreConfigured(Boolean(data.sabreConfigured))
        setSabreStatus(data.sabreStatus || "untested")
        setStatusMessage(data.message || "")
        if (data.flights && data.flights.length > 0) {
          const highest = Math.max(...data.flights.map((f: FlightOffer) => f.price), 15000)
          setMaxPrice(highest)
        }
      }
    } catch (err) {
      console.error("Failed to load flights:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFlights(false)
  }, [origin.code, destination.code, depDateIso, searchData.flightType, tsParam])

  // Departure date stepper: moves date back/forward by N days
  const handleStepDate = (days: number) => {
    try {
      const current = new Date(depDateIso)
      current.setDate(current.getDate() + days)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (current < today) return
      const nextIso = current.toISOString().split("T")[0]
      FlightStore.update((s) => {
        s.searchData.departureDate = current
      })
      router.push(
        `/flight/search?from=${origin.code}&to=${destination.code}&date=${nextIso}&type=${searchData.flightType}&ts=${Date.now()}`
      )
    } catch (e) {
      console.error(e)
    }
  }



  // Filter and sort flights
  const filteredFlights = useMemo(() => {
    let result = [...flights]

    if (selectedAirlineFilter) {
      result = result.filter((f) => f.airlineCode === selectedAirlineFilter)
    }

    result = result.filter((f) => f.price <= maxPrice)

    if (stopsFilter !== null) {
      result = result.filter((f) => f.stops === stopsFilter)
    }

    if (timeSlotFilter) {
      result = result.filter((f) => {
        const hour = parseInt(f.departureTime.split(":")[0], 10)
        if (timeSlotFilter === "night") return hour >= 0 && hour < 6
        if (timeSlotFilter === "morning") return hour >= 6 && hour < 12
        if (timeSlotFilter === "afternoon") return hour >= 12 && hour < 18
        if (timeSlotFilter === "evening") return hour >= 18 && hour <= 23
        return true
      })
    }

    if (sortBy === "cheapest") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === "fastest") {
      result.sort((a, b) => a.durationMinutes - b.durationMinutes)
    }

    return result
  }, [flights, selectedAirlineFilter, maxPrice, stopsFilter, timeSlotFilter, sortBy])

  const minFlightPrice = flights.length > 0 ? Math.min(...flights.map((f) => f.price)) : 4500
  const maxFlightPrice = flights.length > 0 ? Math.max(...flights.map((f) => f.price)) : 25000

  const [validatingFlightId, setValidatingFlightId] = useState<string | null>(null)

  const handleSelectFlight = async (flight: FlightOffer) => {
    setValidatingFlightId(flight.id)
    try {
      const res = await fetch("/api/flights/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flight }),
      })
      const data = await res.json()
      if (data.success) {
        FlightStore.update((s) => {
          s.selectedFlight = data.flight || flight
        })
        router.push("/flight/booking")
      } else {
        alert(data.message || "Flight validation failed on Sabre GDS.")
      }
    } catch {
      FlightStore.update((s) => {
        s.selectedFlight = flight
      })
      router.push("/flight/booking")
    } finally {
      setValidatingFlightId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* Top Banner / Breadcrumb Bar */}
      <div className="bg-white border-b border-neutral-200 sticky top-15 sm:top-16 md:top-18 z-30 shadow-xs">
        <div className="container mx-auto px-2.5 sm:px-4 py-2 sm:py-3">
          <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
            {/* Route Summary */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="size-7 sm:size-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 shrink-0"
              >
                <ChevronLeft className="size-4 sm:size-5" />
              </button>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                    <Plane className="size-2.5 fill-current transform -rotate-45" />
                    {searchData.flightType.toUpperCase()}
                  </span>
                  <span className="text-sm sm:text-base font-black text-neutral-900 tracking-tight truncate">
                    {origin.city} → {destination.city}
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs text-neutral-400 font-medium truncate">
                  {origin.code}–{destination.code} • MusafirX Live Radar
                </span>
              </div>
            </div>

            {/* Dates & Passengers info (Tablet & Desktop) */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    Departure
                  </span>
                  <span className="text-xs md:text-sm font-bold text-neutral-800">
                    {departureDateStr}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="size-4 text-amber-600" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    Passengers
                  </span>
                  <span className="text-xs md:text-sm font-bold text-neutral-800">
                    {searchData.passengers.adults +
                      searchData.passengers.children +
                      searchData.passengers.infants}{" "}
                    Traveller · Economy
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Search & Radar Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowRadar(!showRadar)}
                className={`flex items-center gap-1 text-xs font-bold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border transition-colors ${
                  showRadar
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                <Zap className="size-3.5" />
                <span>{showRadar ? "Hide" : "Route"} Radar</span>
              </button>

              <button
                type="button"
                onClick={() => setShowEditSearch(!showEditSearch)}
                className="flex items-center gap-1 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-colors cursor-pointer"
              >
                <span>Edit Search</span>
                <ChevronDown
                  className={`size-3.5 text-neutral-500 transition-transform ${
                    showEditSearch ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Collapsible Edit Search Form */}
          {showEditSearch && (
            <div className="mt-4 pt-4 border-t border-neutral-100 animate-in fade-in duration-200">
              <FlightSearchForm
                variant="compact"
                onSearchSubmitted={() => setShowEditSearch(false)}
              />
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* State 1: Active Scanning Radar Animation UI (Screenshot 2) */}
        {loading ? (
          <div className="py-2 md:py-6 animate-in fade-in duration-300">
            <FlightRadarMap
              originCode={origin.code}
              originCity={origin.city}
              destinationCode={destination.code}
              destinationCity={destination.city}
              departureDate={departureDateStr}
              isSearching={true}
              onEditSearch={() => setShowEditSearch(!showEditSearch)}
            />
          </div>
        ) : (
          <>
            {/* Optional Radar Map when user toggles 'Route Radar' button while results are loaded */}
            {showRadar && (
              <div className="animate-in fade-in duration-300 mb-6">
                <FlightRadarMap
                  originCode={origin.code}
                  originCity={origin.city}
                  destinationCode={destination.code}
                  destinationCity={destination.city}
                  departureDate={departureDateStr}
                  isSearching={false}
                  onScanComplete={() => setShowRadar(false)}
                  onEditSearch={() => setShowEditSearch(!showEditSearch)}
                />
              </div>
            )}

            {/* Sabre Unconfigured Gate / Warning Banner */}
            {!sabreConfigured && flights.length === 0 && (
              <Card className="p-8 md:p-10 rounded-3xl border border-amber-200 bg-amber-50/50 shadow-md space-y-6 max-w-4xl mx-auto text-center animate-in fade-in duration-200">
                <div className="size-16 rounded-3xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center mx-auto">
                  <ShieldAlert className="size-8" />
                </div>

                <div className="space-y-2 max-w-xl mx-auto">
                  <span className="text-[11px] font-black uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                    Sabre GDS Credentials Required
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
                    Gateway Not Yet Configured
                  </h2>
                  <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
                    {statusMessage ||
                      "Sabre GDS Sandbox credentials (PCC, Client ID, Client Secret) have not been saved or authenticated in your Admin Panel. Please add your credentials to pull real-time flight fares."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-neutral-200 max-w-lg mx-auto text-left text-xs space-y-2">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-neutral-500 font-semibold">Gateway Status:</span>
                    <span className="font-mono font-bold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded">
                      {sabreStatus.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 font-semibold">Required Fields:</span>
                    <span className="text-neutral-800 font-medium">PCC, Client ID, Client Secret</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Button
                    asChild
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold px-7 py-3 rounded-xl shadow-md text-xs md:text-sm"
                  >
                    <Link href="/admin/suppliers/sabre">
                      <Key className="size-4 mr-2" />
                      Enter Sabre Credentials in Admin Panel
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => loadFlights(true)}
                    className="w-full sm:w-auto rounded-xl text-xs font-bold border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                  >
                    Preview Sample Sandbox Flights (Demo Mode)
                  </Button>
                </div>
              </Card>
            )}

            {/* Empty results state */}
            {sabreConfigured && flights.length === 0 && (
              <div className="bg-white rounded-3xl p-10 border border-neutral-200 shadow-sm max-w-xl mx-auto text-center space-y-4">
                <div className="size-16 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                  <Plane className="size-8" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">No Flights Found</h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  No scheduled flights were found for {origin.city} ({origin.code}) → {destination.city} ({destination.code}) on {departureDateStr}.
                </p>
                <Button
                  onClick={() => setShowEditSearch(true)}
                  className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-2.5 rounded-xl text-xs"
                >
                  Change Dates or Route
                </Button>
              </div>
            )}

            {/* Live Search Results Layout */}
            {flights.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Sticky Sidebar (Filters & Time Remaining) */}
            <div className="hidden lg:block lg:col-span-3 space-y-4 lg:sticky lg:top-36">
              {/* Demo Mode Notice Pill */}
              {sourceEngine === "musafirx_gds" && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Info className="size-3.5" />
                    Demo Sandbox Mode
                  </span>
                  <Link
                    href="/admin/suppliers/sabre"
                    className="text-primary underline font-bold"
                  >
                    Add Live Sabre
                  </Link>
                </div>
              )}

              {/* Time Remaining Card */}
              <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-neutral-700 font-bold text-sm">
                    <Clock className="size-4 text-primary" />
                    <span>Time Remaining</span>
                  </div>
                  <span className="font-mono text-xl font-black text-neutral-900 tracking-wider">
                    {formatTimer(secondsRemaining)}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-1000"
                    style={{ width: `${(secondsRemaining / (20 * 60)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Departure Date Stepper */}
              <div className="bg-white rounded-2xl p-3 border border-neutral-200/80 shadow-xs flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleStepDate(-1)}
                  className="size-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:border-primary hover:text-primary transition-colors cursor-pointer"
                  title="Previous Day"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Departure Date
                  </span>
                  <span className="text-xs font-bold text-neutral-900">{departureDateStr}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleStepDate(1)}
                  className="size-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:border-primary hover:text-primary transition-colors cursor-pointer"
                  title="Next Day"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>

              {/* Filters Box */}
              <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-2 font-bold text-neutral-900 text-sm">
                    <SlidersHorizontal className="size-4 text-primary" />
                    <span>Flight Filters</span>
                  </div>
                  {(selectedAirlineFilter || timeSlotFilter || stopsFilter !== null) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAirlineFilter(null)
                        setTimeSlotFilter(null)
                        setStopsFilter(null)
                        setMaxPrice(maxFlightPrice)
                      }}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Reset All
                    </button>
                  )}
                </div>

                {/* Price Range Slider */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider block">
                    Max Price Range
                  </span>
                  <div className="flex items-center justify-between text-xs font-black text-neutral-800">
                    <span>৳ {minFlightPrice.toLocaleString()}</span>
                    <span className="text-primary font-black">৳ {maxPrice.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={minFlightPrice}
                    max={maxFlightPrice}
                    step={250}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-neutral-400">
                    <span>MIN</span>
                    <span>MAX</span>
                  </div>
                </div>

                {/* Flight Schedules */}
                <div className="space-y-3 border-t border-neutral-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      Departure Time
                    </span>
                    <button
                      type="button"
                      onClick={() => setTimeSlotFilter(null)}
                      className={`text-[11px] font-bold ${
                        timeSlotFilter === null ? "text-primary" : "text-neutral-400"
                      }`}
                    >
                      Anytime
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "night", label: "Night", time: "00:00–06:00", icon: Moon },
                      { id: "morning", label: "Morning", time: "06:01–12:00", icon: Sunrise },
                      { id: "afternoon", label: "Afternoon", time: "12:01–18:00", icon: Sun },
                      { id: "evening", label: "Evening", time: "18:01–23:59", icon: Sunset },
                    ].map((slot) => {
                      const Icon = slot.icon
                      const isSelected = timeSlotFilter === slot.id
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setTimeSlotFilter(isSelected ? null : slot.id)}
                          className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary shadow-xs font-bold"
                              : "border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-neutral-50/50"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <Icon className="size-3.5 text-neutral-500" />
                            <span className="text-xs font-bold leading-tight">{slot.label}</span>
                          </div>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {slot.time}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Stops Filter */}
                <div className="space-y-3 border-t border-neutral-100 pt-4">
                  <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider block">
                    Stops
                  </span>
                  <div className="flex flex-col gap-2">
                    {[
                      { stops: 0, label: "Non stop" },
                      { stops: 1, label: "1 Stop" },
                      { stops: 2, label: "2+ Stops" },
                    ].map((s) => {
                      const isChecked = stopsFilter === s.stops
                      return (
                        <button
                          key={s.stops}
                          type="button"
                          onClick={() => setStopsFilter(isChecked ? null : s.stops)}
                          className="flex items-center justify-between py-1 group text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`size-4 rounded-md border flex items-center justify-center transition-colors ${
                                isChecked
                                  ? "bg-primary border-primary text-white"
                                  : "border-neutral-300 group-hover:border-neutral-400"
                              }`}
                            >
                              {isChecked && <Check className="size-3 stroke-[3]" />}
                            </span>
                            <span className="text-xs font-semibold text-neutral-700">
                              {s.label}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Main Content (Sort Tabs & AeroFlight Cards) */}
            <div className="lg:col-span-9 space-y-4">
              {/* Mobile Quick Date Stepper (lg:hidden) */}
              <div className="lg:hidden bg-white rounded-2xl p-2.5 border border-neutral-200/80 shadow-xs flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleStepDate(-1)}
                  className="size-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:border-primary hover:text-primary transition-colors cursor-pointer"
                  title="Previous Day"
                >
                  <ChevronLeft className="size-3.5" />
                </button>
                <div className="flex items-center gap-2">
                  <Calendar className="size-3.5 text-primary" />
                  <span className="text-xs font-bold text-neutral-900">{departureDateStr}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleStepDate(1)}
                  className="size-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:border-primary hover:text-primary transition-colors cursor-pointer"
                  title="Next Day"
                >
                  <ChevronRight className="size-3.5" />
                </button>
              </div>

              {/* Top Sort Bar */}
              <div className="bg-white rounded-2xl p-2 border border-neutral-200/80 shadow-xs flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* Mobile Filters Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-xs font-bold text-neutral-800 transition-colors cursor-pointer shrink-0"
                  >
                    <SlidersHorizontal className="size-3.5 text-primary" />
                    <span>Filters</span>
                    {(selectedAirlineFilter || timeSlotFilter || stopsFilter !== null) && (
                      <span className="size-2 rounded-full bg-primary" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSortBy("cheapest")}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                      sortBy === "cheapest"
                        ? "bg-primary text-white shadow-sm"
                        : "text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <DollarSign className="size-3.5 sm:size-4" />
                    <div className="flex flex-col text-left">
                      <span>Cheapest</span>
                      <span className="hidden sm:inline text-[10px] opacity-80">Lowest Fare</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSortBy("fastest")}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                      sortBy === "fastest"
                        ? "bg-primary text-white shadow-sm"
                        : "text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <Clock className="size-3.5 sm:size-4" />
                    <div className="flex flex-col text-left">
                      <span>Fastest</span>
                      <span className="hidden sm:inline text-[10px] opacity-80">Shortest Time</span>
                    </div>
                  </button>
                </div>

                <div className="px-2 sm:px-4 py-1 sm:py-2 text-right">
                  <span className="text-[10px] sm:text-xs text-neutral-400 font-medium block">
                    Flights available
                  </span>
                  <span className="text-base sm:text-lg font-black text-neutral-900">
                    {filteredFlights.length}
                  </span>
                </div>
              </div>

              {/* Quick Airline Filter Pills */}
              {airlineSummaries.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {airlineSummaries.map((airline) => {
                    const isSelected = selectedAirlineFilter === airline.code
                    return (
                      <button
                        key={airline.code}
                        type="button"
                        onClick={() =>
                          setSelectedAirlineFilter(isSelected ? null : airline.code)
                        }
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border transition-all shrink-0 cursor-pointer ${
                          isSelected
                            ? "border-primary ring-2 ring-primary/20 shadow-xs"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <AirlineLogo airlineCode={airline.code} airlineName={airline.name} className="size-8" />
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-bold text-neutral-700">
                            {airline.name} ({airline.count})
                          </span>
                          <span className="text-xs font-black text-neutral-900">
                            ৳ {airline.minPrice.toLocaleString()}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Flight Result Cards - MusafirX AeroFlight Style */}
              <div className="space-y-4">
                {filteredFlights.map((flight) => {
                  const isExpanded = expandedFlightId === flight.id

                  return (
                    <div
                      key={flight.id}
                      className="aero-flight-card overflow-hidden bg-white"
                    >
                      <div className="flex flex-col md:flex-row items-stretch">
                        {/* Main Flight Info */}
                        <div className="flex-1 p-5 md:p-6 space-y-5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            {/* Airline Logo & Name */}
                            <div className="flex items-center gap-3">
                              <AirlineLogo airlineCode={flight.airlineCode} airlineName={flight.airline} className="size-12" />
                              <div>
                                <h4 className="font-bold text-sm md:text-base text-neutral-900 leading-tight">
                                  {flight.airline}
                                </h4>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <span className="inline-block text-[11px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                                    {flight.flightNumber} • {flight.aircraft}
                                  </span>
                                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Sabre GDS (PCC: HE9L)
                                  </span>
                                </div>
                              </div>
                            </div>


                            {/* Departure - Duration - Arrival Row */}
                            <div className="flex items-center gap-6 sm:gap-10">
                              {/* Departure */}
                              <div className="flex flex-col">
                                <span className="text-[11px] text-neutral-400 font-medium">
                                  {flight.departureDate}
                                </span>
                                <span className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight">
                                  {flight.departureTime}
                                </span>
                                <span className="text-xs font-bold text-primary">
                                  {flight.origin.code}
                                </span>
                              </div>

                              {/* Duration / Stops Line */}
                              <div className="flex flex-col items-center">
                                <span className="text-[11px] text-neutral-400 font-medium mb-1">
                                  {flight.duration}
                                </span>
                                <div className="flex items-center gap-1.5 w-28 sm:w-36">
                                  <span className="size-2 rounded-full border border-primary bg-primary/20" />
                                  <div className="flex-1 border-t-2 border-dashed border-primary/40 relative">
                                    <Plane className="size-3 text-primary absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform -rotate-45" />
                                  </div>
                                  <span className="size-2 rounded-full bg-primary" />
                                </div>
                                <span className="text-[11px] font-bold text-neutral-600 mt-1">
                                  {flight.stopDetails}
                                </span>
                              </div>

                              {/* Arrival */}
                              <div className="flex flex-col text-right sm:text-left">
                                <span className="text-[11px] text-neutral-400 font-medium">
                                  {flight.arrivalDate}
                                </span>
                                <span className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight">
                                  {flight.arrivalTime}
                                </span>
                                <span className="text-xs font-bold text-primary">
                                  {flight.destination.code}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Badges Bar */}
                          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 pt-3">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedFlightId(isExpanded ? null : flight.id)
                              }
                              className="flex items-center gap-1 text-xs font-bold text-neutral-700 hover:text-primary transition-colors cursor-pointer"
                            >
                              <span>View Itinerary & Baggage</span>
                              {isExpanded ? (
                                <ChevronUp className="size-3.5" />
                              ) : (
                                <ChevronDown className="size-3.5" />
                              )}
                            </button>

                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                                <Check className="size-3" />
                                {flight.refundableType}
                              </span>

                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200/60">
                                {flight.seatsAvailable} seats left ({flight.bookingClass})
                              </span>

                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60">
                                <Luggage className="size-3" />
                                {flight.baggage}
                              </span>

                              {flight.source === "sabre" ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20">
                                  <Sparkles className="size-3 text-primary" />
                                  Sabre GDS Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-lg">
                                  Sample Demo Preview
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-px bg-neutral-100 my-4" />

                        {/* Pricing & Booking Stub */}
                        <div className="w-full md:w-56 p-5 md:p-6 bg-neutral-50/50 md:bg-transparent flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3">
                          <div className="text-left md:text-right">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                              Total Price (BDT)
                            </span>
                            <span className="text-2xl md:text-3xl font-black text-neutral-900 leading-none">
                              ৳ {flight.price.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-neutral-400 block mt-1">
                              Taxes & surcharge included
                            </span>
                          </div>

                          <Button
                            type="button"
                            disabled={validatingFlightId === flight.id}
                            onClick={() => handleSelectFlight(flight)}
                            className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-2.5 rounded-xl shadow-md shadow-primary/25 text-xs md:text-sm cursor-pointer min-w-32"
                          >
                            {validatingFlightId === flight.id ? (
                              <span className="flex items-center gap-1.5">
                                <span className="size-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Validating...
                              </span>
                            ) : (
                              "Select Flight"
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Expandable Flight Details */}
                      {isExpanded && (
                        <div className="border-t border-neutral-100 bg-neutral-50/80 p-5 md:p-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-neutral-200/80 space-y-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-primary block">
                                Flight Segments
                              </span>
                              <div className="flex items-start gap-2.5">
                                <AirlineLogo airlineCode={flight.airlineCode} airlineName={flight.airline} className="size-9 shrink-0" />
                                <div className="text-xs space-y-0.5">
                                  <p className="font-semibold text-neutral-800">
                                    {flight.airline} • {flight.flightNumber}
                                  </p>
                                  <p className="text-neutral-500">Aircraft: {flight.aircraft}</p>
                                  <p className="text-neutral-500">Cabin: {flight.cabinClass} (Class {flight.bookingClass})</p>
                                  <p className="text-neutral-500">{flight.origin.terminal || "Terminal 1"} → {flight.destination.terminal || "Terminal 2"}</p>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-neutral-200/80 space-y-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-primary block">
                                Baggage Allowance
                              </span>
                              <div className="text-xs space-y-1">
                                <p className="font-semibold text-neutral-800">
                                  Checked: {flight.baggage} per adult
                                </p>
                                <p className="text-neutral-500">Cabin: {flight.cabinBaggage} hand luggage</p>
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-neutral-200/80 space-y-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-primary block">
                                Fare Breakdown
                              </span>
                              <div className="text-xs space-y-1 text-neutral-600">
                                <div className="flex justify-between">
                                  <span>Base Fare:</span>
                                  <span className="font-semibold text-neutral-900">৳ {flight.basePrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Taxes & Fees:</span>
                                  <span className="font-semibold text-neutral-900">৳ {flight.taxesAndFees.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between border-t border-neutral-100 pt-1 font-bold text-neutral-900">
                                  <span>Total Payable:</span>
                                  <span className="text-primary font-black">৳ {flight.price.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/80 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                                  Sabre GDS Audit
                                </span>
                                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                                  PCC: HE9L
                                </span>
                              </div>
                              <div className="text-xs space-y-1 text-neutral-700 font-mono">
                                <p>Offer ID: <strong className="text-neutral-900">{flight.id}</strong></p>
                                <p>Booking Class: <strong className="text-emerald-700 font-bold">{flight.bookingClass} Class</strong></p>
                                <p>GDS Inventory: <strong className="text-neutral-900">{flight.seatsAvailable} Seats Open</strong></p>
                                <p className="text-[10px] text-neutral-500">Supplier: Sabre ITT Sandbox</p>
                              </div>
                            </div>
                          </div>


                          <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-200/60">
                            <span className="flex items-center gap-1.5">
                              <ShieldCheck className="size-4 text-emerald-600" />
                              Instant PNR Confirmation via Sabre GDS
                            </span>
                            <Button
                              onClick={() => handleSelectFlight(flight)}
                              size="sm"
                              className="bg-primary hover:bg-primary/90 text-white font-bold rounded-lg text-xs"
                            >
                              Book This Itinerary
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          )}
        </>
      )}
      {/* Mobile Filters Slide-up Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-5 space-y-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2 font-black text-neutral-900 text-base">
                <SlidersHorizontal className="size-5 text-primary" />
                <span>Flight Filters</span>
              </div>
              <div className="flex items-center gap-2">
                {(selectedAirlineFilter || timeSlotFilter || stopsFilter !== null) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAirlineFilter(null)
                      setTimeSlotFilter(null)
                      setStopsFilter(null)
                      setMaxPrice(maxFlightPrice)
                    }}
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="size-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-800 cursor-pointer"
                  aria-label="Close Filters"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider block">
                Max Price Range
              </span>
              <div className="flex items-center justify-between text-xs font-black text-neutral-800">
                <span>৳ {minFlightPrice.toLocaleString()}</span>
                <span className="text-primary font-black">৳ {maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={minFlightPrice}
                max={maxFlightPrice}
                step={250}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            {/* Departure Time Slots */}
            <div className="space-y-3 border-t border-neutral-100 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Departure Time
                </span>
                <button
                  type="button"
                  onClick={() => setTimeSlotFilter(null)}
                  className={`text-[11px] font-bold ${
                    timeSlotFilter === null ? "text-primary" : "text-neutral-400"
                  }`}
                >
                  Anytime
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "night", label: "Night", time: "00:00–06:00", icon: Moon },
                  { id: "morning", label: "Morning", time: "06:01–12:00", icon: Sunrise },
                  { id: "afternoon", label: "Afternoon", time: "12:01–18:00", icon: Sun },
                  { id: "evening", label: "Evening", time: "18:01–23:59", icon: Sunset },
                ].map((slot) => {
                  const Icon = slot.icon
                  const isSelected = timeSlotFilter === slot.id
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setTimeSlotFilter(isSelected ? null : slot.id)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary shadow-xs font-bold"
                          : "border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-neutral-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Icon className="size-3.5 text-neutral-500" />
                        <span className="text-xs font-bold leading-tight">{slot.label}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {slot.time}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Stops */}
            <div className="space-y-3 border-t border-neutral-100 pt-4">
              <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider block">
                Stops
              </span>
              <div className="flex flex-col gap-2">
                {[
                  { stops: 0, label: "Non stop" },
                  { stops: 1, label: "1 Stop" },
                  { stops: 2, label: "2+ Stops" },
                ].map((s) => {
                  const isChecked = stopsFilter === s.stops
                  return (
                    <button
                      key={s.stops}
                      type="button"
                      onClick={() => setStopsFilter(isChecked ? null : s.stops)}
                      className="flex items-center justify-between py-1 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`size-4 rounded-md border flex items-center justify-center transition-colors ${
                            isChecked
                              ? "bg-primary border-primary text-white"
                              : "border-neutral-300"
                          }`}
                        >
                          {isChecked && <Check className="size-3 stroke-[3]" />}
                        </span>
                        <span className="text-xs font-semibold text-neutral-700">
                          {s.label}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Apply Button */}
            <div className="pt-2">
              <Button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-white font-extrabold text-sm"
              >
                Apply Filters ({filteredFlights.length} Flights Found)
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default function SearchResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 space-y-4">
          <div className="size-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center animate-spin">
            <Plane className="size-6" />
          </div>
          <p className="text-sm font-bold text-neutral-600">Connecting to Sabre GDS Engine...</p>
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  )
}
