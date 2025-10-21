"use client"

import { Label } from "@/components/ui/label"

import { BookingStore } from "@/lib/booking-store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, ArrowLeft, Utensils, Luggage, Armchair, Shield } from "lucide-react"

export function AddOnsStep() {
  const addOns = BookingStore.useState((s) => s.addOns)

  const handleContinue = () => {
    BookingStore.update((s) => {
      s.currentStep = 4
    })
  }

  const handleBack = () => {
    BookingStore.update((s) => {
      s.currentStep = 2
    })
  }

  const toggleInsurance = () => {
    BookingStore.update((s) => {
      s.addOns.insurance = !s.addOns.insurance
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Enhance Your Journey</h2>
        <p className="text-muted-foreground">Add extra services to make your trip more comfortable</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meals */}
        <Card className="p-6 hover:shadow-lg transition-all">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Utensils className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">In-Flight Meals</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Pre-order your preferred meal and enjoy a delicious dining experience
              </p>
              <p className="text-sm font-semibold text-foreground">Starting from ₹350</p>
              <Button variant="outline" size="sm" className="mt-3 bg-transparent" disabled>
                Add Meals (Coming Soon)
              </Button>
            </div>
          </div>
        </Card>

        {/* Extra Baggage */}
        <Card className="p-6 hover:shadow-lg transition-all">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Luggage className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">Extra Baggage</h3>
              <p className="text-sm text-muted-foreground mb-3">Add extra baggage allowance for your convenience</p>
              <p className="text-sm font-semibold text-foreground">Starting from ₹500 per 5kg</p>
              <Button variant="outline" size="sm" className="mt-3 bg-transparent" disabled>
                Add Baggage (Coming Soon)
              </Button>
            </div>
          </div>
        </Card>

        {/* Seat Selection */}
        <Card className="p-6 hover:shadow-lg transition-all">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <Armchair className="h-6 w-6 text-secondary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">Seat Selection</h3>
              <p className="text-sm text-muted-foreground mb-3">Choose your preferred seat for a comfortable journey</p>
              <p className="text-sm font-semibold text-foreground">Starting from ₹200</p>
              <Button variant="outline" size="sm" className="mt-3 bg-transparent" disabled>
                Select Seats (Coming Soon)
              </Button>
            </div>
          </div>
        </Card>

        {/* Travel Insurance */}
        <Card className="p-6 hover:shadow-lg transition-all border-2 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">Travel Insurance</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Protect your trip with comprehensive travel insurance
              </p>
              <p className="text-sm font-semibold text-foreground mb-3">₹299 per person</p>
              <div className="flex items-center gap-2">
                <Checkbox id="insurance" checked={addOns.insurance} onCheckedChange={toggleInsurance} />
                <Label htmlFor="insurance" className="text-sm font-medium cursor-pointer">
                  Add travel insurance
                </Label>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" size="lg" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        <Button size="lg" onClick={handleContinue} className="bg-gradient-to-r from-primary to-accent">
          Continue to Payment
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
