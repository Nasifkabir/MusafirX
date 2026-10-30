"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Plane,
  CreditCard,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileText,
  Sparkles,
  ArrowRight,
  Database,
  ExternalLink,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminDashboardPage() {
  const [sabreConfig, setSabreConfig] = useState<any>(null)
  const [sslConfig, setSslConfig] = useState<any>(null)
  const [bookingStats, setBookingStats] = useState<any>({
    total: 0,
    ticketed: 0,
    held: 0,
    expired: 0,
    totalRevenue: 0,
  })
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [sabreRes, sslRes, bookingsRes] = await Promise.all([
          fetch("/api/admin/suppliers/sabre").then((r) => r.json()).catch(() => ({})),
          fetch("/api/admin/payment/sslcommerz").then((r) => r.json()).catch(() => ({})),
          fetch("/api/admin/bookings").then((r) => r.json()).catch(() => ({})),
        ])

        if (sabreRes?.success) setSabreConfig(sabreRes.config)
        if (sslRes?.success) setSslConfig(sslRes.config)
        if (bookingsRes?.success) {
          if (bookingsRes.stats) setBookingStats(bookingsRes.stats)
          if (bookingsRes.bookings) setRecentBookings(bookingsRes.bookings.slice(0, 6))
        }
      } catch (e) {
        console.error("Dashboard data load error:", e)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
              MusafirX Control Deck
            </h1>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
              B2C OTA Stealth Admin
            </span>
          </div>
          <p className="text-xs md:text-sm text-neutral-500 mt-1">
            Consumer flight reservations, Sabre GDS PNR management & SSLCommerz payment engine
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button asChild className="bg-primary hover:bg-secondary text-white font-bold rounded-xl text-xs">
            <Link href="/admin/bookings">
              <FileText className="size-3.5 mr-1.5" />
              Manage Bookings
            </Link>
          </Button>

          <Button asChild variant="outline" className="rounded-xl text-xs font-bold border-neutral-300">
            <Link href="/flight/search" target="_blank">
              <Plane className="size-3.5 mr-1.5 text-primary" />
              Open Live Search
            </Link>
          </Button>
        </div>
      </div>

      {/* Gateway Status Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sabre Indicator */}
        <Card className="p-4 rounded-2xl border border-neutral-200 bg-white shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <SlidersHorizontal className="size-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Sabre GDS Gateway
              </span>
              <span className="text-sm font-black text-neutral-900">
                PCC: {sabreConfig?.pcc || "HE9L"}
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        </Card>

        {/* SSLCommerz Indicator */}
        <Card className="p-4 rounded-2xl border border-neutral-200 bg-white shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="size-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                SSLCommerz Payment
              </span>
              <span className="text-sm font-black text-neutral-900 truncate max-w-[130px] block">
                {sslConfig?.storeId || "innov6ac34e4b539ff"}
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Sandbox
          </span>
        </Card>

        {/* Database Indicator */}
        <Card className="p-4 rounded-2xl border border-neutral-200 bg-white shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Database className="size-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Storage Engine
              </span>
              <span className="text-sm font-black text-neutral-900">
                MongoDB Mongoose
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            Connected
          </span>
        </Card>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Total Reservations
            </span>
            <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Plane className="size-4" />
            </div>
          </div>
          <span className="text-2xl md:text-3xl font-black text-neutral-900 mt-2 block">
            {bookingStats.total}
          </span>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Consumer B2C Bookings
          </span>
        </Card>

        <Card className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Issued E-Tickets
            </span>
            <div className="size-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <span className="text-2xl md:text-3xl font-black text-emerald-700 mt-2 block">
            {bookingStats.ticketed}
          </span>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
            Instant SSLCommerz Validated
          </span>
        </Card>

        <Card className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Active 1-Hr Holds
            </span>
            <div className="size-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="size-4" />
            </div>
          </div>
          <span className="text-2xl md:text-3xl font-black text-amber-700 mt-2 block">
            {bookingStats.held}
          </span>
          <span className="text-[11px] text-amber-600 font-bold mt-1 block">
            Awaiting Customer Payment
          </span>
        </Card>

        <Card className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <span className="text-2xl md:text-3xl font-black text-primary mt-2 block">
            ৳ {Number(bookingStats.totalRevenue || 0).toLocaleString()}
          </span>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Direct Customer BDT Sales
          </span>
        </Card>
      </div>

      {/* Main Grid: Recent Bookings & Quick Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Reservations Table (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-neutral-900">Recent Consumer Reservations</h3>
            <Link
              href="/admin/bookings"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>View all bookings</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <Card className="rounded-3xl border border-neutral-200 shadow-sm bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3.5">PNR / Ref</th>
                    <th className="p-3.5">Airline & Flight</th>
                    <th className="p-3.5">Route</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Fare</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-neutral-400">
                        No reservations recorded yet. Test searching and booking a flight!
                      </td>
                    </tr>
                  ) : (
                    recentBookings.map((b) => (
                      <tr key={b._id || b.id || b.bookingReference} className="hover:bg-neutral-50/80">
                        <td className="p-3.5 font-mono font-black text-primary">
                          {b.pnr || b.bookingReference}
                        </td>
                        <td className="p-3.5 font-bold text-neutral-900">
                          {b.airlineName} ({b.flightNumber})
                        </td>
                        <td className="p-3.5 font-semibold text-neutral-700">
                          {b.originCode} → {b.destinationCode}
                        </td>
                        <td className="p-3.5 text-neutral-600 truncate max-w-[120px]">
                          {b.contactName || (b.passengers?.[0] ? `${b.passengers[0].firstName} ${b.passengers[0].lastName}` : "Traveler")}
                        </td>
                        <td className="p-3.5 font-mono font-bold text-neutral-900">
                          ৳ {Number(b.totalAmount || 0).toLocaleString()}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              b.status === "TICKETED"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : b.status === "HELD"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Quick Operations Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-bold text-base text-neutral-900">B2C OTA Controls</h3>

          <Card className="p-5 rounded-3xl border border-neutral-200 shadow-sm bg-white space-y-3">
            <Link
              href="/admin/payment/sslcommerz"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100/80 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <CreditCard className="size-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">
                    SSLCommerz Gateway
                  </span>
                  <span className="text-[11px] text-neutral-400">Store ID: innov6ac34e4b539ff</span>
                </div>
              </div>
              <ArrowRight className="size-4 text-neutral-400 group-hover:text-emerald-600 transition-colors" />
            </Link>

            <Link
              href="/admin/suppliers/sabre"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100/80 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <SlidersHorizontal className="size-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">
                    Sabre ITT Sandbox
                  </span>
                  <span className="text-[11px] text-neutral-400">PCC: HE9L | Queue: 110</span>
                </div>
              </div>
              <ArrowRight className="size-4 text-neutral-400 group-hover:text-primary transition-colors" />
            </Link>

            <Link
              href="/admin/bookings"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100/80 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="size-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">
                    B2C Reservations & PNRs
                  </span>
                  <span className="text-[11px] text-neutral-400">Manage 1-Hr Holds & E-Tickets</span>
                </div>
              </div>
              <ArrowRight className="size-4 text-neutral-400 group-hover:text-purple-600 transition-colors" />
            </Link>

            <Link
              href="/flight/search"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100/80 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Plane className="size-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">
                    Consumer Flight Radar
                  </span>
                  <span className="text-[11px] text-neutral-400">Test live search & 7-step booking</span>
                </div>
              </div>
              <ArrowRight className="size-4 text-neutral-400 group-hover:text-amber-600 transition-colors" />
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
