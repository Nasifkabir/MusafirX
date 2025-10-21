"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { FlightStore } from "@/lib/store"
import { BookingStore } from "@/lib/booking-store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Download, Mail, Home } from "lucide-react"

export function ConfirmationStep() {
  const router = useRouter()
  const bookingReference = BookingStore.useState((s) => s.bookingReference)
  const contact = BookingStore.useState((s) => s.contact)
  const searchData = FlightStore.useState((s) => s.searchData)
  const selectedFlight = FlightStore.useState((s) => s.selectedFlight)

  useEffect(() => {
    // Reset booking store after a delay
    const timer = setTimeout(() => {
      // Keep the booking reference for display but reset other data
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleGoHome = () => {
    // Reset stores
    BookingStore.update((s) => {
      s.currentStep = 1
      s.passengers = []
      s.addOns = {
        meals: [],
        baggage: [],
        seats: [],
        insurance: false,
      }
      s.payment = null
      s.bookingReference = null
    })
    router.push("/")
  }

  if (!bookingReference || !selectedFlight) return null

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="p-8 text-center">
        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h2>
        <p className="text-lg text-muted-foreground mb-6">Your flight has been successfully booked</p>

        <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-6 mb-6">
          <p className="text-sm text-muted-foreground mb-2">Booking Reference</p>
          <p className="text-3xl font-bold text-primary tracking-wider">{bookingReference}</p>
        </div>

        <div className="text-left space-y-4 mb-6">
          <div className="flex justify-between py-3 border-b">
            <span className="text-muted-foreground">Flight</span>
            <span className="font-semibold text-foreground">
              {selectedFlight.airline} {selectedFlight.flightNumber}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b">
            <span className="text-muted-foreground">Route</span>
            <span className="font-semibold text-foreground">
              {searchData.origin?.code} → {searchData.destination?.code}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b">
            <span className="text-muted-foreground">Date</span>
            <span className="font-semibold text-foreground">
              {searchData.departureDate?.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-muted-foreground">Email</span>
            <span className="font-semibold text-foreground">{contact.email}</span>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground text-left">
              A confirmation email with your e-ticket has been sent to <strong>{contact.email}</strong>. Please check
              your inbox and spam folder.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" size="lg" className="flex-1 bg-transparent" disabled>
            <Download className="mr-2 h-5 w-5" />
            Download E-Ticket
          </Button>
          <Button size="lg" className="flex-1 bg-gradient-to-r from-primary to-accent" onClick={handleGoHome}>
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-primary/5 border-primary/20">
        <h3 className="font-semibold text-foreground mb-3">Important Information</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Please arrive at the airport at least 2 hours before departure for domestic flights</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Carry a valid government-issued photo ID for check-in</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Web check-in opens 48 hours before departure</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>For any changes or cancellations, contact our support team</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
