"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FlightStore, type FlightSearchData } from "@/lib/store"
import { saveRecentSearch } from "@/lib/recent-searches"
import { AirportSelector } from "./airport-selector"
import { DateSelector } from "./date-selector"
import { PassengerSelector } from "./passenger-selector"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search } from "lucide-react"

interface FlightSearchFormProps {
  variant?: "hero" | "compact"
}

export function FlightSearchForm({ variant = "hero" }: FlightSearchFormProps) {
  const router = useRouter()
  const searchData = FlightStore.useState((s) => s.searchData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleFlightTypeChange = (type: FlightSearchData["flightType"]) => {
    FlightStore.update((s) => {
      s.searchData.flightType = type
    })
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (searchData.flightType === "one-way") {
      if (!searchData.origin) {
        newErrors.origin = "Please select origin airport"
      }
      if (!searchData.destination) {
        newErrors.destination = "Please select destination airport"
      }
      if (searchData.origin && searchData.destination && searchData.origin.code === searchData.destination.code) {
        newErrors.destination = "Origin and destination cannot be the same"
      }
      if (!searchData.departureDate) {
        newErrors.departureDate = "Please select departure date"
      }
      if (searchData.departureDate) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (searchData.departureDate < today) {
          newErrors.departureDate = "Departure date must be today or in the future"
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (searchData.flightType === "one-way") {
      if (validateForm()) {
        if (searchData.origin && searchData.destination && searchData.departureDate) {
          saveRecentSearch({
            origin: searchData.origin,
            destination: searchData.destination,
            departureDate: searchData.departureDate,
            passengers: searchData.passengers,
          })
        }
        router.push("/flight/search")
      }
    }
  }

  const isHero = variant === "hero"

  return (
    <Card
      className={
        isHero ? "p-6 md:p-8 shadow-2xl border-2 border-white/20 bg-white/95 backdrop-blur-sm" : "p-4 shadow-lg"
      }
    >
      <form onSubmit={handleSearch} className="space-y-6">
        {/* Flight Type Selector */}
        <div className="flex gap-2 flex-wrap">
          {(["one-way", "round-trip", "multi-city"] as const).map((type) => (
            <Button
              key={type}
              type="button"
              variant={searchData.flightType === type ? "default" : "outline"}
              size="sm"
              onClick={() => handleFlightTypeChange(type)}
              className={
                searchData.flightType === type
                  ? "capitalize bg-gradient-to-r from-primary to-accent text-white shadow-md"
                  : "capitalize hover:border-primary/50"
              }
            >
              {type.replace("-", " ")}
            </Button>
          ))}
        </div>

        {/* One-way Form */}
        {searchData.flightType === "one-way" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AirportSelector
              label="From"
              value={searchData.origin}
              onChange={(airport) => {
                FlightStore.update((s) => {
                  s.searchData.origin = airport
                })
                setErrors((prev) => ({ ...prev, origin: "" }))
              }}
              placeholder="Origin airport"
              error={errors.origin}
              excludeAirport={searchData.destination}
            />
            <AirportSelector
              label="To"
              value={searchData.destination}
              onChange={(airport) => {
                FlightStore.update((s) => {
                  s.searchData.destination = airport
                })
                setErrors((prev) => ({ ...prev, destination: "" }))
              }}
              placeholder="Destination airport"
              error={errors.destination}
              excludeAirport={searchData.origin}
            />
            <DateSelector
              label="Departure"
              value={searchData.departureDate}
              onChange={(date) => {
                FlightStore.update((s) => {
                  s.searchData.departureDate = date
                })
                setErrors((prev) => ({ ...prev, departureDate: "" }))
              }}
              error={errors.departureDate}
            />
            <PassengerSelector
              label="Passengers"
              value={searchData.passengers}
              onChange={(passengers) => {
                FlightStore.update((s) => {
                  s.searchData.passengers = passengers
                })
              }}
            />
          </div>
        )}

        {/* Round-trip Form (UI Only) */}
        {searchData.flightType === "round-trip" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <AirportSelector
              label="From"
              value={searchData.origin}
              onChange={(airport) => {
                FlightStore.update((s) => {
                  s.searchData.origin = airport
                })
              }}
              placeholder="Origin airport"
            />
            <AirportSelector
              label="To"
              value={searchData.destination}
              onChange={(airport) => {
                FlightStore.update((s) => {
                  s.searchData.destination = airport
                })
              }}
              placeholder="Destination airport"
            />
            <DateSelector
              label="Departure"
              value={searchData.departureDate}
              onChange={(date) => {
                FlightStore.update((s) => {
                  s.searchData.departureDate = date
                })
              }}
            />
            <DateSelector
              label="Return"
              value={searchData.returnDate}
              onChange={(date) => {
                FlightStore.update((s) => {
                  s.searchData.returnDate = date
                })
              }}
              minDate={searchData.departureDate || undefined}
            />
            <PassengerSelector
              label="Passengers"
              value={searchData.passengers}
              onChange={(passengers) => {
                FlightStore.update((s) => {
                  s.searchData.passengers = passengers
                })
              }}
            />
          </div>
        )}

        {/* Multi-city Form (UI Only) */}
        {searchData.flightType === "multi-city" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AirportSelector
                label="From"
                value={searchData.origin}
                onChange={(airport) => {
                  FlightStore.update((s) => {
                    s.searchData.origin = airport
                  })
                }}
                placeholder="Origin airport"
              />
              <AirportSelector
                label="To"
                value={searchData.destination}
                onChange={(airport) => {
                  FlightStore.update((s) => {
                    s.searchData.destination = airport
                  })
                }}
                placeholder="Destination airport"
              />
              <DateSelector
                label="Departure"
                value={searchData.departureDate}
                onChange={(date) => {
                  FlightStore.update((s) => {
                    s.searchData.departureDate = date
                  })
                }}
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <PassengerSelector
                label="Passengers"
                value={searchData.passengers}
                onChange={(passengers) => {
                  FlightStore.update((s) => {
                    s.searchData.passengers = passengers
                  })
                }}
              />
            </div>
          </div>
        )}

        {/* Search Button */}
        <Button
          type="submit"
          size={isHero ? "lg" : "default"}
          className="w-full md:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg text-lg font-semibold"
          disabled={searchData.flightType !== "one-way"}
        >
          <Search className="h-5 w-5 mr-2" />
          Search Flights
        </Button>

        {searchData.flightType !== "one-way" && (
          <p className="text-sm text-muted-foreground">
            {searchData.flightType === "round-trip" ? "Round-trip" : "Multi-city"} search is currently UI only
          </p>
        )}
      </form>
    </Card>
  )
}
