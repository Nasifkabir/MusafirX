"use client"

import { useState, useRef, useEffect } from "react"
import { Calendar, ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react"
import { Label } from "@/components/ui/label"

interface DateSelectorProps {
  flightType?: "one-way" | "round-trip" | "multi-city"
  departureDate?: Date | null
  returnDate?: Date | null
  onDepartureChange?: (date: Date | null) => void
  onReturnChange?: (date: Date | null) => void
  onFlightTypeChange?: (type: "one-way" | "round-trip" | "multi-city") => void
  // Fallback for simple single-date usage
  label?: string
  value?: Date | null
  onChange?: (date: Date | null) => void
  error?: string
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

export function DateSelector({
  flightType = "one-way",
  departureDate,
  returnDate,
  onDepartureChange,
  onReturnChange,
  onFlightTypeChange,
  label,
  value,
  onChange,
  error,
}: DateSelectorProps) {
  const isSingle = Boolean(label)

  // Effective departure date (fallback to today if null)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const effectiveDep = departureDate ?? value ?? new Date()
  const depDateObj = new Date(effectiveDep)
  if (isNaN(depDateObj.getTime())) {
    depDateObj.setTime(today.getTime())
  }
  depDateObj.setHours(0, 0, 0, 0)

  const retDateObj = returnDate ? new Date(returnDate) : null
  if (retDateObj) retDateObj.setHours(0, 0, 0, 0)

  // Popover State
  const [openPicker, setOpenPicker] = useState<"dep" | "ret" | "single" | null>(null)

  // Month navigation state
  const [viewYear, setViewYear] = useState<number>(depDateObj.getFullYear())
  const [viewMonth, setViewMonth] = useState<number>(depDateObj.getMonth())

  const containerRef = useRef<HTMLDivElement>(null)

  // Close popup on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenPicker(null)
      }
    }
    document.addEventListener("mousedown", handleOutside)
    document.addEventListener("touchstart", handleOutside)
    return () => {
      document.removeEventListener("mousedown", handleOutside)
      document.removeEventListener("touchstart", handleOutside)
    }
  }, [])

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenPicker(null)
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Sync view month when opening
  const openCalendar = (type: "dep" | "ret" | "single") => {
    let target = depDateObj
    if (type === "ret" && retDateObj) target = retDateObj
    setViewYear(target.getFullYear())
    setViewMonth(target.getMonth())
    setOpenPicker(type)
  }

  // Formatting helpers
  const formatDisplayDate = (d: Date | null) => {
    if (!d) return ""
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "2-digit",
    }).format(d)
  }

  const formatDayName = (d: Date | null) => {
    if (!d) return ""
    return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(d)
  }

  // Quick preset actions (+1D, +7D)
  const addDays = (days: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const next = new Date(depDateObj)
    next.setDate(next.getDate() + days)
    next.setHours(12, 0, 0, 0)
    if (isSingle && onChange) {
      onChange(next)
    } else if (onDepartureChange) {
      onDepartureChange(next)
    }
  }

  // Calendar month navigation
  const prevMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const nextMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  // Build grid of days for viewYear / viewMonth
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay() // 0 is Sunday
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate()

  const handleSelectDay = (day: number) => {
    const selected = new Date(viewYear, viewMonth, day, 12, 0, 0)

    if (openPicker === "single") {
      if (onChange) onChange(selected)
      setOpenPicker(null)
    } else if (openPicker === "dep") {
      if (onDepartureChange) onDepartureChange(selected)
      // If round trip and return is before departure, advance return
      if (flightType === "round-trip" && (!retDateObj || retDateObj < selected)) {
        const nextRet = new Date(selected)
        nextRet.setDate(nextRet.getDate() + 3)
        if (onReturnChange) onReturnChange(nextRet)
      }
      setOpenPicker(null)
    } else if (openPicker === "ret") {
      if (flightType === "one-way" && onFlightTypeChange) {
        onFlightTypeChange("round-trip")
      }
      if (onReturnChange) onReturnChange(selected)
      setOpenPicker(null)
    }
  }

  // Quick preset selector inside calendar dropdown
  const handleQuickPreset = (daysFromToday: number) => {
    const d = new Date()
    d.setDate(d.getDate() + daysFromToday)
    d.setHours(12, 0, 0, 0)

    if (openPicker === "dep" || openPicker === "single") {
      if (isSingle && onChange) onChange(d)
      else if (onDepartureChange) onDepartureChange(d)
    } else if (openPicker === "ret") {
      if (flightType === "one-way" && onFlightTypeChange) onFlightTypeChange("round-trip")
      if (onReturnChange) onReturnChange(d)
    }
    setOpenPicker(null)
  }

  const isPrevMonthDisabled =
    viewYear < today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth <= today.getMonth())

  // Calendar Popup Element
  const renderCalendarDropdown = () => (
    <div
      className="absolute top-full left-0 mt-2 z-50 bg-white border border-neutral-200/90 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] p-4 sm:p-5 w-[320px] sm:w-[350px] max-w-[calc(100vw-2rem)] animate-in fade-in zoom-in-95 duration-150"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-primary">
            {openPicker === "dep"
              ? "Select Departure Date"
              : openPicker === "ret"
              ? "Select Return Date"
              : "Select Date"}
          </span>
          <div className="text-sm sm:text-base font-extrabold text-neutral-900">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevMonth}
            disabled={isPrevMonthDisabled}
            className={`size-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              isPrevMonthDisabled
                ? "text-neutral-300 cursor-not-allowed"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            }`}
            aria-label="Previous Month"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="size-8 rounded-xl flex items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors cursor-pointer"
            aria-label="Next Month"
          >
            <ChevronRight className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setOpenPicker(null)}
            className="size-8 rounded-xl flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors ml-1 cursor-pointer"
            aria-label="Close Calendar"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center py-2 text-[11px] font-bold text-neutral-400 uppercase">
        {DAYS_OF_WEEK.map((d, i) => (
          <div key={d} className={i === 5 || i === 6 ? "text-amber-600" : ""}>
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Leading blanks from prev month */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => {
          const prevDay = daysInPrevMonth - firstDayOfWeek + i + 1
          return (
            <div
              key={`prev-${i}`}
              className="h-9 sm:h-10 flex items-center justify-center text-xs text-neutral-300 select-none font-medium"
            >
              {prevDay}
            </div>
          )
        })}

        {/* Days of current month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const cellDate = new Date(viewYear, viewMonth, day)
          cellDate.setHours(0, 0, 0, 0)

          const isPast = cellDate < today
          const isBeforeDep =
            openPicker === "ret" && cellDate < depDateObj

          const isDisabled = isPast || isBeforeDep

          // Check if selected
          let isSelected = false
          if (openPicker === "dep" || openPicker === "single") {
            isSelected =
              cellDate.getFullYear() === depDateObj.getFullYear() &&
              cellDate.getMonth() === depDateObj.getMonth() &&
              cellDate.getDate() === depDateObj.getDate()
          } else if (openPicker === "ret" && retDateObj) {
            isSelected =
              cellDate.getFullYear() === retDateObj.getFullYear() &&
              cellDate.getMonth() === retDateObj.getMonth() &&
              cellDate.getDate() === retDateObj.getDate()
          }

          const isToday =
            cellDate.getFullYear() === today.getFullYear() &&
            cellDate.getMonth() === today.getMonth() &&
            cellDate.getDate() === today.getDate()

          return (
            <button
              key={`curr-${day}`}
              type="button"
              disabled={isDisabled}
              onClick={() => handleSelectDay(day)}
              className={`h-9 sm:h-10 rounded-xl text-xs sm:text-sm font-bold flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                isSelected
                  ? "bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-md shadow-blue-700/30 scale-105 z-10"
                  : isDisabled
                  ? "text-neutral-300 cursor-not-allowed line-through/20"
                  : isToday
                  ? "text-blue-700 bg-blue-50/80 hover:bg-blue-100 font-extrabold border border-blue-200"
                  : "text-neutral-800 hover:bg-neutral-100 hover:text-neutral-900"
              }`}
            >
              <span>{day}</span>
              {isToday && !isSelected && (
                <span className="size-1 rounded-full bg-blue-600 -mt-0.5" />
              )}
            </button>
          )
        })}
      </div>

      {/* Quick Presets */}
      <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between flex-wrap gap-1">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="size-3 text-primary" />
          Quick Select:
        </span>
        <div className="flex items-center gap-1">
          {[
            { label: "Today", days: 0 },
            { label: "Tomorrow", days: 1 },
            { label: "+7 Days", days: 7 },
            { label: "+14 Days", days: 14 },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleQuickPreset(preset.days)}
              className="text-[10px] font-bold text-primary bg-primary/8 hover:bg-primary/20 px-2 py-1 rounded-lg transition-colors cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  // Single Date Mode (e.g. Visa or simple date pickers)
  if (isSingle) {
    return (
      <div ref={containerRef} className="relative">
        <Label className="text-xs font-bold text-neutral-500 mb-1.5 block tracking-wider uppercase">
          {label}
        </Label>
        <button
          type="button"
          onClick={() => (openPicker === "single" ? setOpenPicker(null) : openCalendar("single"))}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200 transition-all cursor-pointer text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-xl bg-primary/8 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Calendar className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-neutral-900 leading-tight">
                {formatDisplayDate(depDateObj)}
              </span>
              <span className="text-[11px] text-neutral-400">{formatDayName(depDateObj)}</span>
            </div>
          </div>
        </button>

        {openPicker === "single" && renderCalendarDropdown()}
        {error && <p className="text-xs font-semibold text-red-500 mt-1">{error}</p>}
      </div>
    )
  }

  // Dual Flight Mode (Departure + Return)
  return (
    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 relative">
      {/* 1. Departure Date Card */}
      <div className="relative">
        <div className="flex items-center justify-between mb-1.5">
          <Label className="text-xs font-bold text-neutral-500 block tracking-wider uppercase">
            Departure
          </Label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => addDays(1, e)}
              className="text-[10px] font-bold text-primary bg-primary/10 hover:bg-primary/20 px-1.5 py-0.5 rounded-md transition-colors cursor-pointer"
              title="Next day"
            >
              +1D
            </button>
            <button
              type="button"
              onClick={(e) => addDays(7, e)}
              className="text-[10px] font-bold text-primary bg-primary/10 hover:bg-primary/20 px-1.5 py-0.5 rounded-md transition-colors cursor-pointer"
              title="Next week"
            >
              +7D
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => (openPicker === "dep" ? setOpenPicker(null) : openCalendar("dep"))}
          className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer text-left group active:scale-[0.99] ${
            openPicker === "dep"
              ? "bg-white border-primary ring-2 ring-primary/20 shadow-sm"
              : "bg-neutral-50 hover:bg-neutral-100/80 border-neutral-200"
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-8 rounded-xl bg-primary/8 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Calendar className="size-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs md:text-sm font-bold text-neutral-900 truncate">
                {formatDisplayDate(depDateObj)}
              </span>
              <span className="text-[10px] text-neutral-400 font-medium">
                {formatDayName(depDateObj)} • Outbound
              </span>
            </div>
          </div>
        </button>

        {openPicker === "dep" && renderCalendarDropdown()}
      </div>

      {/* 2. Return Date Card */}
      <div className="relative">
        <div className="flex items-center justify-between mb-1.5">
          <Label className="text-xs font-bold text-neutral-500 block tracking-wider uppercase">
            Return
          </Label>
          {flightType === "round-trip" && retDateObj ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (onReturnChange) onReturnChange(null)
                if (onFlightTypeChange) onFlightTypeChange("one-way")
              }}
              className="text-[10px] font-bold text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
            >
              ✕ Remove
            </button>
          ) : (
            <span className="text-[10px] font-medium text-neutral-400">Optional</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            if (flightType === "one-way" && onFlightTypeChange) {
              onFlightTypeChange("round-trip")
            }
            if (openPicker === "ret") {
              setOpenPicker(null)
            } else {
              openCalendar("ret")
            }
          }}
          className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer text-left group active:scale-[0.99] ${
            openPicker === "ret"
              ? "bg-white border-primary ring-2 ring-primary/20 shadow-sm"
              : flightType === "one-way" && !retDateObj
              ? "bg-neutral-50/60 border-dashed border-neutral-300 hover:border-primary/60 hover:bg-neutral-50"
              : "bg-neutral-50 hover:bg-neutral-100/80 border-neutral-200"
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`size-8 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${
                flightType === "one-way" && !retDateObj
                  ? "bg-neutral-100 text-neutral-400 group-hover:text-primary group-hover:bg-primary/10"
                  : "bg-primary/8 text-primary"
              }`}
            >
              <Calendar className="size-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className={`text-xs md:text-sm truncate ${
                  flightType === "one-way" && !retDateObj
                    ? "font-medium text-neutral-500 group-hover:text-primary"
                    : "font-bold text-neutral-900"
                }`}
              >
                {retDateObj ? formatDisplayDate(retDateObj) : "+ Add Return Date"}
              </span>
              <span className="text-[10px] text-neutral-400 font-medium">
                {retDateObj ? formatDayName(retDateObj) + " • Inbound" : "Round trip discount"}
              </span>
            </div>
          </div>
        </button>

        {openPicker === "ret" && renderCalendarDropdown()}
      </div>
    </div>
  )
}
