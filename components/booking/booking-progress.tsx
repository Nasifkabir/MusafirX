"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookingProgressProps {
  currentStep: number
}

const steps = [
  { number: 1, label: "Review" },
  { number: 2, label: "Passengers" },
  { number: 3, label: "Add-ons" },
  { number: 4, label: "Payment" },
  { number: 5, label: "Confirmation" },
]

export function BookingProgress({ currentStep }: BookingProgressProps) {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center font-semibold transition-all",
                  currentStep > step.number
                    ? "bg-primary text-white"
                    : currentStep === step.number
                      ? "bg-primary text-white ring-4 ring-primary/20"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {currentStep > step.number ? <Check className="h-5 w-5" /> : step.number}
              </div>
              <span
                className={cn(
                  "text-xs mt-2 font-medium",
                  currentStep >= step.number ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn("h-1 flex-1 mx-2 transition-all", currentStep > step.number ? "bg-primary" : "bg-muted")}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
