"use client"

import { useState, useRef, useEffect } from "react"
import type { Airport } from "@/lib/store"
import { searchAirports, AIRPORTS } from "@/lib/airports"
import { Plane, MapPin } from "lucide-react"
import { Label } from "@/components/ui/label"

interface AirportSelectorProps {
  label: string
  value: Airport | null
  onChange: (airport: Airport | null) => void
  placeholder?: string
  error?: string
  excludeAirport?: Airport | null
}

export function AirportSelector({
  label,
  value,
  onChange,
  placeholder = "Select Airport...",
  error,
  excludeAirport,
}: AirportSelectorProps) {
  const [query, setQuery] = useState(value ? `${value.city} (${value.code})` : "")
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value) {
      setQuery(`${value.city} (${value.code})`)
    } else {
      setQuery("")
    }
  }, [value])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [])

  const suggestions = (query.trim().length >= 1 ? searchAirports(query) : AIRPORTS.slice(0, 8)).filter(
    (airport) => !excludeAirport || airport.code !== excludeAirport.code
  )

  const handleSelectAirport = (airport: Airport) => {
    setQuery(`${airport.city} (${airport.code})`)
    onChange(airport)
    setIsOpen(false)
  }

  return (
    <div ref={wrapperRef} className="relative">
      <Label className="text-xs font-bold text-neutral-500 mb-1.5 block tracking-wider uppercase">
        {label}
      </Label>

      <div
        onClick={() => {
          setIsOpen(true)
          setQuery("")
        }}
        className={`group relative flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100/80 border transition-all cursor-pointer ${
          error ? "border-red-500 bg-red-50/20" : "border-neutral-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
        }`}
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 w-full">
          <div className="size-8 rounded-xl bg-primary/8 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Plane className="size-4 transform -rotate-45" />
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            {value ? (
              <>
                <div className="flex items-baseline gap-1.5 truncate">
                  <span className="text-sm sm:text-base font-bold text-neutral-900 leading-tight">
                    {value.city}
                  </span>
                  <span className="text-xs font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded-md shrink-0">
                    {value.code}
                  </span>
                </div>
                <span className="text-xs text-neutral-400 truncate">
                  {value.name}
                </span>
              </>
            ) : (
              <span className="text-sm font-semibold text-neutral-400">{placeholder}</span>
            )}
          </div>
        </div>
      </div>

      {error && <p className="text-xs font-semibold text-red-500 mt-1">{error}</p>}

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-2xl shadow-2xl max-h-72 overflow-y-auto p-1.5 divide-y divide-neutral-100 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-2 sticky top-0 bg-white z-10 border-b border-neutral-100">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type city, country, or 3-letter IATA code..."
              className="w-full text-xs font-medium px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary"
            />
          </div>

          <div className="p-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1.5 block">
              Suggested Airports
            </span>
            {suggestions.map((airport) => (
              <button
                key={airport.code}
                type="button"
                onClick={() => handleSelectAirport(airport)}
                className="w-full px-3 py-2.5 text-left hover:bg-primary/5 rounded-xl transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <MapPin className="size-4 text-neutral-400 group-hover:text-primary transition-colors shrink-0" />
                  <div className="truncate">
                    <div className="font-bold text-xs md:text-sm text-neutral-900 leading-tight">
                      {airport.city}, {airport.country}
                    </div>
                    <div className="text-[11px] text-neutral-400 truncate">{airport.name}</div>
                  </div>
                </div>
                <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-lg shrink-0">
                  {airport.code}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
