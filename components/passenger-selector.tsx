"use client"

import { useState, useRef, useEffect } from "react"
import { Users, Plus, Minus } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { PassengerCount } from "@/lib/store"

interface PassengerSelectorProps {
  label: string
  value: PassengerCount
  onChange: (passengers: PassengerCount) => void
}

export function PassengerSelector({ label, value, onChange }: PassengerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const totalPassengers = value.adults + value.children + value.infants

  const updateCount = (type: keyof PassengerCount, delta: number) => {
    const newValue = Math.max(0, value[type] + delta)
    if (type === "adults" && newValue === 0 && (value.children > 0 || value.infants > 0)) {
      return // At least one adult required if there are children or infants
    }
    onChange({ ...value, [type]: newValue })
  }

  return (
    <div ref={wrapperRef} className="relative">
      <Label htmlFor={label} className="text-sm font-medium text-foreground mb-2 block">
        {label}
      </Label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-2.5 bg-background border border-input rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left"
      >
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">
          {totalPassengers} {totalPassengers === 1 ? "Passenger" : "Passengers"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg p-4">
          <div className="space-y-4">
            <PassengerRow
              label="Adults"
              description="12+ years"
              count={value.adults}
              onIncrement={() => updateCount("adults", 1)}
              onDecrement={() => updateCount("adults", -1)}
              minCount={value.children > 0 || value.infants > 0 ? 1 : 0}
            />
            <PassengerRow
              label="Children"
              description="2-11 years"
              count={value.children}
              onIncrement={() => updateCount("children", 1)}
              onDecrement={() => updateCount("children", -1)}
            />
            <PassengerRow
              label="Infants"
              description="Under 2 years"
              count={value.infants}
              onIncrement={() => updateCount("infants", 1)}
              onDecrement={() => updateCount("infants", -1)}
            />
          </div>
          <Button type="button" onClick={() => setIsOpen(false)} className="w-full mt-4" size="sm">
            Done
          </Button>
        </div>
      )}
    </div>
  )
}

function PassengerRow({
  label,
  description,
  count,
  onIncrement,
  onDecrement,
  minCount = 0,
}: {
  label: string
  description: string
  count: number
  onIncrement: () => void
  onDecrement: () => void
  minCount?: number
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-transparent"
          onClick={onDecrement}
          disabled={count <= minCount}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="text-sm font-medium w-6 text-center">{count}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-transparent"
          onClick={onIncrement}
          disabled={count >= 9}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
