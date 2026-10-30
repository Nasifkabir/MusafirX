"use client"

import { useEffect, useState } from "react"
import { Plane, Calendar, Users, ChevronDown, Check, Pencil } from "lucide-react"

interface FlightRadarMapProps {
  originCode: string
  originCity: string
  destinationCode: string
  destinationCity: string
  departureDate: string
  travellersText?: string
  tripType?: string
  onScanComplete?: () => void
  isSearching?: boolean
  onEditSearch?: () => void
}

export function FlightRadarMap({
  originCode = "DAC",
  originCity = "Dhaka",
  destinationCode = "CXB",
  destinationCity = "Cox's Bazar",
  departureDate = "Sat, 7 Nov 26",
  travellersText = "1 Traveller · Economy",
  tripType = "ONE WAY",
  onScanComplete,
  isSearching = true,
  onEditSearch,
}: FlightRadarMapProps) {
  const [activeStep, setActiveStep] = useState(1)
  const [planeProgress, setPlaneProgress] = useState(15)

  useEffect(() => {
    if (!isSearching) return

    // Advance 4 steps sequentially
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < 4) return prev + 1
        return prev
      })
    }, 700)

    // Smoothly fly plane along bezier arc
    const planeInterval = setInterval(() => {
      setPlaneProgress((prev) => {
        if (prev >= 100) {
          clearInterval(planeInterval)
          if (onScanComplete) {
            setTimeout(onScanComplete, 600)
          }
          return 100
        }
        return prev + 1.8
      })
    }, 35)

    return () => {
      clearInterval(stepInterval)
      clearInterval(planeInterval)
    }
  }, [isSearching, onScanComplete])

  // Coordinate mapping for Bangladesh / Regional airports
  const airportCoords: Record<string, { x: number; y: number }> = {
    DAC: { x: 475, y: 265 }, // Dhaka (center)
    CXB: { x: 520, y: 395 }, // Cox's Bazar (south-east coast)
    CGP: { x: 508, y: 345 }, // Chittagong
    ZYL: { x: 535, y: 200 }, // Sylhet
    JSR: { x: 420, y: 290 }, // Jessore
    SPD: { x: 415, y: 185 }, // Saidpur
    BZL: { x: 450, y: 330 }, // Barisal
    RJH: { x: 395, y: 230 }, // Rajshahi
    DXB: { x: 200, y: 275 }, // Dubai
    BKK: { x: 740, y: 390 }, // Bangkok
    SIN: { x: 780, y: 480 }, // Singapore
    KUL: { x: 760, y: 450 }, // Kuala Lumpur
    DEL: { x: 270, y: 215 }, // Delhi
    CCU: { x: 425, y: 300 }, // Kolkata
  }

  const originPos = airportCoords[originCode] || { x: 475, y: 265 }
  const destPos = airportCoords[destinationCode] || { x: 520, y: 395 }

  // Quadratic curve control point for graceful curved flight arc
  const midX = (originPos.x + destPos.x) / 2 + 35
  const midY = (originPos.y + destPos.y) / 2 - 15

  // Calculate plane position along bezier curve
  const t = Math.min(Math.max(planeProgress / 100, 0), 1)
  const planeX = (1 - t) * (1 - t) * originPos.x + 2 * (1 - t) * t * midX + t * t * destPos.x
  const planeY = (1 - t) * (1 - t) * originPos.y + 2 * (1 - t) * t * midY + t * t * destPos.y

  // Calculate tangent angle for airplane direction
  const dx = 2 * (1 - t) * (midX - originPos.x) + 2 * t * (destPos.x - midX)
  const dy = 2 * (1 - t) * (midY - originPos.y) + 2 * t * (destPos.y - midY)
  const angle = Math.atan2(dy, dx) * (180 / Math.PI)

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* Top Search Telemetry Header Strip */}
      <div className="bg-white rounded-2xl shadow-xs border border-neutral-200/90 p-4 md:px-8 flex flex-wrap items-center justify-between gap-4">
        {/* Route info */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[11px] font-extrabold tracking-wider text-[#7F1D1D] uppercase flex items-center gap-1.5">
              <Plane className="size-3 fill-current transform -rotate-45" />
              {tripType}
            </span>
            <span className="text-base md:text-lg font-black text-neutral-900 tracking-tight">
              {originCity} <span className="text-neutral-400 font-normal">→</span> {destinationCity}
            </span>
            <span className="text-[11px] text-neutral-400 font-medium">
              {originCode}–{destinationCode}
            </span>
          </div>
        </div>

        {/* Departure & Passengers */}
        <div className="flex items-center gap-4 sm:gap-8 md:gap-12 flex-wrap">
          {/* Dates */}
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-neutral-100 text-[#7F1D1D] flex items-center justify-center shrink-0">
              <Calendar className="size-4 text-[#7F1D1D]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                Dates
              </span>
              <span className="text-xs md:text-sm font-bold text-neutral-800">
                {departureDate}
              </span>
            </div>
          </div>

          {/* Travellers */}
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-neutral-100 text-[#7F1D1D] flex items-center justify-center shrink-0">
              <Users className="size-4 text-[#7F1D1D]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                Travellers
              </span>
              <span className="text-xs md:text-sm font-bold text-neutral-800">
                {travellersText}
              </span>
            </div>
          </div>
        </div>

        {/* Edit search action */}
        <div className="w-full sm:w-auto">
          <button
            type="button"
            onClick={onEditSearch}
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-bold text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200/90 px-4 py-2 rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer"
          >
            <Pencil className="size-3.5 text-[#7F1D1D]" />
            <span>Edit search</span>
            <ChevronDown className="size-3.5 text-neutral-400" />
          </button>
        </div>
      </div>

      {/* Main Map Scanner Box - Crisp Light Cartography Aesthetic */}
      <div className="relative overflow-hidden bg-white rounded-3xl border border-neutral-200/90 shadow-sm">
        {/* Floating Telemetry & Status Pill */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-white/95 text-neutral-900 backdrop-blur-md px-6 py-2.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-neutral-200/80 flex items-center gap-3">
            <div className="size-8 rounded-full bg-[#7F1D1D] text-white flex items-center justify-center shadow-md shadow-[#7F1D1D]/30 shrink-0">
              <Plane className="size-4 fill-white transform -rotate-45" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs md:text-sm font-black leading-tight flex items-center gap-1.5 text-neutral-900">
                <span>{originCity}</span>
                <span className="text-neutral-400 font-normal">→</span>
                <span>{destinationCity}</span>
              </span>
              <span className="text-[11px] font-semibold text-neutral-500 flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex gap-1 text-[#7F1D1D] text-[10px]">
                  <span className="animate-pulse">●</span>
                  <span className="animate-pulse [animation-delay:0.2s]">●</span>
                  <span className="animate-pulse [animation-delay:0.4s]">●</span>
                </span>
                Scanning airlines for live fares...
              </span>
            </div>
          </div>
        </div>

        {/* SVG Interactive Map - Light Map with Oceanic Tones */}
        <div className="relative w-full h-[380px] md:h-[450px] bg-[#E8F3FA] overflow-hidden flex items-center justify-center select-none">
          <svg
            viewBox="0 0 920 540"
            className="w-full h-full object-cover select-none"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Water background */}
            <rect width="920" height="540" fill="#E8F3FA" />

            {/* Subtle depth water contours */}
            <path
              d="M 370 330 Q 480 360 620 350 L 620 540 L 320 540 Z"
              fill="#DDEEF8"
              opacity="0.8"
            />
            <path
              d="M 390 370 Q 510 410 650 390 L 650 540 L 350 540 Z"
              fill="#D5E8F5"
              opacity="0.9"
            />

            {/* India landmass */}
            <path
              d="M 100 170 L 350 150 L 380 230 L 360 310 L 390 350 L 330 450 L 260 390 L 160 300 Z"
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="1.5"
            />

            {/* Bangladesh landmass */}
            <path
              d="M 380 170 Q 430 150 490 160 Q 550 170 560 210 Q 570 260 520 310 L 540 370 Q 535 420 505 400 Q 475 360 445 330 Q 390 310 385 240 Z"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="1.8"
            />

            {/* Myanmar landmass */}
            <path
              d="M 550 240 Q 600 270 630 330 Q 650 410 610 470 L 560 450 Q 530 390 545 360 Z"
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="1.5"
            />

            {/* Laos / Thailand landmass */}
            <path
              d="M 640 280 Q 710 310 740 370 Q 730 440 680 470 L 630 410 Z"
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="1.5"
            />

            {/* Vietnam coast */}
            <path
              d="M 740 290 Q 790 330 810 400 Q 820 460 760 500 L 730 470 Z"
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="1.5"
            />

            {/* Clean Map Labels */}
            <text x="210" y="325" fill="#94A3B8" fontSize="13" fontWeight="500">
              India
            </text>
            <text x="430" y="290" fill="#64748B" fontSize="13" fontWeight="600">
              Bangladesh
            </text>
            <text x="630" y="360" fill="#94A3B8" fontSize="13" fontWeight="500">
              Myanmar
            </text>
            <text x="735" y="380" fill="#94A3B8" fontSize="12" fontWeight="500">
              Laos
            </text>
            <text x="810" y="440" fill="#94A3B8" fontSize="12" fontWeight="500">
              Vietnam
            </text>

            {/* Faint flight arc trace */}
            <path
              d={`M ${originPos.x} ${originPos.y} Q ${midX} ${midY} ${destPos.x} ${destPos.y}`}
              fill="none"
              stroke="#7F1D1D"
              strokeWidth="2"
              strokeDasharray="4,4"
              opacity="0.3"
            />

            {/* Active Flight Path Curve - Rich Crimson Arc */}
            <path
              d={`M ${originPos.x} ${originPos.y} Q ${midX} ${midY} ${destPos.x} ${destPos.y}`}
              fill="none"
              stroke="#7F1D1D"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Origin Airport Point (Crimson ring with center dot) */}
            <circle cx={originPos.x} cy={originPos.y} r="6" fill="#7F1D1D" stroke="#FFFFFF" strokeWidth="2" />

            {/* Destination Airport Point */}
            <circle cx={destPos.x} cy={destPos.y} r="6" fill="#7F1D1D" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx={destPos.x} cy={destPos.y} r="14" fill="#7F1D1D" opacity="0.15" className="animate-ping" />

            {/* Moving Airplane Marker along bezier arc */}
            <g
              transform={`translate(${planeX}, ${planeY}) rotate(${angle})`}
              className="transition-all duration-75"
            >
              {/* Circular red badge with white airplane */}
              <circle cx="0" cy="0" r="14" fill="#7F1D1D" stroke="#FFFFFF" strokeWidth="2.5" filter="drop-shadow(0 4px 10px rgba(127,29,29,0.45))" />
              <g transform="translate(-8, -8) scale(0.65)">
                <path
                  d="M12 2 L15 9 L23 11 L16 15 L17 23 L12 19 L7 23 L8 15 L1 11 L9 9 Z"
                  fill="#FFFFFF"
                />
              </g>
            </g>

            {/* Origin Airport Card Pin (DAC / Dhaka) */}
            <g transform={`translate(${originPos.x - 48}, ${originPos.y - 75})`}>
              <rect
                width="96"
                height="48"
                rx="14"
                fill="#FFFFFF"
                stroke="#E2E8F0"
                strokeWidth="1.2"
                filter="drop-shadow(0 8px 18px rgba(0,0,0,0.08))"
              />
              <text
                x="48"
                y="23"
                textAnchor="middle"
                fill="#0F172A"
                fontSize="15"
                fontWeight="900"
                fontFamily="sans-serif"
              >
                {originCode}
              </text>
              <text
                x="48"
                y="38"
                textAnchor="middle"
                fill="#64748B"
                fontSize="11"
                fontWeight="600"
                fontFamily="sans-serif"
              >
                {originCity}
              </text>
            </g>

            {/* Destination Airport Card Pin (CXB / Cox's Bazar) */}
            <g transform={`translate(${destPos.x - 60}, ${destPos.y + 18})`}>
              <rect
                width="120"
                height="48"
                rx="14"
                fill="#FFFFFF"
                stroke="#E2E8F0"
                strokeWidth="1.2"
                filter="drop-shadow(0 8px 18px rgba(0,0,0,0.08))"
              />
              <text
                x="60"
                y="23"
                textAnchor="middle"
                fill="#0F172A"
                fontSize="15"
                fontWeight="900"
                fontFamily="sans-serif"
              >
                {destinationCode}
              </text>
              <text
                x="60"
                y="38"
                textAnchor="middle"
                fill="#64748B"
                fontSize="11"
                fontWeight="600"
                fontFamily="sans-serif"
              >
                {destinationCity}
              </text>
            </g>
          </svg>
        </div>

        {/* Bottom Step Progress Strip - 4 Segments matching Screenshot 2 */}
        <div className="border-t border-neutral-200/80 bg-white grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
          {[
            { step: 1, title: "Live fares" },
            { step: 2, title: "Routes & layovers" },
            { step: 3, title: "Best prices" },
            { step: 4, title: "Ranking options" },
          ].map((item) => {
            const isDone = activeStep > item.step
            const isCurrent = activeStep === item.step

            return (
              <div
                key={item.step}
                className={`p-4 md:px-6 flex items-center justify-between transition-colors ${
                  isCurrent ? "bg-[#7F1D1D]/5" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`size-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isDone
                        ? "bg-[#7F1D1D] text-white"
                        : isCurrent
                        ? "bg-[#7F1D1D] text-white ring-2 ring-[#7F1D1D]/20"
                        : "border border-neutral-300 text-neutral-400"
                    }`}
                  >
                    {isDone ? <Check className="size-3.5 stroke-[3]" /> : item.step}
                  </span>
                  <span
                    className={`text-xs md:text-sm transition-colors ${
                      isCurrent
                        ? "text-neutral-900 font-extrabold"
                        : isDone
                        ? "text-neutral-800 font-bold"
                        : "text-neutral-400 font-medium"
                    }`}
                  >
                    {item.title}
                  </span>
                </div>

                {isCurrent && (
                  <span className="size-2 rounded-full bg-[#7F1D1D] animate-ping" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
