"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plane, Facebook, Twitter, Instagram, Linkedin, ShieldCheck, Award, Headphones, CreditCard } from "lucide-react"

export function SiteFooter() {
  const pathname = usePathname()

  if (pathname.startsWith("/admin")) {
    return null
  }

  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-neutral-800 mt-auto">
      <div className="container mx-auto px-4 py-14">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-white">
              <div className="h-9 w-9 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-primary/25">
                <Plane className="h-5 w-5 fill-current transform -rotate-45" />
              </div>
              <span className="text-xl font-black tracking-tight">
                Musafir<span className="text-primary">X</span>
              </span>
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Next-generation online travel agency powered by Sabre GDS. Real-time airfare shopping, instant PNR issuance, and 24/7 concierge ticketing.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-md border border-neutral-800">
                Sabre GDS Certified
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-md border border-neutral-800">
                B2B Sub-Agent Hub
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Aviation & Travel</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/flight/search" className="text-neutral-400 hover:text-white transition-colors">
                  Flight Shopping Radar
                </Link>
              </li>
              <li>
                <Link href="/hotels" className="text-neutral-400 hover:text-white transition-colors">
                  Luxury Hotels & Resorts
                </Link>
              </li>
              <li>
                <Link href="/holidays" className="text-neutral-400 hover:text-white transition-colors">
                  Holiday Packages
                </Link>
              </li>
              <li>
                <Link href="/visa" className="text-neutral-400 hover:text-white transition-colors">
                  Global Visa Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin & B2B Portal */}
          {/* Payment & Security */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Payment & Security</h3>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li className="flex items-center gap-2">
                <ShieldCheck className="size-3.5 text-emerald-400 shrink-0" />
                <span>SSLCommerz 256-Bit Encrypted</span>
              </li>
              <li className="flex items-center gap-2">
                <CreditCard className="size-3.5 text-sky-400 shrink-0" />
                <span>Visa, Mastercard & Amex</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-pink-500 shrink-0" />
                <span>bKash & Nagad Instant MFS</span>
              </li>
              <li className="flex items-center gap-2">
                <Plane className="size-3.5 text-amber-400 shrink-0" />
                <span>Sabre Certified GDS Ticketing</span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">24/7 Ticketing Desk</h3>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li className="flex items-center gap-2 text-white font-bold">
                <Headphones className="size-4 text-primary" />
                <span>+880 9610-002244</span>
              </li>
              <li>Email: support@musafirx.com</li>
              <li>GDS Desk: sabre-desk@musafirx.com</li>
              <li>HQ: Gulshan-2, Dhaka 1212, Bangladesh</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>&copy; {new Date().getFullYear()} MusafirX Global Travel Limited. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link href="#" className="hover:text-white transition-colors">GDS Rules</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

