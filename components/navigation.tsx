"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Plane,
  Stamp,
  Hotel,
  Palmtree,
  LayoutGrid,
  ChevronDown,
  Headphones,
  Shield,
  Menu,
  X,
  Phone,
  Mail,
  SlidersHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CustomerAuthDialog } from "@/components/customer-auth-dialog"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isFlight = pathname === "/" || pathname?.startsWith("/flight")
  const isHotel = pathname?.startsWith("/hotel")
  const isHoliday = pathname?.startsWith("/holiday")
  const isVisa = pathname?.startsWith("/visa")

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="container mx-auto px-2.5 sm:px-4">
        <div className="flex items-center justify-between h-15 sm:h-16 md:h-18">
          {/* Logo */}
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            <button
              type="button"
              className="lg:hidden p-1 sm:p-2 text-neutral-700 hover:bg-neutral-100 rounded-full shrink-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>

            <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 group shrink-0">
              <div className="size-8 sm:size-10 md:size-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-700/25 group-hover:scale-105 transition-all duration-300 ring-1 sm:ring-2 ring-white">
                <Plane className="size-4 sm:size-5 md:size-6 fill-current transform -rotate-45" />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-xl md:text-2xl font-black tracking-tight text-neutral-900 leading-none">
                  Musafir<span className="text-primary font-extrabold">X</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 mt-0.5 hidden sm:flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Sabre GDS Global Hub
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Tabs - Bespoke MusafirX Active Pill System */}
          <div className="hidden lg:flex items-center gap-1.5 bg-neutral-100/70 p-1 rounded-2xl border border-neutral-200/50">
            <Link
              href="/"
              className={`flex h-9 items-center gap-2 rounded-xl px-4 text-xs font-bold transition-all duration-200 ${
                isFlight
                  ? "bg-white text-primary shadow-xs border border-neutral-200/60"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-white/60"
              }`}
            >
              <Plane className="size-3.5 shrink-0 text-primary" />
              <span>Flights</span>
            </Link>

            <Link
              href="/visa"
              className={`flex h-9 items-center gap-2 rounded-xl px-4 text-xs font-bold transition-all duration-200 ${
                isVisa
                  ? "bg-white text-primary shadow-xs border border-neutral-200/60"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-white/60"
              }`}
            >
              <Stamp className="size-3.5 shrink-0 text-amber-600" />
              <span>Visas</span>
            </Link>

            <Link
              href="/hotels"
              className={`flex h-9 items-center gap-2 rounded-xl px-4 text-xs font-bold transition-all duration-200 ${
                isHotel
                  ? "bg-white text-primary shadow-xs border border-neutral-200/60"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-white/60"
              }`}
            >
              <Hotel className="size-3.5 shrink-0 text-emerald-600" />
              <span>Hotels</span>
            </Link>

            <Link
              href="/holidays"
              className={`flex h-9 items-center gap-2 rounded-xl px-4 text-xs font-bold transition-all duration-200 ${
                isHoliday
                  ? "bg-white text-primary shadow-xs border border-neutral-200/60"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-white/60"
              }`}
            >
              <Palmtree className="size-3.5 shrink-0 text-cyan-600" />
              <span>Holidays</span>
            </Link>

            {/* More Dropdown - Consumer Services */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-9 items-center gap-1.5 rounded-xl px-3.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 hover:bg-white/60 outline-none cursor-pointer">
                <LayoutGrid className="size-3.5 text-neutral-500" />
                <span>Services</span>
                <ChevronDown className="size-3 text-neutral-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 shadow-xl rounded-2xl border border-neutral-200/80">
                <DropdownMenuItem asChild>
                  <Link href="/flight/search" className="flex items-center gap-2.5 py-2 cursor-pointer rounded-xl font-medium text-xs">
                    <Plane className="size-4 text-primary" />
                    <span>Flight Search Radar</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/visa" className="flex items-center gap-2.5 py-2 cursor-pointer rounded-xl font-medium text-xs">
                    <Stamp className="size-4 text-amber-600" />
                    <span>Global Visa Consultation</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/hotels" className="flex items-center gap-2.5 py-2 cursor-pointer rounded-xl font-medium text-xs">
                    <Hotel className="size-4 text-emerald-600" />
                    <span>Luxury Hotels & Resorts</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <CustomerAuthDialog>
                    <button type="button" className="w-full flex items-center gap-2.5 py-2 cursor-pointer rounded-xl font-bold text-xs text-primary">
                      <Shield className="size-4 text-primary" />
                      <span>Find My Booking & PNR</span>
                    </button>
                  </CustomerAuthDialog>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right Header Controls - B2C Consumer Travel Bar */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Currency Pill */}
            <div className="hidden md:inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 text-xs font-black px-2.5 py-1.5 rounded-xl border border-neutral-200/60 select-none">
              <span>BDT ৳</span>
            </div>

            {/* Support Hotline Popover */}
            <div className="hidden sm:block">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    aria-label="Customer Support"
                    className="size-9 md:size-10 rounded-xl bg-neutral-100 text-neutral-700 hover:text-primary hover:bg-primary/10 flex items-center justify-center transition-all duration-200 cursor-pointer"
                  >
                    <Headphones className="size-4.5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-72 p-4 rounded-2xl shadow-xl border border-neutral-200/80">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Phone className="size-4" />
                    </div>
                    <div>
                      <p className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider">24/7 OTA Hotline</p>
                      <p className="text-sm font-black text-neutral-900">+880 9610-002244</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 border-t pt-2.5">
                    <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Mail className="size-4" />
                    </div>
                    <div>
                      <p className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider">Email Concierge</p>
                      <p className="text-sm font-black text-neutral-900">support@musafirx.com</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-500 bg-neutral-50 p-2.5 rounded-xl text-center font-medium">
                    Direct Sabre GDS Automated Ticketing & Support Desk
                  </p>
                </div>
              </PopoverContent>
            </Popover>
            </div>

            {/* Consumer "Sign In / My Trips" Dialog Button (Trip.com Style) */}
            <CustomerAuthDialog />
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-neutral-100 animate-in fade-in duration-200">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm ${
                  isFlight ? "bg-primary/10 text-primary font-bold" : "text-neutral-700"
                }`}
              >
                <Plane className="size-4 text-primary" />
                Flight Search
              </Link>
              <Link
                href="/visa"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-neutral-700 hover:bg-neutral-50"
              >
                <Stamp className="size-4 text-neutral-500" />
                Visa Services
              </Link>
              <Link
                href="/hotels"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-neutral-700 hover:bg-neutral-50"
              >
                <Hotel className="size-4 text-neutral-500" />
                Hotels
              </Link>
              <Link
                href="/holidays"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-neutral-700 hover:bg-neutral-50"
              >
                <Palmtree className="size-4 text-neutral-500" />
                Holidays
              </Link>

              <div className="border-t border-neutral-100 my-2 pt-2 space-y-2">
                <CustomerAuthDialog>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm text-primary bg-primary/10"
                  >
                    <Shield className="size-4 text-primary" />
                    <span>Find My Trip / PNR Status</span>
                  </button>
                </CustomerAuthDialog>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
