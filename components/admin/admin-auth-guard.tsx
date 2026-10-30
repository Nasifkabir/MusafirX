"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AdminSidebar } from "./admin-sidebar"
import { AdminHeader } from "./admin-header"
import { ShieldAlert, RefreshCw } from "lucide-react"

interface AdminAuthGuardProps {
  children: React.ReactNode
  initialAuthenticated?: boolean
}

export function AdminAuthGuard({ children, initialAuthenticated = false }: AdminAuthGuardProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isLoginPage = pathname === "/admin/login"

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAuthenticated)
  const [checking, setChecking] = useState<boolean>(!initialAuthenticated && !isLoginPage)

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false)
      return
    }

    async function verify() {
      try {
        const res = await fetch("/api/auth/me")
        const data = await res.json()
        if (data.success && data.authenticated) {
          setIsAuthenticated(true)
          setChecking(false)
        } else {
          setIsAuthenticated(false)
          setChecking(false)
          window.location.replace("/admin/login")
        }
      } catch {
        setIsAuthenticated(false)
        setChecking(false)
        window.location.replace("/admin/login")
      }
    }

    verify()
  }, [isLoginPage, router, pathname])

  // If on /admin/login, render children cleanly without admin shell
  if (isLoginPage) {
    return <>{children}</>
  }

  // Checking session
  if (checking) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-white space-y-4 p-4 text-center">
        <RefreshCw className="size-8 text-primary animate-spin" />
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
          Verifying Super Admin Authorization...
        </p>
        <a
          href="/admin/login"
          className="mt-2 text-xs font-bold text-primary hover:underline bg-white/5 border border-white/10 px-4 py-2 rounded-xl"
        >
          Click here to Open Super Admin Login
        </a>
      </div>
    )
  }


  // If not authenticated, show unauthorized gate while redirecting
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-white p-4 text-center space-y-4">
        <div className="size-16 rounded-3xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center">
          <ShieldAlert className="size-8" />
        </div>
        <h2 className="text-xl font-bold">Authentication Required</h2>
        <p className="text-xs text-neutral-400 max-w-sm">
          You must be signed in as a Super Administrator to view this control panel. Redirecting to login...
        </p>
      </div>
    )
  }

  // Authenticated: Render full Admin Panel Layout
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
