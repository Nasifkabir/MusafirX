"use client"

import { useState, useRef, useEffect } from "react"
import { Users, Plus, Minus } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { PassengerCount } from "@/lib/store"

interface PassengerSelectorProps {
  label?: string
  passengers?: PassengerCount
  value?: PassengerCount
  onChange: (passengers: PassengerCount) => void
}

export function PassengerSelector({
  label = "Travellers",
  passengers,
  value,
  onChange,
}: PassengerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const currentPassengers: PassengerCount = passengers || value || {
    adults: 1,
    children: 0,
    infants: 0,
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [])

  const totalPassengers =
    currentPassengers.adults + currentPassengers.children + currentPassengers.infants

  const updateCount = (type: keyof PassengerCount, delta: number) => {
    const newValue = Math.max(0, currentPassengers[type] + delta)
    if (
      type === "adults" &&
      newValue === 0 &&
      (currentPassengers.children > 0 || currentPassengers.infants > 0)
    ) {
      return
    }
    onChange({ ...currentPassengers, [type]: newValue })
  }

  return (
    <div ref={wrapperRef} className="relative">
      <Label className="text-xs font-bold text-neutral-500 mb-1.5 block tracking-wider uppercase">
        {label}
      </Label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200 transition-all text-left"
      >
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-xl bg-primary/8 text-primary flex items-center justify-center shrink-0">
            <Users className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-neutral-900 leading-tight">
              {totalPassengers} {totalPassengers === 1 ? "Traveller" : "Travellers"}
            </span>
            <span className="text-xs text-neutral-400">Economy</span>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 right-0 max-w-[calc(100vw-2rem)] w-72 mt-2 bg-white border border-neutral-200 rounded-2xl shadow-2xl p-4 divide-y divide-neutral-100 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Select Passengers
            </span>
          </div>

          <div className="py-3 space-y-4">
            <PassengerRow
              label="Adults"
              description="12+ years"
              count={currentPassengers.adults}
              onIncrement={() => updateCount("adults", 1)}
              onDecrement={() => updateCount("adults", -1)}
              minCount={
                currentPassengers.children > 0 || currentPassengers.infants > 0 ? 1 : 1
              }
            />
            <PassengerRow
              label="Children"
              description="2-11 years"
              count={currentPassengers.children}
              onIncrement={() => updateCount("children", 1)}
              onDecrement={() => updateCount("children", -1)}
            />
            <PassengerRow
              label="Infants"
              description="Under 2 years"
              count={currentPassengers.infants}
              onIncrement={() => updateCount("infants", 1)}
              onDecrement={() => updateCount("infants", -1)}
            />
          </div>

          <div className="pt-3">
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full bg-primary hover:bg-secondary text-white font-bold rounded-xl py-2"
              size="sm"
            >
              Done
            </Button>
          </div>
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
        <div className="text-sm font-bold text-neutral-900 leading-tight">{label}</div>
        <div className="text-[11px] text-neutral-400">{description}</div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDecrement}
          disabled={count <= minCount}
          className="size-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:border-primary hover:text-primary disabled:opacity-40 disabled:hover:border-neutral-200"
        >
          <Minus className="size-3" />
        </button>
        <span className="text-sm font-bold w-6 text-center text-neutral-900">{count}</span>
        <button
          type="button"
          onClick={onIncrement}
          disabled={count >= 9}
          className="size-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:border-primary hover:text-primary disabled:opacity-40"
        >
          <Plus className="size-3" />
        </button>
      </div>
    </div>
  )
}
