"use client"

import type React from "react"

import { Calendar } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface DateSelectorProps {
  label: string
  value: Date | null
  onChange: (date: Date | null) => void
  minDate?: Date
  error?: string
}

export function DateSelector({ label, value, onChange, minDate, error }: DateSelectorProps) {
  const formatDateForInput = (date: Date | null) => {
    if (!date) return ""
    return date.toISOString().split("T")[0]
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value
    if (dateValue) {
      onChange(new Date(dateValue))
    } else {
      onChange(null)
    }
  }

  const minDateStr = minDate ? formatDateForInput(minDate) : formatDateForInput(new Date())

  return (
    <div>
      <Label htmlFor={label} className="text-sm font-medium text-foreground mb-2 block">
        {label}
      </Label>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          id={label}
          type="date"
          value={formatDateForInput(value)}
          onChange={handleDateChange}
          min={minDateStr}
          className={`pl-10 ${error ? "border-destructive" : ""}`}
        />
      </div>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  )
}
