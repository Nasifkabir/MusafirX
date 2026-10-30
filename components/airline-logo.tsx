"use client"

import { useState } from "react"

interface AirlineLogoProps {
  airlineCode: string
  airlineName?: string
  className?: string
  size?: number
}

// Brand color palette for airline monograms when image is loading or offline
const AIRLINE_COLORS: Record<string, { bg: string; text: string; label?: string }> = {
  "BG": { bg: "bg-[#006A4E]", text: "text-white", label: "Biman" },              // Biman Bangladesh Emerald
  "BS": { bg: "bg-[#0B3B60]", text: "text-amber-400", label: "US-Bangla" },       // US-Bangla Deep Blue
  "2A": { bg: "bg-[#FFB703]", text: "text-[#023047]", label: "Air Astra" },       // Air Astra Golden Yellow
  "VQ": { bg: "bg-[#0077B6]", text: "text-white", label: "Novoair" },             // Novoair Azure
  "EK": { bg: "bg-[#D71921]", text: "text-white", label: "Emirates" },            // Emirates Red
  "QR": { bg: "bg-[#5C0632]", text: "text-white", label: "Qatar" },               // Qatar Burgundy
  "SQ": { bg: "bg-[#00205B]", text: "text-[#F5A800]", label: "Singapore" },       // Singapore Gold/Navy
  "SV": { bg: "bg-[#006C35]", text: "text-white", label: "Saudia" },              // Saudia Green
  "FZ": { bg: "bg-[#0055B8]", text: "text-[#F58220]", label: "flydubai" },        // Flydubai
  "TK": { bg: "bg-[#C8102E]", text: "text-white", label: "Turkish" },             // Turkish Airlines
  "KU": { bg: "bg-[#003B70]", text: "text-white", label: "Kuwait" },              // Kuwait Airways
  "GF": { bg: "bg-[#9A7D0A]", text: "text-white", label: "Gulf Air" },            // Gulf Air
  "WY": { bg: "bg-[#B01B1E]", text: "text-white", label: "Oman Air" },            // Oman Air
  "MH": { bg: "bg-[#0C2340]", text: "text-red-500", label: "Malaysia" },          // Malaysia Airlines
  "TG": { bg: "bg-[#49166D]", text: "text-amber-400", label: "Thai" },            // Thai Airways
  "AI": { bg: "bg-[#ED1B24]", text: "text-amber-300", label: "Air India" },       // Air India
  "6E": { bg: "bg-[#001E62]", text: "text-white", label: "IndiGo" },              // IndiGo
  "UK": { bg: "bg-[#541B3B]", text: "text-amber-400", label: "Vistara" },         // Vistara
}

/**
 * Production-ready Global Airline Logo component
 * Implements automated multi-tier CDN failover:
 * Tier 1: Kiwi.com Global Airline IATA CDN (128x128 PNG)
 * Tier 2: Aviasales / Travelpayouts Global CDN (200x200 PNG)
 * Tier 3: Duffel Global Airline CDN (SVG)
 * Tier 4: Branded SVG monogram badge with true airline corporate colors
 */
export function AirlineLogo({
  airlineCode,
  airlineName,
  className = "size-10",
  size = 48,
}: AirlineLogoProps) {
  const [cdnTier, setCdnTier] = useState<number>(0)
  const [allFailed, setAllFailed] = useState<boolean>(false)

  // Sanitize code: e.g. "BG-433" -> "BG", "bs" -> "BS"
  const rawCode = (airlineCode || "").trim().toUpperCase()
  const cleanCode = rawCode.includes("-") ? rawCode.split("-")[0] : rawCode.slice(0, 2)
  const code = cleanCode || "XX"
  const name = airlineName || code
  const colors = AIRLINE_COLORS[code] || { bg: "bg-neutral-800", text: "text-white" }

  // Multi-tier CDN fallback URLs
  const cdnUrls = [
    `https://images.kiwi.com/airlines/128x128/${code}.png`,
    `https://pics.avs.io/200/200/${code}.png`,
    `https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${code}.svg`,
  ]

  const handleImageError = () => {
    if (cdnTier < cdnUrls.length - 1) {
      setCdnTier((prev) => prev + 1)
    } else {
      setAllFailed(true)
    }
  }

  if (allFailed) {
    return (
      <div
        className={`${className} rounded-2xl ${colors.bg} ${colors.text} flex flex-col items-center justify-center font-black tracking-wider text-xs shadow-sm border border-black/10 select-none shrink-0 transition-transform hover:scale-105`}
        title={`${name} (${code})`}
      >
        <span className="text-[11px] font-extrabold">{code}</span>
        {colors.label && (
          <span className="text-[8px] font-medium opacity-80 scale-90 -mt-0.5 max-w-full truncate px-0.5">
            {colors.label.slice(0, 5)}
          </span>
        )}
      </div>
    )
  }

  return (
    <div
      className={`${className} rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-xs border border-neutral-100/90 overflow-hidden shrink-0 group transition-all duration-200 hover:shadow-md hover:border-neutral-200`}
      title={`${name} (${code})`}
    >
      <img
        src={cdnUrls[cdnTier]}
        alt={`${name} (${code}) Logo`}
        width={size}
        height={size}
        loading="lazy"
        crossOrigin="anonymous"
        onError={handleImageError}
        className="size-full object-contain filter group-hover:scale-105 transition-transform duration-200"
      />
    </div>
  )
}
