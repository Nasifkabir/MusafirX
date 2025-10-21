"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HotelStore } from "@/lib/hotel-store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Search, MapPin, CalendarIcon, Users } from "lucide-react"
import { format } from "date-fns"

export function HotelSearchForm() {
  const router = useRouter()
  const searchData = HotelStore.useState((s) => s.searchData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!searchData.destination) {
      newErrors.destination = "Please enter a destination"
    }
    if (!searchData.checkIn) {
      newErrors.checkIn = "Please select check-in date"
    }
    if (!searchData.checkOut) {
      newErrors.checkOut = "Please select check-out date"
    }
    if (searchData.checkIn && searchData.checkOut && searchData.checkIn >= searchData.checkOut) {
      newErrors.checkOut = "Check-out must be after check-in"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      router.push("/hotels/search")
    }
  }

  return (
    <Card className="p-6 md:p-8 shadow-2xl border-2 border-white/20 bg-white/95 backdrop-blur-sm">
      <form onSubmit={handleSearch} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="destination"
                placeholder="City or hotel name"
                value={searchData.destination}
                onChange={(e) => {
                  HotelStore.update((s) => {
                    s.searchData.destination = e.target.value
                  })
                  setErrors((prev) => ({ ...prev, destination: "" }))
                }}
                className={`pl-10 ${errors.destination ? "border-red-500" : ""}`}
              />
            </div>
            {errors.destination && <p className="text-xs text-red-500">{errors.destination}</p>}
          </div>

          {/* Check-in */}
          <div className="space-y-2">
            <Label>Check-in</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${errors.checkIn ? "border-red-500" : ""}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {searchData.checkIn ? format(searchData.checkIn, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={searchData.checkIn || undefined}
                  onSelect={(date) => {
                    HotelStore.update((s) => {
                      s.searchData.checkIn = date || null
                    })
                    setErrors((prev) => ({ ...prev, checkIn: "" }))
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.checkIn && <p className="text-xs text-red-500">{errors.checkIn}</p>}
          </div>

          {/* Check-out */}
          <div className="space-y-2">
            <Label>Check-out</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${errors.checkOut ? "border-red-500" : ""}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {searchData.checkOut ? format(searchData.checkOut, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={searchData.checkOut || undefined}
                  onSelect={(date) => {
                    HotelStore.update((s) => {
                      s.searchData.checkOut = date || null
                    })
                    setErrors((prev) => ({ ...prev, checkOut: "" }))
                  }}
                  disabled={(date) => date < (searchData.checkIn || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.checkOut && <p className="text-xs text-red-500">{errors.checkOut}</p>}
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <Label>Guests</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <Users className="mr-2 h-4 w-4" />
                  {searchData.guests.adults + searchData.guests.children} Guest(s)
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Adults</p>
                      <p className="text-xs text-muted-foreground">Ages 13 or above</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          HotelStore.update((s) => {
                            if (s.searchData.guests.adults > 1) {
                              s.searchData.guests.adults--
                            }
                          })
                        }}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{searchData.guests.adults}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          HotelStore.update((s) => {
                            if (s.searchData.guests.adults < 10) {
                              s.searchData.guests.adults++
                            }
                          })
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Children</p>
                      <p className="text-xs text-muted-foreground">Ages 0-12</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          HotelStore.update((s) => {
                            if (s.searchData.guests.children > 0) {
                              s.searchData.guests.children--
                            }
                          })
                        }}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{searchData.guests.children}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          HotelStore.update((s) => {
                            if (s.searchData.guests.children < 10) {
                              s.searchData.guests.children++
                            }
                          })
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full md:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg text-lg font-semibold"
        >
          <Search className="h-5 w-5 mr-2" />
          Search Hotels
        </Button>
      </form>
    </Card>
  )
}
