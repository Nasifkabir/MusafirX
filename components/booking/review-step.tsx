"use client"

import { FlightStore } from "@/lib/store"
import { BookingStore } from "@/lib/booking-store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plane, Calendar, Users, ArrowRight } from "lucide-react"

export function ReviewStep() {
  const searchData = FlightStore.useState((s) => s.searchData)
  const selectedFlight = FlightStore.useState((s) => s.selectedFlight)

  const handleContinue = () => {
    BookingStore.update((s) => {
      s.currentStep = 2
    })
  }

  if (!selectedFlight || !searchData.origin || !searchData.destination) {
    return <div>No flight selected</div>
  }

  const totalPassengers = searchData.passengers.adults + searchData.passengers.children + searchData.passengers.infants

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Review Your Flight</h2>
        <p className="text-muted-foreground">Please review your flight details before proceeding</p>
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">{selectedFlight.airline}</h3>
            <p className="text-sm text-muted-foreground">{selectedFlight.flightNumber}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">₹{selectedFlight.price.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">per person</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Plane className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Route</p>
              <p className="font-semibold text-foreground">
                {searchData.origin.code} → {searchData.destination.code}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {searchData.origin.city} to {searchData.destination.city}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Departure</p>
              <p className="font-semibold text-foreground">
                {searchData.departureDate?.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedFlight.departure} - {selectedFlight.arrival}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <Users className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Passengers</p>
              <p className="font-semibold text-foreground">{totalPassengers} Passenger(s)</p>
              <p className="text-xs text-muted-foreground mt-1">
                {searchData.passengers.adults > 0 && `${searchData.passengers.adults} Adult(s)`}
                {searchData.passengers.children > 0 && `, ${searchData.passengers.children} Child(ren)`}
                {searchData.passengers.infants > 0 && `, ${searchData.passengers.infants} Infant(s)`}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Base Fare ({totalPassengers} passenger(s))</span>
            <span className="font-semibold text-foreground">
              ₹{(selectedFlight.price * totalPassengers).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Taxes & Fees</span>
            <span className="font-semibold text-foreground">
              ₹{Math.round(selectedFlight.price * totalPassengers * 0.12).toLocaleString()}
            </span>
          </div>
          <div className="border-t pt-4 flex items-center justify-between">
            <span className="text-lg font-bold text-foreground">Total Amount</span>
            <span className="text-2xl font-bold text-primary">
              ₹{Math.round(selectedFlight.price * totalPassengers * 1.12).toLocaleString()}
            </span>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleContinue} className="bg-gradient-to-r from-primary to-accent">
          Continue to Passenger Details
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
