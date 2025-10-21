"use client"

import { BookingProgress } from "@/components/booking/booking-progress"
import { ReviewStep } from "@/components/booking/review-step"
import { PassengerStep } from "@/components/booking/passenger-step"
import { AddOnsStep } from "@/components/booking/addons-step"
import { PaymentStep } from "@/components/booking/payment-step"
import { ConfirmationStep } from "@/components/booking/confirmation-step"
import { BookingStore } from "@/lib/booking-store"

function BookingContent() {
  const currentStep = BookingStore.useState((s) => s.currentStep)

  return (
    <>
      <BookingProgress currentStep={currentStep} />
      <div className="container mx-auto px-4 pb-12">
        {currentStep === 1 && <ReviewStep />}
        {currentStep === 2 && <PassengerStep />}
        {currentStep === 3 && <AddOnsStep />}
        {currentStep === 4 && <PaymentStep />}
        {currentStep === 5 && <ConfirmationStep />}
      </div>
    </>
  )
}

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-background">
      <BookingContent />
    </div>
  )
}
