"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search, User, LogOut, ShieldCheck, Sparkles } from "lucide-react"

export function AdminHeader() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me")
        const data = await res.json()
        if (data.success && data.user) {
          setUser(data.user)
        }
      } catch {}
    }
    loadUser()
  }, [])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/admin/login")
      router.refresh()
    } catch {
      router.push("/admin/login")
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-xs">
      <div className="flex items-center justify-between px-6 py-3.5">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <Input
              placeholder="Search PNRs, GDS tickets, agents..."
              className="pl-9 rounded-xl text-xs bg-neutral-50 border-neutral-200 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Sabre Status Pill */}
          <div className="hidden sm:flex items-center gap-2 bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sabre GDS Core</span>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-neutral-200">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-neutral-900 leading-tight">
                {user?.name || "Nasif Kabir"}
              </p>
              <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                Super Administrator
              </span>
            </div>

            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
              SA
            </div>

            {/* Logout Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-xl text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 border-neutral-200 hover:border-red-200 flex items-center gap-1.5 ml-1"
            >
              <LogOut className="size-3.5" />
              <span className="hidden md:inline">Log Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
