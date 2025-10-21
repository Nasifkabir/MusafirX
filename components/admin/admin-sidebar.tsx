"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Plane,
  Building2,
  Palmtree,
  FileText,
  Users,
  UserCog,
  Settings,
  BarChart3,
  Bell,
} from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/flights", label: "Flights", icon: Plane },
    { href: "/admin/hotels", label: "Hotels", icon: Building2 },
    { href: "/admin/holidays", label: "Holidays", icon: Palmtree },
    { href: "/admin/visa", label: "Visa Services", icon: FileText },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/agents", label: "Agents", icon: UserCog },
    { href: "/admin/reports", label: "Reports", icon: BarChart3 },
    { href: "/admin/notifications", label: "Notifications", icon: Bell },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ]

  return (
    <aside className="w-64 bg-card border-r min-h-screen sticky top-0">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-foreground">Admin Panel</h2>
        <p className="text-xs text-muted-foreground mt-1">Manage your platform</p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                    isActive
                      ? "bg-gradient-to-r from-primary to-accent text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
