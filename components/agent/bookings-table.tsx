"use client"

import { useState } from "react"
import { AgentStore, type Booking } from "@/lib/agent-store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Download, Filter } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function BookingsTable() {
  const bookings = AgentStore.useState((s) => s.bookings)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "pending" | "cancelled">("all")

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">Recent Bookings</h3>
          <p className="text-sm text-muted-foreground">Manage and track all your customer bookings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by reference, name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
            className={statusFilter === "all" ? "" : "bg-transparent"}
          >
            All
          </Button>
          <Button
            variant={statusFilter === "confirmed" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("confirmed")}
            className={statusFilter === "confirmed" ? "" : "bg-transparent"}
          >
            Confirmed
          </Button>
          <Button
            variant={statusFilter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("pending")}
            className={statusFilter === "pending" ? "" : "bg-transparent"}
          >
            Pending
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Reference</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Flight</TableHead>
              <TableHead className="font-semibold">Route</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Commission</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-sm">{booking.reference}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">{booking.customerName}</div>
                      <div className="text-xs text-muted-foreground">{booking.customerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">{booking.airline}</div>
                      <div className="text-xs text-muted-foreground">{booking.flightNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{booking.route}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(booking.departureDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="font-semibold">
                    DT{booking.amount.toLocaleString()}</TableCell>
                  <TableCell className="font-semibold text-green-600">BDT{booking.commission.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
