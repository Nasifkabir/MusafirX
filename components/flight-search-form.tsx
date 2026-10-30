"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FlightStore, type FlightSearchData, type Airport } from "@/lib/store"
import { AIRPORTS } from "@/lib/airports"
import { AirportSelector } from "./airport-selector"
import { DateSelector } from "./date-selector"
import { PassengerSelector } from "./passenger-selector"
import { Button } from "@/components/ui/button"
import { ArrowLeftRight, Search, Plane, Stamp, Hotel, Palmtree } from "lucide-react"

interface FlightSearchFormProps {
  variant?: "hero" | "compact"
  onSearchSubmitted?: () => void
}

export function FlightSearchForm({
  variant = "hero",
  onSearchSubmitted,
}: FlightSearchFormProps) {
  const router = useRouter()
  const searchData = FlightStore.useState((s) => s.searchData)
  const [activeTab, setActiveTab] = useState<"flight" | "visa" | "hotel" | "holiday">("flight")
  const [cabinClass, setCabinClass] = useState<string>("Economy")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Default to DAC -> CXB (Dhaka to Cox's Bazar) if null
  const defaultOrigin: Airport =
    searchData.origin || AIRPORTS.find((a) => a.code === "DAC") || AIRPORTS[0]
  const defaultDest: Airport =
    searchData.destination || AIRPORTS.find((a) => a.code === "CXB") || AIRPORTS[1]

  const handleFlightTypeChange = (type: FlightSearchData["flightType"]) => {
    FlightStore.update((s) => {
      s.searchData.flightType = type
      if (type === "round-trip" && !s.searchData.returnDate) {
        const base = s.searchData.departureDate ? new Date(s.searchData.departureDate) : new Date()
        const ret = new Date(base)
        ret.setDate(ret.getDate() + 3)
        ret.setHours(12, 0, 0, 0)
        s.searchData.returnDate = ret
      } else if (type === "one-way") {
        s.searchData.returnDate = null
      }
    })
  }

  const handleSwapAirports = () => {
    FlightStore.update((s) => {
      const temp = s.searchData.origin || defaultOrigin
      s.searchData.origin = s.searchData.destination || defaultDest
      s.searchData.destination = temp
    })
  }

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    const origin = searchData.origin || defaultOrigin
    const destination = searchData.destination || defaultDest
    const depDate = searchData.departureDate || new Date()

    if (origin.code === destination.code) {
      setErrors({ destination: "Origin and destination cannot be identical" })
      return
    }

    const depIso = depDate instanceof Date
      ? depDate.toISOString().split("T")[0]
      : String(depDate).split("T")[0]

    FlightStore.update((s) => {
      s.searchData.origin = origin
      s.searchData.destination = destination
      s.searchData.departureDate = depDate
    })

    if (onSearchSubmitted) {
      onSearchSubmitted()
    }

    setErrors({})
    router.push(
      `/flight/search?from=${origin.code}&to=${destination.code}&date=${depIso}&type=${searchData.flightType}&ts=${Date.now()}`
    )
  }

  const isHero = variant === "hero"

  return (
    <div className="w-full">
      {/* Product Category Tabs on Top - Executive Segmented Control */}
      {isHero && (
        <div className="flex justify-start sm:justify-center -mb-5 relative z-20 max-w-full px-1 overflow-x-auto no-scrollbar">
          <div className="inline-flex items-center gap-1 sm:gap-1.5 bg-white/95 backdrop-blur-md p-1 sm:p-1.5 rounded-2xl shadow-xl border border-neutral-200/80 max-w-full shrink-0">
            {[
              { id: "flight", label: "Flights", icon: Plane, badge: "Sabre Live" },
              { id: "visa", label: "Visas", icon: Stamp, badge: "99% Success" },
              { id: "hotel", label: "Hotels", icon: Hotel, badge: "Best Fares" },
              { id: "holiday", label: "Holidays", icon: Palmtree, badge: "Curated" },
            ].map((tab) => {
              const Icon = tab.icon
              const isSelected = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 cursor-pointer shrink-0 ${
                    isSelected
                      ? "bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-md shadow-blue-700/25"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70"
                  }`}
                >
                  <Icon className="size-4" />
                  <span>{tab.label}</span>
                  {isSelected && (
                    <span className="hidden sm:inline text-[9px] uppercase tracking-wider font-extrabold bg-white/20 text-white px-1.5 py-0.5 rounded-md">
                      {tab.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Main Search Card */}
      <div
        className={`bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/80 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.12)] p-3.5 sm:p-5 md:p-8 relative z-10 max-w-full overflow-hidden ${
          isHero ? "pt-7 sm:pt-10" : ""
        }`}
      >
        <form onSubmit={handleSearch} className="space-y-4 sm:space-y-5">
          {/* Top Options: Flight Type + Class */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-neutral-100 pb-3 sm:pb-4">
            {/* Trip Types with clear active pills */}
            <div className="grid grid-cols-3 w-full sm:w-auto items-center gap-1 bg-neutral-100/90 p-1 rounded-2xl">
              {[
                { id: "one-way", label: "One Way" },
                { id: "round-trip", label: "Round Trip" },
                { id: "multi-city", label: "Multi City" },
              ].map((type) => {
                const isSelected = searchData.flightType === type.id
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleFlightTypeChange(type.id as any)}
                    className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white text-neutral-900 shadow-xs"
                        : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    <span
                      className={`size-3 sm:size-3.5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-neutral-400"
                      }`}
                    >
                      {isSelected && <span className="size-1 sm:size-1.5 rounded-full bg-white" />}
                    </span>
                    <span className="truncate">{type.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Cabin Class Selection */}
            <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-2">
              <span className="text-xs font-semibold text-neutral-400 shrink-0">Class:</span>
              <div className="grid grid-cols-3 flex-1 sm:flex-initial sm:flex gap-1 bg-neutral-100 p-1 rounded-xl">
                {["Economy", "Premium", "Business"].map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setCabinClass(cls)}
                    className={`px-2 sm:px-3 py-1 text-center rounded-lg text-xs font-bold transition-all truncate ${
                      cabinClass === cls
                        ? "bg-white text-neutral-900 shadow-sm"
                        : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Origin Airport */}
            <div className="md:col-span-3">
              <AirportSelector
                label="From"
                value={searchData.origin || defaultOrigin}
                onChange={(airport) => {
                  FlightStore.update((s) => {
                    s.searchData.origin = airport
                  })
                }}
                excludeAirport={searchData.destination || defaultDest}
              />
            </div>

            {/* Swap Button */}
            <div className="flex justify-center -my-1 md:my-0 md:-mx-3 z-10 md:col-span-1">
              <button
                type="button"
                onClick={handleSwapAirports}
                aria-label="Swap origin and destination"
                className="size-9 rounded-full bg-white border border-neutral-200 shadow-sm hover:border-primary hover:text-primary hover:shadow-md flex items-center justify-center transition-all duration-200 active:rotate-180 cursor-pointer"
              >
                <ArrowLeftRight className="size-4" />
              </button>
            </div>

            {/* Destination Airport */}
            <div className="md:col-span-3">
              <AirportSelector
                label="To"
                value={searchData.destination || defaultDest}
                onChange={(airport) => {
                  FlightStore.update((s) => {
                    s.searchData.destination = airport
                  })
                }}
                error={errors.destination}
                excludeAirport={searchData.origin || defaultOrigin}
              />
            </div>

            {/* Dates: Departure + Return */}
            <div className="md:col-span-3">
              <DateSelector
                flightType={searchData.flightType}
                departureDate={searchData.departureDate}
                returnDate={searchData.returnDate}
                onDepartureChange={(date) => {
                  FlightStore.update((s) => {
                    s.searchData.departureDate = date
                  })
                }}
                onReturnChange={(date) => {
                  FlightStore.update((s) => {
                    s.searchData.returnDate = date
                  })
                }}
                onFlightTypeChange={(type) => {
                  FlightStore.update((s) => {
                    s.searchData.flightType = type
                  })
                }}
              />
            </div>

            {/* Passengers & Travellers */}
            <div className="md:col-span-2">
              <PassengerSelector
                passengers={searchData.passengers}
                onChange={(passengers) => {
                  FlightStore.update((s) => {
                    s.searchData.passengers = passengers
                  })
                }}
              />
            </div>
          </div>

          {/* Bottom Action Bar: Fare Tags + Executive Search Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pt-2 border-t border-neutral-100">
            <div className="flex items-center gap-2 sm:gap-3 text-xs text-neutral-500 font-medium">
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 sm:px-3 py-1 rounded-xl font-bold border border-emerald-200/60 text-[11px] sm:text-xs">
                <span className="size-1.5 rounded-full bg-emerald-600" />
                Best Fare Guarantee
              </span>
              <span className="hidden sm:inline text-neutral-400">• Direct Sabre GDS Bargain Finder Max</span>
            </div>

            <Button
              type="submit"
              onClick={handleSearch}
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 hover:from-blue-800 hover:to-indigo-900 text-white font-extrabold px-8 py-4 rounded-2xl shadow-xl shadow-blue-700/25 hover:shadow-2xl hover:shadow-blue-700/35 transition-all duration-300 text-sm md:text-base flex items-center justify-center gap-2.5 group cursor-pointer border border-blue-600/30"
            >
              <Search className="size-4 md:size-5 group-hover:scale-110 transition-transform" />
              <span>Search Available Flights</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
