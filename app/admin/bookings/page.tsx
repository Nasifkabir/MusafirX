"use client"

import { useState, useEffect } from "react"
import {
  FileText,
  Plane,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  X,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  CreditCard,
  User,
  AlertCircle,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function BookingsManagementPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [stats, setStats] = useState<any>({
    total: 0,
    ticketed: 0,
    held: 0,
    expired: 0,
    cancelled: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null)

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const url = statusFilter === "ALL" 
        ? "/api/admin/bookings" 
        : `/api/admin/bookings?status=${statusFilter}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.success) {
        setBookings(data.bookings || [])
        if (data.stats) setStats(data.stats)
      }
    } catch (e) {
      console.error("Failed to fetch bookings:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [statusFilter])

  const filteredBookings = bookings.filter((b) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      b.bookingReference?.toLowerCase().includes(q) ||
      b.pnr?.toLowerCase().includes(q) ||
      b.airlineName?.toLowerCase().includes(q) ||
      b.contactName?.toLowerCase().includes(q) ||
      b.contactEmail?.toLowerCase().includes(q) ||
      b.contactPhone?.toLowerCase().includes(q) ||
      b.originCity?.toLowerCase().includes(q) ||
      b.destinationCity?.toLowerCase().includes(q) ||
      b.passengers?.some((p: any) =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)
      )
    )
  })

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <FileText className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
                B2C Flight Bookings & Sabre PNRs
              </h1>
              <p className="text-xs md:text-sm text-neutral-500">
                Live flight reservations from MongoDB, Sabre GDS PNR records, 1-hour holds & SSLCommerz e-tickets
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
          <Input
            type="text"
            placeholder="Search PNR, Ref, Passenger..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-bold text-neutral-400 uppercase">Total Bookings</span>
          <div className="text-2xl font-black text-neutral-900 mt-1">{stats.total}</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase">Ticketed (Paid)</span>
          <div className="text-2xl font-black text-emerald-800 mt-1">{stats.ticketed}</div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 shadow-xs">
          <span className="text-[11px] font-bold text-amber-700 uppercase">Active 1-Hr Hold</span>
          <div className="text-2xl font-black text-amber-800 mt-1">{stats.held}</div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-bold text-neutral-500 uppercase">Expired Holds</span>
          <div className="text-2xl font-black text-neutral-700 mt-1">{stats.expired}</div>
        </div>

        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-primary uppercase">Total B2C Revenue</span>
          <div className="text-xl font-black text-primary mt-1">
            ৳ {stats.totalRevenue?.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { label: "All Bookings", value: "ALL" },
          { label: "Ticketed (Confirmed)", value: "TICKETED" },
          { label: "1-Hour Hold (Held)", value: "HELD" },
          { label: "Expired", value: "EXPIRED" },
          { label: "Cancelled", value: "CANCELLED" },
        ].map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setStatusFilter(tab.value)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === tab.value
                ? "bg-primary text-white shadow-xs"
                : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <Card className="rounded-3xl border border-neutral-200 shadow-sm bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4">Reference & PNR</th>
                <th className="p-4">Airline & Flight</th>
                <th className="p-4">Route</th>
                <th className="p-4">Departure</th>
                <th className="p-4">Lead Customer</th>
                <th className="p-4">Payment / Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-neutral-400">
                    <RefreshCw className="size-6 animate-spin mx-auto text-primary mb-2" />
                    Loading Live Bookings from MongoDB...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-neutral-500">
                    No bookings found in this category.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b._id || b.id || b.bookingReference} className="hover:bg-neutral-50/80 transition-colors">
                    {/* Reference & PNR */}
                    <td className="p-4">
                      <div>
                        <span className="font-mono text-sm font-black text-primary block">
                          {b.pnr || b.bookingReference}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          Ref: {b.bookingReference}
                        </span>
                      </div>
                    </td>

                    {/* Airline & Flight */}
                    <td className="p-4">
                      <div>
                        <span className="font-bold text-neutral-900 block">
                          {b.airlineName || "Airline"}
                        </span>
                        <span className="font-mono text-xs text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                          {b.flightNumber}
                        </span>
                      </div>
                    </td>

                    {/* Route */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-bold text-neutral-800">
                        <span>{b.originCode}</span>
                        <span className="text-neutral-400 font-normal">→</span>
                        <span>{b.destinationCode}</span>
                      </div>
                      <span className="text-[11px] text-neutral-400 uppercase">{b.cabinClass || "Economy"}</span>
                    </td>

                    {/* Departure */}
                    <td className="p-4">
                      <span className="font-bold text-neutral-900 block">
                        {new Date(b.departureDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    {/* Lead Customer */}
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-neutral-900 block truncate max-w-[140px]">
                          {b.contactName || (b.passengers?.[0] ? `${b.passengers[0].firstName} ${b.passengers[0].lastName}` : "Traveler")}
                        </span>
                        <span className="text-[11px] text-neutral-400 block truncate max-w-[140px]">
                          {b.contactPhone}
                        </span>
                      </div>
                    </td>

                    {/* Payment / Type */}
                    <td className="p-4">
                      {b.bookingType === "HOLD_PAY_LATER" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                          <Clock className="size-3" />
                          1-Hr Hold
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          <CreditCard className="size-3" />
                          SSLCommerz
                        </span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="p-4 font-mono font-black text-neutral-900 text-sm">
                      ৳ {Number(b.totalAmount || 0).toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          b.status === "TICKETED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : b.status === "HELD"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : b.status === "EXPIRED"
                            ? "bg-neutral-100 text-neutral-600 border border-neutral-300"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="p-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedBooking(b)}
                        className="rounded-lg text-xs font-bold border-neutral-300 hover:border-primary hover:text-primary flex items-center gap-1 ml-auto"
                      >
                        <Eye className="size-3" />
                        <span>Details</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Booking Details & Voucher Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <Plane className="size-5 text-primary" />
                <span className="font-black text-base text-neutral-900">
                  Sabre GDS Electronic Voucher & Manifest
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="size-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Voucher Box */}
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4 font-mono text-xs">
              <div className="flex justify-between items-start border-b border-neutral-200 pb-3">
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase">Sabre PNR</span>
                  <span className="text-2xl font-black text-primary">{selectedBooking.pnr}</span>
                  <span className="text-[10px] text-neutral-500 block">Ref: {selectedBooking.bookingReference}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 block uppercase">Status</span>
                  <span
                    className={`inline-block font-bold px-2 py-0.5 rounded text-xs ${
                      selectedBooking.status === "TICKETED"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {selectedBooking.status}
                  </span>
                  {selectedBooking.paymentTransaction?.eTicketNumber && (
                    <span className="text-[10px] text-neutral-600 block mt-1 font-bold">
                      E-Ticket: {selectedBooking.paymentTransaction.eTicketNumber}
                    </span>
                  )}
                </div>
              </div>

              {/* Itinerary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded-xl border border-neutral-200">
                <div>
                  <span className="text-neutral-400 block text-[10px]">AIRLINE</span>
                  <span className="font-bold text-neutral-900">{selectedBooking.airlineName}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">FLIGHT</span>
                  <span className="font-bold text-neutral-900">{selectedBooking.flightNumber}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">ORIGIN</span>
                  <span className="font-bold text-neutral-900">{selectedBooking.originCode} ({selectedBooking.originCity})</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">DESTINATION</span>
                  <span className="font-bold text-neutral-900">{selectedBooking.destinationCode} ({selectedBooking.destinationCity})</span>
                </div>
              </div>

              {/* Passenger Manifest */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                  Passenger Manifest ({selectedBooking.passengers?.length || 0} Travelers)
                </span>
                <div className="space-y-2">
                  {selectedBooking.passengers?.map((p: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 bg-white rounded-xl border border-neutral-200 flex flex-wrap items-center justify-between gap-2"
                    >
                      <div>
                        <span className="font-bold text-neutral-900 block">
                          {p.title} {p.firstName} {p.lastName}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          Type: {p.type || "Adult"} | DOB: {p.dateOfBirth || "N/A"}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-neutral-400 block">PASSPORT</span>
                        <span className="font-bold text-neutral-800">
                          {p.passportNumber || "DOMESTIC ID"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lead Contact Info */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-200">
                <div>
                  <span className="text-neutral-400 block text-[10px]">LEAD CONTACT</span>
                  <span className="font-bold text-neutral-900">{selectedBooking.contactName}</span>
                  <span className="text-[11px] text-neutral-500 block">{selectedBooking.contactEmail}</span>
                  <span className="text-[11px] text-neutral-500 block">{selectedBooking.contactPhone}</span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-400 block text-[10px]">TOTAL FARE</span>
                  <span className="font-bold text-emerald-600 text-lg">৳ {Number(selectedBooking.totalAmount).toLocaleString()}</span>
                  <span className="text-[10px] text-neutral-400 block">Payment: {selectedBooking.bookingType}</span>
                </div>
              </div>

              {/* Payment Transaction details if any */}
              {selectedBooking.paymentTransaction && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
                  <span className="font-bold text-[11px] block">SSLCommerz Transaction Validated</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>Trx ID: <span className="font-bold">{selectedBooking.paymentTransaction.transactionId}</span></div>
                    <div>Card: <span className="font-bold">{selectedBooking.paymentTransaction.cardType || "Online"}</span></div>
                    <div>Bank Trx: <span className="font-bold">{selectedBooking.paymentTransaction.bankTransactionId || "N/A"}</span></div>
                    <div>Paid At: <span className="font-bold">{new Date(selectedBooking.paymentTransaction.paidAt).toLocaleString()}</span></div>
                  </div>
                </div>
              )}

              {/* Barcode representation */}
              <div className="h-9 w-full bg-neutral-900 rounded-lg flex items-center justify-center text-white tracking-[0.6em] text-[11px] font-bold">
                ||| | |||| | ||| || |||| | ||
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="rounded-xl text-xs flex items-center gap-1.5"
              >
                <Printer className="size-3.5" />
                Print Voucher
              </Button>
              <Button
                onClick={() => setSelectedBooking(null)}
                className="bg-primary hover:bg-secondary text-white font-bold rounded-xl text-xs px-6"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
