"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  SlidersHorizontal,
  Users,
  Shield,
  Plane,
  Building2,
  FileText,
  Settings,
  ArrowLeft,
  ExternalLink,
  Sparkles,
  CreditCard,
} from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: "/admin", label: "Dashboard Overview", icon: LayoutDashboard },
    { href: "/admin/bookings", label: "B2C Bookings & PNRs", icon: FileText, badge: "Live" },
    {
      href: "/admin/suppliers/sabre",
      label: "Sabre GDS Integration",
      icon: SlidersHorizontal,
      badge: "HE9L",
    },
    {
      href: "/admin/payment/sslcommerz",
      label: "SSLCommerz Gateway",
      icon: CreditCard,
      badge: "Active",
    },
    { href: "/flight/search", label: "Flight Search Radar", icon: Plane },
  ]

  return (
    <aside className="w-64 bg-neutral-900 text-white border-r border-neutral-800 min-h-screen sticky top-0 flex flex-col justify-between select-none">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-neutral-800">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="size-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/30 group-hover:scale-105 transition-transform">
              <Plane className="size-5 fill-current transform -rotate-45" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white leading-tight">
                Musafir<span className="text-primary">X</span> Admin
              </h2>
              <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                B2C OTA Command Center
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname?.startsWith(item.href))

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-150",
                      isActive
                        ? "bg-primary text-white shadow-md shadow-primary/20 font-bold"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn("size-4 shrink-0", isActive ? "text-white" : "text-neutral-400")} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full",
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-primary/20 text-primary border border-primary/30"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Footer / Switch to Live Portal */}
      <div className="p-4 border-t border-neutral-800 space-y-2">
        <Link
          href="/"
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-800/80 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ArrowLeft className="size-3.5" />
            Back to Customer Portal
          </span>
          <ExternalLink className="size-3 text-neutral-500" />
        </Link>
        <p className="text-[10px] text-neutral-500 text-center">
          MusafirX Sabre Engine v2.4
        </p>
      </div>
    </aside>
  )
}
