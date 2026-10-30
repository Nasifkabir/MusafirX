"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FlightSearchForm } from "@/components/flight-search-form"
import { RecentSearches } from "@/components/recent-searches"
import {
  Plane,
  ShieldCheck,
  Clock,
  Award,
  ArrowRight,
  Sparkles,
  CreditCard,
  Building2,
  CalendarClock,
  Wallet,
  Headphones,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const router = useRouter()
  const [activeSlide, setActiveSlide] = useState(0)
  const [sabreStatus, setSabreStatus] = useState<{
    status: string
    pcc: string
    environment: string
  }>({
    status: "untested",
    pcc: "IPCC",
    environment: "sandbox",
  })

  // Hero destination carousel for popular GDS routes
  const destinations = [
    {
      code: "CXB",
      city: "Cox's Bazar",
      country: "Bangladesh",
      tagline: "World's Longest Natural Sea Beach",
      startingFare: "৳ 4,578",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80",
    },
    {
      code: "DXB",
      city: "Dubai",
      country: "United Arab Emirates",
      tagline: "Futuristic Skyline & Luxury Oasis",
      startingFare: "৳ 36,800",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
    },
    {
      code: "BKK",
      city: "Bangkok",
      country: "Thailand",
      tagline: "Vibrant Street Life & Grand Palaces",
      startingFare: "৳ 28,500",
      image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1600&q=80",
    },
    {
      code: "SIN",
      city: "Singapore",
      country: "Singapore",
      tagline: "Garden City & World-Class Hub",
      startingFare: "৳ 34,200",
      image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1600&q=80",
    },
    {
      code: "MLE",
      city: "Malé",
      country: "Maldives",
      tagline: "Turquoise Waters & Island Bliss",
      startingFare: "৳ 46,000",
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1600&q=80",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % destinations.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [destinations.length])

  // Fetch Sabre status
  useEffect(() => {
    async function checkSabre() {
      try {
        const res = await fetch("/api/sabre/config")
        const data = await res.json()
        if (data.success && data.credentials) {
          setSabreStatus({
            status: data.credentials.status,
            pcc: data.credentials.pcc,
            environment: data.credentials.environment,
          })
        }
      } catch (e) {
        console.error("Sabre status check error:", e)
      }
    }
    checkSabre()
  }, [])

  const currentDest = destinations[activeSlide]

  return (
    <div className="min-h-screen bg-white">
      {/* Consumer Announcement Strip */}
      <div className="bg-neutral-950 text-white text-xs py-2 px-3 sm:px-4 border-b border-neutral-800/80 overflow-hidden">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2">
          <div className="flex items-center gap-2 max-w-full truncate text-[11px] sm:text-xs">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-semibold text-neutral-300 shrink-0">
              Live Airfare Engine:
            </span>
            <span className="text-neutral-400 truncate">
              Direct Sabre GDS Inventory · Official BDT Fares
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs shrink-0">
            <span className="text-neutral-400">24/7 Helpline: <strong className="text-white">+880 9610-002244</strong></span>
            <span className="text-neutral-700">|</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="size-3.5" />
              SSLCommerz 100% Secured
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section with Executive Aviation Flight Deck & Bespoke Route Radar */}
      <section className="relative px-2 pt-2 sm:px-4 md:px-6 overflow-hidden max-w-full">
        <div className="relative mx-auto min-h-[420px] sm:h-[400px] md:h-[480px] max-w-[1600px] overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-4xl bg-neutral-950 shadow-2xl border border-neutral-800/80 pb-20 sm:pb-0">
          {/* Background Image Carousel with Luxury Lighting */}
          {destinations.map((dest, idx) => (
            <div
              key={dest.code}
              className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
                idx === activeSlide ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <img
                src={dest.image}
                alt={dest.city}
                className="w-full h-full object-cover scale-105 transition-transform duration-[8000ms] ease-out brightness-[0.75]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/50 to-transparent" />
            </div>
          ))}

          {/* Hero Content Box (Bespoke Luxury Flight Deck) */}
          <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-3 sm:px-6 md:px-8 py-6 sm:py-8">
            <div className="max-w-2xl space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-950/80 border border-blue-500/30 px-3 py-1 text-xs font-extrabold text-sky-300 backdrop-blur-md shadow-lg shadow-blue-900/30">
                <Sparkles className="size-3.5 text-amber-400" />
                <span className="tracking-wide uppercase text-[10px] sm:text-[11px]">MusafirX Expeditions • Sabre GDS Global</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Fly Beyond Horizons with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-200 to-amber-300">
                  Precision & Elegance
                </span>
              </h1>

              <p className="text-xs md:text-sm text-neutral-300 max-w-xl leading-relaxed">
                Experience next-generation air travel with direct Sabre GDS inventory, instant B2B agent ticketing, and transparent bargain fares.
              </p>

              {/* Bespoke Route Telemetry Pill */}
              <div className="pt-1 sm:pt-2">
                <div className="inline-flex max-w-full flex-wrap items-center gap-2 sm:gap-3 bg-neutral-900/85 backdrop-blur-xl p-2 sm:p-3 rounded-2xl border border-white/15 shadow-2xl">
                  {/* Origin */}
                  <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/10 text-white">
                    <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-mono font-black">DAC</span>
                    <span className="text-xs text-neutral-300 font-medium hidden sm:inline">Dhaka</span>
                  </div>

                  {/* Flight Vector */}
                  <div className="flex items-center gap-1 text-sky-400 font-medium text-xs px-0.5">
                    <span className="h-[1px] w-4 sm:w-10 bg-gradient-to-r from-transparent via-sky-400 to-sky-400" />
                    <Plane className="size-3.5 sm:size-4 transform rotate-45 text-amber-400 animate-pulse" />
                    <span className="h-[1px] w-4 sm:w-10 bg-gradient-to-r from-sky-400 via-sky-400 to-transparent" />
                  </div>

                  {/* Destination */}
                  <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-primary text-white shadow-md shadow-primary/30">
                    <span className="text-xs font-mono font-black">{currentDest.code}</span>
                    <span className="text-xs font-bold">{currentDest.city}</span>
                  </div>

                  {/* Dynamic Fare Chip */}
                  <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-white/20 text-xs">
                    <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider">Starting at</span>
                    <span className="text-amber-400 font-black text-sm">{currentDest.startingFare}</span>
                  </div>
                </div>

                {/* Quick Destination Switcher Chips */}
                <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full py-1">
                  <span className="text-[11px] font-bold text-neutral-400 mr-1 hidden sm:inline shrink-0">Featured:</span>
                  {destinations.map((dest, idx) => (
                    <button
                      key={dest.code}
                      type="button"
                      onClick={() => setActiveSlide(idx)}
                      className={`text-[11px] font-bold px-3 py-1 rounded-full transition-all duration-200 cursor-pointer shrink-0 ${
                        idx === activeSlide
                          ? "bg-white text-neutral-900 shadow-md font-extrabold"
                          : "bg-white/10 hover:bg-white/20 text-neutral-300 backdrop-blur-xs"
                      }`}
                    >
                      {dest.city}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Slide Indicators */}
          <div className="absolute right-6 top-6 hidden md:flex items-center gap-2 bg-neutral-900/70 px-3.5 py-2 rounded-full backdrop-blur-md border border-white/10">
            {destinations.map((dest, idx) => (
              <button
                key={dest.code}
                type="button"
                onClick={() => setActiveSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeSlide ? "w-7 bg-amber-400" : "w-2 bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Slide ${dest.city}`}
              />
            ))}
          </div>
        </div>

        {/* Floating Flight Search Form - Overlaps hero seamlessly */}
        <div className="relative z-20 mx-auto -mt-10 sm:-mt-16 md:-mt-24 max-w-7xl px-2 sm:px-4">
          <FlightSearchForm variant="hero" />
        </div>
      </section>

      {/* Recent Searches Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <RecentSearches />
        </div>
      </section>

      {/* Why MusafirX - Aviation Advantages & Enterprise GDS Features */}
      <section className="py-16 md:py-20 bg-neutral-50/60 border-y border-neutral-200/60">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-10 md:mb-14 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
              <ShieldCheck className="size-4" />
              Why MusafirX
            </span>
            <h2 className="mt-3 text-2xl md:text-4xl font-black text-neutral-900 tracking-tight leading-tight">
              Travel Booking, <span className="text-primary">Done Right</span>
            </h2>
            <p className="mt-2 text-sm md:text-base text-neutral-500 leading-relaxed">
              Experience the next generation OTA platform backed by direct Sabre GDS integration and world-class B2B agent hierarchy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 01 */}
            <article className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-neutral-200/80 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div>
                <div className="flex items-center justify-between">
                  <div className="size-12 rounded-2xl bg-primary/8 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <CalendarClock className="size-6" />
                  </div>
                  <span className="font-mono text-sm font-black text-neutral-300">01</span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-neutral-900">Book Now, Pay Later</h3>
                <p className="mt-2 text-xs md:text-sm text-neutral-500 leading-relaxed">
                  Lock today's lower GDS fare and complete payment before ticket time limit expiry. Decide faster without payment pressure.
                </p>
              </div>
            </article>

            {/* Feature 02 */}
            <article className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-neutral-200/80 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div>
                <div className="flex items-center justify-between">
                  <div className="size-12 rounded-2xl bg-primary/8 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Building2 className="size-6" />
                  </div>
                  <span className="font-mono text-sm font-black text-neutral-300">02</span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-neutral-900">Sabre GDS Certified</h3>
                <p className="mt-2 text-xs md:text-sm text-neutral-500 leading-relaxed">
                  Real-time direct Bargain Finder Max flight shopping engine with instant PNR creation and Sabre sandbox testing.
                </p>
              </div>
            </article>

            {/* Feature 03 */}
            <article className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-neutral-200/80 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div>
                <div className="flex items-center justify-between">
                  <div className="size-12 rounded-2xl bg-primary/8 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Wallet className="size-6" />
                  </div>
                  <span className="font-mono text-sm font-black text-neutral-300">03</span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-neutral-900">Instant SSLCommerz Payments</h3>
                <p className="mt-2 text-xs md:text-sm text-neutral-500 leading-relaxed">
                  Pay smoothly using any credit/debit card, bKash, Nagad, or internet banking with 256-bit bank encryption and instant e-ticket issuance.
                </p>
              </div>
            </article>

            {/* Feature 04 */}
            <article className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-neutral-200/80 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div>
                <div className="flex items-center justify-between">
                  <div className="size-12 rounded-2xl bg-primary/8 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Headphones className="size-6" />
                  </div>
                  <span className="font-mono text-sm font-black text-neutral-300">04</span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-neutral-900">24/7 Ticketing Desk</h3>
                <p className="mt-2 text-xs md:text-sm text-neutral-500 leading-relaxed">
                  Round-the-clock live flight reissuance, cancellation, voiding, and passenger itinerary assistance.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Popular Trending Flight Deals with Live Fares */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Popular Routes
              </span>
              <h3 className="text-2xl md:text-4xl font-black text-neutral-900 tracking-tight mt-1">
                Trending Destinations
              </h3>
            </div>
            <Link
              href="/flight/search"
              className="text-xs md:text-sm font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>View all flight routes</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {destinations.slice(0, 3).map((item) => (
              <div
                key={item.code}
                onClick={() => router.push("/flight/search")}
                className="group relative overflow-hidden rounded-3xl cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="h-80 w-full relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.city}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent" />

                  {/* Card Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-sm font-black bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                        DAC → {item.code}
                      </span>
                      <span className="text-xs bg-primary font-bold px-3 py-1 rounded-full shadow-md">
                        Live Fares
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-neutral-300 font-medium">
                        {item.country}
                      </span>
                      <h4 className="text-2xl font-black tracking-tight">{item.city}</h4>
                      <p className="text-xs text-neutral-400 mt-1">{item.tagline}</p>

                      <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                            Fares starting at
                          </span>
                          <span className="text-xl font-black text-white">
                            {item.startingFare}
                          </span>
                        </div>
                        <span className="size-9 rounded-full bg-white text-neutral-900 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                          <ArrowRight className="size-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
