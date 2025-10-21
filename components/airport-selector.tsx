"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { Airport } from "@/lib/store"
import { searchAirports } from "@/lib/airports"
import { Plane } from "lucide-react"
import { Input } from "@/components/ui/input"
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
  placeholder = "Search airport...",
  error,
  excludeAirport,
}: AirportSelectorProps) {
  const [query, setQuery] = useState(value ? `${value.city} (${value.code})` : "")
  const [suggestions, setSuggestions] = useState<Airport[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    setIsOpen(true)

    if (newQuery.length >= 2) {
      const results = searchAirports(newQuery).filter(
        (airport) => !excludeAirport || airport.code !== excludeAirport.code,
      )
      setSuggestions(results)
    } else {
      setSuggestions([])
    }

    if (!newQuery) {
      onChange(null)
    }
  }

  const handleSelectAirport = (airport: Airport) => {
    setQuery(`${airport.city} (${airport.code})`)
    onChange(airport)
    setIsOpen(false)
    setSuggestions([])
  }

  return (
    <div ref={wrapperRef} className="relative">
      <Label htmlFor={label} className="text-sm font-medium text-foreground mb-2 block">
        {label}
      </Label>
      <div className="relative">
        <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id={label}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className={`pl-10 ${error ? "border-destructive" : ""}`}
        />
      </div>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {suggestions.map((airport) => (
            <button
              key={airport.code}
              type="button"
              onClick={() => handleSelectAirport(airport)}
              className="w-full px-4 py-3 text-left hover:bg-accent hover:text-accent-foreground transition-colors border-b border-border last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{airport.city}</div>
                  <div className="text-xs text-muted-foreground">{airport.name}</div>
                </div>
                <div className="text-sm font-semibold text-primary">{airport.code}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
