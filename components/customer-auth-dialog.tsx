"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plane, Search, UserCheck, ShieldCheck, ArrowRight, AlertCircle, Ticket } from "lucide-react"

interface CustomerAuthDialogProps {
  children?: React.ReactNode
}

export function CustomerAuthDialog({ children }: CustomerAuthDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [findRef, setFindRef] = useState("")
  const [findEmail, setFindEmail] = useState("")
  const [findError, setFindError] = useState<string | null>(null)
  const [finding, setFinding] = useState(false)

  // Traveler Login state
  const [travelerEmail, setTravelerEmail] = useState("")
  const [travelerPass, setTravelerPass] = useState("")
  const [authMsg, setAuthMsg] = useState<string | null>(null)

  const handleFindBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setFindError(null)

    if (!findRef.trim()) {
      setFindError("Please enter your Booking Reference or PNR.")
      return
    }

    setFinding(true)
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(findRef.trim())}`)
      const data = await res.json()

      if (data.success && data.booking) {
        setOpen(false)
        router.push(`/flight/booking/confirmation?ref=${encodeURIComponent(findRef.trim())}`)
      } else {
        setFindError("No booking found with this Reference or PNR. Please verify.")
      }
    } catch {
      setFindError("Network error while searching for booking.")
    } finally {
      setFinding(false)
    }
  }

  const handleTravelerLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setAuthMsg("Welcome back! Your traveler account profile is active.")
    setTimeout(() => {
      setOpen(false)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 px-2.5 sm:px-5 py-2 text-xs md:text-sm font-bold text-white shadow-md shadow-blue-700/20 transition-all duration-200 focus-visible:outline-none active:scale-95 border border-blue-600/30 shrink-0"
          >
            <Ticket className="size-3.5 sm:size-4 mr-0.5 sm:mr-1 text-sky-200" />
            <span>Sign In<span className="hidden sm:inline"> / My Trips</span></span>
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-white border border-neutral-200 shadow-2xl">
        <DialogHeader className="text-center pb-2">
          <div className="size-11 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-700/25 mb-2">
            <Plane className="size-6 transform -rotate-45" />
          </div>
          <DialogTitle className="text-xl font-black text-neutral-900 tracking-tight">
            Musafir<span className="text-primary">X</span> Traveler Portal
          </DialogTitle>
          <p className="text-xs text-neutral-500">
            Look up your flight booking or access your personal travel account
          </p>
        </DialogHeader>

        <Tabs defaultValue="find" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-xl bg-neutral-100 p-1 mb-4">
            <TabsTrigger value="find" className="rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xs">
              Find My Trip
            </TabsTrigger>
            <TabsTrigger value="login" className="rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xs">
              Traveler Login
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Find My Booking */}
          <TabsContent value="find" className="space-y-4 pt-1">
            {findError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{findError}</span>
              </div>
            )}

            <form onSubmit={handleFindBooking} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-neutral-700">
                  Booking Reference or Sabre PNR *
                </Label>
                <Input
                  placeholder="e.g. MX-20261031-8941 or HE9LPX"
                  value={findRef}
                  onChange={(e) => setFindRef(e.target.value)}
                  className="rounded-xl text-xs font-mono uppercase font-bold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-neutral-700">
                  Contact Email (Optional)
                </Label>
                <Input
                  type="email"
                  placeholder="traveler@example.com"
                  value={findEmail}
                  onChange={(e) => setFindEmail(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>

              <Button
                type="submit"
                disabled={finding}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl py-2.5 text-xs shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="size-3.5" />
                <span>{finding ? "Locating Itinerary..." : "Locate Booking & E-Ticket"}</span>
              </Button>
            </form>

            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 text-[11px] text-neutral-500 leading-relaxed text-center">
              Enter your booking reference or 6-character airline PNR from your booking confirmation voucher to view live hold time limit or download ticket.
            </div>
          </TabsContent>

          {/* Tab 2: Traveler Account */}
          <TabsContent value="login" className="space-y-4 pt-1">
            {authMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                <UserCheck className="size-4 shrink-0 text-emerald-600" />
                <span>{authMsg}</span>
              </div>
            )}

            <form onSubmit={handleTravelerLogin} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-neutral-700">Email Address</Label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={travelerEmail}
                  onChange={(e) => setTravelerEmail(e.target.value)}
                  required
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-neutral-700">Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••••••"
                  value={travelerPass}
                  onChange={(e) => setTravelerPass(e.target.value)}
                  required
                  className="rounded-xl text-xs"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl py-2.5 text-xs shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to My Trips</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </form>

            <p className="text-center text-[11px] text-neutral-400">
              New customer? Fast guest checkout is supported automatically when booking.
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
