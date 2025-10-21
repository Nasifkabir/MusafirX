"use client"

import { useState } from "react"
import { FlightStore } from "@/lib/store"
import { BookingStore } from "@/lib/booking-store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, CreditCard, Smartphone, Building2, Wallet, Lock } from "lucide-react"

export function PaymentStep() {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "netbanking" | "wallet">("card")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    holder: "",
    expiry: "",
    cvv: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const searchData = FlightStore.useState((s) => s.searchData)
  const selectedFlight = FlightStore.useState((s) => s.selectedFlight)
  const addOns = BookingStore.useState((s) => s.addOns)
  const passengers = BookingStore.useState((s) => s.passengers)

  const handleBack = () => {
    BookingStore.update((s) => {
      s.currentStep = 3
    })
  }

  const validatePayment = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (paymentMethod === "card") {
      if (!cardDetails.number || cardDetails.number.length < 16) {
        newErrors.cardNumber = "Invalid card number"
      }
      if (!cardDetails.holder) {
        newErrors.cardHolder = "Card holder name is required"
      }
      if (!cardDetails.expiry || !/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
        newErrors.expiry = "Invalid expiry date (MM/YY)"
      }
      if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
        newErrors.cvv = "Invalid CVV"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePayment = () => {
    if (validatePayment()) {
      // Generate booking reference
      const reference = `SKY${Date.now().toString().slice(-8)}`

      BookingStore.update((s) => {
        s.payment = {
          method: paymentMethod,
          ...(paymentMethod === "card" && {
            cardNumber: cardDetails.number,
            cardHolder: cardDetails.holder,
            expiryDate: cardDetails.expiry,
            cvv: cardDetails.cvv,
          }),
        }
        s.bookingReference = reference
        s.currentStep = 5
      })
    }
  }

  if (!selectedFlight) return null

  const totalPassengers = searchData.passengers.adults + searchData.passengers.children + searchData.passengers.infants
  const baseFare = selectedFlight.price * totalPassengers
  const taxesAndFees = Math.round(baseFare * 0.12)
  const insuranceCost = addOns.insurance ? 299 * passengers.length : 0
  const totalAmount = baseFare + taxesAndFees + insuranceCost

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Payment Details</h2>
          <p className="text-muted-foreground">Choose your payment method and complete the booking</p>
        </div>

        {/* Payment Method Selection */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Select Payment Method</h3>
          <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span className="font-medium">Credit / Debit Card</span>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer opacity-50">
                <RadioGroupItem value="upi" id="upi" disabled />
                <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <span className="font-medium">UPI (Coming Soon)</span>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer opacity-50">
                <RadioGroupItem value="netbanking" id="netbanking" disabled />
                <Label htmlFor="netbanking" className="flex items-center gap-3 cursor-pointer flex-1">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span className="font-medium">Net Banking (Coming Soon)</span>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer opacity-50">
                <RadioGroupItem value="wallet" id="wallet" disabled />
                <Label htmlFor="wallet" className="flex items-center gap-3 cursor-pointer flex-1">
                  <Wallet className="h-5 w-5 text-primary" />
                  <span className="font-medium">Wallet (Coming Soon)</span>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </Card>

        {/* Card Details Form */}
        {paymentMethod === "card" && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Card Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, "")
                    if (value.length <= 16 && /^\d*$/.test(value)) {
                      setCardDetails({ ...cardDetails, number: value })
                      setErrors({ ...errors, cardNumber: "" })
                    }
                  }}
                  className={errors.cardNumber ? "border-red-500" : ""}
                />
                {errors.cardNumber && <p className="text-xs text-red-500">{errors.cardNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardHolder">Card Holder Name</Label>
                <Input
                  id="cardHolder"
                  placeholder="John Doe"
                  value={cardDetails.holder}
                  onChange={(e) => {
                    setCardDetails({ ...cardDetails, holder: e.target.value })
                    setErrors({ ...errors, cardHolder: "" })
                  }}
                  className={errors.cardHolder ? "border-red-500" : ""}
                />
                {errors.cardHolder && <p className="text-xs text-red-500">{errors.cardHolder}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "")
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + "/" + value.slice(2, 4)
                      }
                      if (value.length <= 5) {
                        setCardDetails({ ...cardDetails, expiry: value })
                        setErrors({ ...errors, expiry: "" })
                      }
                    }}
                    className={errors.expiry ? "border-red-500" : ""}
                  />
                  {errors.expiry && <p className="text-xs text-red-500">{errors.expiry}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="password"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "")
                      if (value.length <= 4) {
                        setCardDetails({ ...cardDetails, cvv: value })
                        setErrors({ ...errors, cvv: "" })
                      }
                    }}
                    className={errors.cvv ? "border-red-500" : ""}
                  />
                  {errors.cvv && <p className="text-xs text-red-500">{errors.cvv}</p>}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg flex items-start gap-3">
              <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Your payment information is encrypted and secure. We never store your card details.
              </p>
            </div>
          </Card>
        )}

        <div className="flex justify-between">
          <Button variant="outline" size="lg" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          <Button size="lg" onClick={handlePayment} className="bg-gradient-to-r from-primary to-accent">
            <Lock className="mr-2 h-5 w-5" />
            Pay ₹{totalAmount.toLocaleString()}
          </Button>
        </div>
      </div>

      {/* Price Summary */}
      <div className="lg:col-span-1">
        <Card className="p-6 sticky top-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Price Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Base Fare ({totalPassengers} pax)</span>
              <span className="font-medium text-foreground">₹{baseFare.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taxes & Fees</span>
              <span className="font-medium text-foreground">₹{taxesAndFees.toLocaleString()}</span>
            </div>
            {addOns.insurance && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Travel Insurance</span>
                <span className="font-medium text-foreground">₹{insuranceCost.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t pt-3 flex justify-between">
              <span className="font-bold text-foreground">Total Amount</span>
              <span className="font-bold text-xl text-primary">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
