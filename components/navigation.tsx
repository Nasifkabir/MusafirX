"use client"

import { useState } from "react"
import Link from "next/link"
import { Plane, Menu, X, ChevronDown, User, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Plane className="h-6 w-6 text-blue" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">MusafirWay</h1>
              <p className="text-xs text-muted-foreground">OTA Solutions</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Flights <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/">Search Flights</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/flight/search">Flight Results</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/booking">My Bookings</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Hotels <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/hotels">Search Hotels</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/hotels/bookings">Hotel Bookings</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Holidays <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/holidays">Browse Packages</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/holidays/custom">Custom Package</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Visas <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/visas">Visa Services</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/visas/track">Track Application</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/support" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Support
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Link>
            </Button>
            <Button size="sm" asChild className="bg-primary hover:bg-secondary">
              <Link href="/agent/dashboard">
                <User className="h-4 w-4 mr-2" />
                Agent Portal
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground hover:text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Search Flights
              </Link>
              <Link
                href="/hotels"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Hotels
              </Link>
              <Link
                href="/holidays"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Holidays
              </Link>
              <Link
                href="/visas"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Visas
              </Link>
              <Link
                href="/support"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Support
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </Button>
                <Button size="sm" asChild className="bg-primary hover:bg-secondary">
                  <Link href="/agent/dashboard">
                    <User className="h-4 w-4 mr-2" />
                    Agent Portal
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
