"use client"

import { useState, useEffect } from "react"
import { FlightStore } from "@/lib/store"
import { BookingStore, type PassengerDetails } from "@/lib/booking-store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, ArrowLeft, User } from "lucide-react"

export function PassengerStep() {
  const searchData = FlightStore.useState((s) => s.searchData)
  const passengers = BookingStore.useState((s) => s.passengers)
  const contact = BookingStore.useState((s) => s.contact)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Initialize passengers if empty
    if (passengers.length === 0) {
      const newPassengers: PassengerDetails[] = []

      for (let i = 0; i < searchData.passengers.adults; i++) {
        newPassengers.push({
          id: `adult-${i}`,
          type: "adult",
          title: "",
          firstName: "",
          lastName: "",
          dateOfBirth: null,
          nationality: "",
          passportNumber: "",
          passportExpiry: null,
        })
      }

      for (let i = 0; i < searchData.passengers.children; i++) {
        newPassengers.push({
          id: `child-${i}`,
          type: "child",
          title: "",
          firstName: "",
          lastName: "",
          dateOfBirth: null,
          nationality: "",
          passportNumber: "",
          passportExpiry: null,
        })
      }

      for (let i = 0; i < searchData.passengers.infants; i++) {
        newPassengers.push({
          id: `infant-${i}`,
          type: "infant",
          title: "",
          firstName: "",
          lastName: "",
          dateOfBirth: null,
          nationality: "",
          passportNumber: "",
          passportExpiry: null,
        })
      }

      BookingStore.update((s) => {
        s.passengers = newPassengers
      })
    }
  }, [searchData.passengers, passengers.length])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate contact details
    if (!contact.email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!contact.phone) {
      newErrors.phone = "Phone number is required"
    }

    // Validate passengers
    passengers.forEach((passenger, index) => {
      if (!passenger.title) {
        newErrors[`${passenger.id}-title`] = "Title is required"
      }
      if (!passenger.firstName) {
        newErrors[`${passenger.id}-firstName`] = "First name is required"
      }
      if (!passenger.lastName) {
        newErrors[`${passenger.id}-lastName`] = "Last name is required"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (validateForm()) {
      BookingStore.update((s) => {
        s.currentStep = 3
      })
    }
  }

  const handleBack = () => {
    BookingStore.update((s) => {
      s.currentStep = 1
    })
  }

  const updatePassenger = (id: string, field: keyof PassengerDetails, value: any) => {
    BookingStore.update((s) => {
      const passenger = s.passengers.find((p) => p.id === id)
      if (passenger) {
        ;(passenger as any)[field] = value
      }
    })
    setErrors((prev) => ({ ...prev, [`${id}-${field}`]: "" }))
  }

  const updateContact = (field: keyof typeof contact, value: string) => {
    BookingStore.update((s) => {
      s.contact[field] = value
    })
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Passenger Details</h2>
        <p className="text-muted-foreground">Enter details for all passengers</p>
      </div>

      {/* Contact Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={contact.email}
              onChange={(e) => updateContact("email", e.target.value)}
              placeholder="your@email.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <div className="flex gap-2">
              <Select value={contact.countryCode} onValueChange={(value) => updateContact("countryCode", value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+91">+91</SelectItem>
                  <SelectItem value="+1">+1</SelectItem>
                  <SelectItem value="+44">+44</SelectItem>
                  <SelectItem value="+971">+971</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="phone"
                type="tel"
                value={contact.phone}
                onChange={(e) => updateContact("phone", e.target.value)}
                placeholder="1234567890"
                className={errors.phone ? "border-red-500 flex-1" : "flex-1"}
              />
            </div>
            {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
          </div>
        </div>
      </Card>

      {/* Passenger Details */}
      {passengers.map((passenger, index) => (
        <Card key={passenger.id} className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Passenger {index + 1} ({passenger.type})
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${passenger.id}-title`}>Title *</Label>
              <Select value={passenger.title} onValueChange={(value) => updatePassenger(passenger.id, "title", value)}>
                <SelectTrigger className={errors[`${passenger.id}-title`] ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mr">Mr</SelectItem>
                  <SelectItem value="Mrs">Mrs</SelectItem>
                  <SelectItem value="Ms">Ms</SelectItem>
                  <SelectItem value="Miss">Miss</SelectItem>
                </SelectContent>
              </Select>
              {errors[`${passenger.id}-title`] && (
                <p className="text-xs text-red-500">{errors[`${passenger.id}-title`]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${passenger.id}-firstName`}>First Name *</Label>
              <Input
                id={`${passenger.id}-firstName`}
                value={passenger.firstName}
                onChange={(e) => updatePassenger(passenger.id, "firstName", e.target.value)}
                placeholder="First name"
                className={errors[`${passenger.id}-firstName`] ? "border-red-500" : ""}
              />
              {errors[`${passenger.id}-firstName`] && (
                <p className="text-xs text-red-500">{errors[`${passenger.id}-firstName`]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${passenger.id}-lastName`}>Last Name *</Label>
              <Input
                id={`${passenger.id}-lastName`}
                value={passenger.lastName}
                onChange={(e) => updatePassenger(passenger.id, "lastName", e.target.value)}
                placeholder="Last name"
                className={errors[`${passenger.id}-lastName`] ? "border-red-500" : ""}
              />
              {errors[`${passenger.id}-lastName`] && (
                <p className="text-xs text-red-500">{errors[`${passenger.id}-lastName`]}</p>
              )}
            </div>
          </div>
        </Card>
      ))}

      <div className="flex justify-between">
        <Button variant="outline" size="lg" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        <Button size="lg" onClick={handleContinue} className="bg-gradient-to-r from-primary to-accent">
          Continue to Add-ons
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
