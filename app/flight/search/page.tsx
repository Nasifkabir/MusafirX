"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { FlightStore } from "@/lib/store"
import { generateMockFlights } from "@/lib/mock-flights"
import { FlightSearchForm } from "@/components/flight-search-form"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plane, Clock, ArrowRight, ChevronLeft, Zap } from "lucide-react"

export default function SearchResultsPage() {
  const router = useRouter()
  const searchData = FlightStore.useState((s) => s.searchData)
  const searchResults = FlightStore.useState((s) => s.searchResults)

  useEffect(() => {
    if (!searchData.origin || !searchData.destination || !searchData.departureDate) {
      router.push("/")
      return
    }

    const flights = generateMockFlights(searchData.origin, searchData.destination, searchData.departureDate)

    FlightStore.update((s) => {
      s.searchResults = flights
    })
  }, [searchData, router])

  const formatDate = (date: Date | null) => {
    if (!date) return ""
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const handleSelectFlight = (flightId: string) => {
    const selectedFlight = searchResults.find((f) => f.id === flightId)
    if (selectedFlight) {
      FlightStore.update((s) => {
        s.selectedFlight = selectedFlight
      })
      router.push("/flight/booking")
    }
  }

  const totalPassengers = searchData.passengers.adults + searchData.passengers.children + searchData.passengers.infants

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      <header className="border-b border-border bg-gradient-to-r from-primary via-primary/90 to-accent shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
              className="shrink-0 text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-md">
                <Plane className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold text-xl text-white">SkyBook</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 flex items-center gap-3">
            <span className="text-primary">{searchData.origin?.city}</span>
            <ArrowRight className="h-8 w-8 text-accent" />
            <span className="text-accent">{searchData.destination?.city}</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            {formatDate(searchData.departureDate)} • {totalPassengers}{" "}
            {totalPassengers === 1 ? "Passenger" : "Passengers"}
          </p>
        </div>

        {/* Modify Search */}
        <div className="mb-8">
          <FlightSearchForm variant="compact" />
        </div>

        <div className="flex items-center justify-between mb-8 p-4 rounded-xl bg-gradient-to-r from-chart-2/10 to-chart-4/10 border border-chart-2/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-chart-2 to-chart-4 rounded-xl flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Available Flights</h2>
              <p className="text-sm text-muted-foreground">{searchResults.length} options found</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Sorted by: <span className="font-semibold text-primary">Best Price</span>
          </div>
        </div>

        <div className="space-y-6">
          {searchResults.map((flight, index) => {
            const gradients = [
              "from-primary/5 to-primary/10 border-primary/20",
              "from-accent/5 to-accent/10 border-accent/20",
              "from-chart-2/5 to-chart-2/10 border-chart-2/20",
              "from-chart-1/5 to-chart-1/10 border-chart-1/20",
            ]
            const gradient = gradients[index % gradients.length]

            return (
              <Card
                key={flight.id}
                className={`p-6 hover:shadow-2xl transition-all hover:-translate-y-1 bg-gradient-to-br ${gradient}`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex items-center gap-4 md:w-48">
                    <div className="h-14 w-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                      <Plane className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{flight.airline}</div>
                      <div className="text-xs text-muted-foreground font-medium">{flight.flightNumber}</div>
                    </div>
                  </div>

                  {/* Flight Details */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <div>
                      <div className="text-3xl font-bold text-primary">{flight.departureTime}</div>
                      <div className="text-sm text-muted-foreground font-medium">{flight.origin.code}</div>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                      <div className="text-sm font-medium text-muted-foreground mb-2">{flight.duration}</div>
                      <div className="w-full h-0.5 bg-gradient-to-r from-primary via-accent to-primary relative">
                        <ArrowRight className="h-5 w-5 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-full p-0.5" />
                      </div>
                      <div className="text-xs font-medium text-accent mt-2">
                        {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}
                      </div>
                    </div>

                    <div className="text-right md:text-left">
                      <div className="text-3xl font-bold text-accent">{flight.arrivalTime}</div>
                      <div className="text-sm text-muted-foreground font-medium">{flight.destination.code}</div>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-3 md:w-44 border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-6">
                    <div className="flex-1 md:flex-none text-left md:text-right">
                      <div className="text-xs text-muted-foreground mb-1 font-medium">From</div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        ৳{flight.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">per person</div>
                    </div>
                    <Button
                      size="lg"
                      onClick={() => handleSelectFlight(flight.id)}
                      className="shrink-0 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg"
                    >
                      Select Flight
                    </Button>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 pt-4 border-t border-border/50 flex flex-wrap gap-4 text-xs font-medium text-muted-foreground">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-background/50 rounded-full">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{flight.aircraft}</span>
                  </div>
                  <div className="px-3 py-1.5 bg-background/50 rounded-full">Economy Class</div>
                  <div className="px-3 py-1.5 bg-chart-4/20 text-chart-4 rounded-full">Refundable</div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* No Results */}
        {searchResults.length === 0 && (
          <Card className="p-16 text-center bg-gradient-to-br from-muted/50 to-background">
            <div className="h-20 w-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Plane className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">No flights found</h3>
            <p className="text-muted-foreground mb-8">Try adjusting your search criteria to find more options</p>
            <Button size="lg" onClick={() => router.push("/")} className="bg-gradient-to-r from-primary to-accent">
              Back to Search
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
