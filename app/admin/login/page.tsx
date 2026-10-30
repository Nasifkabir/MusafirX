"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Plane,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (data.success) {
        window.location.href = "/admin"
      } else {
        setError(data.message || "Invalid credentials. Super Admin access only.")
      }
    } catch (err: any) {
      setError(`Network error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1329] via-[#0F172A] to-[#1E293B] flex items-center justify-center p-4 select-none">
      {/* Decorative radial lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Logo Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="size-11 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-xl shadow-primary/30 group-hover:scale-105 transition-transform">
              <Plane className="size-6 fill-current transform -rotate-45" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              Musafir<span className="text-primary">X</span>
            </span>
          </Link>
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
            Super Administrator Control Gateway
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-7 md:p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              <h2 className="text-xl font-black text-neutral-900 tracking-tight">
                Super Admin Access
              </h2>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Enter your authorized administrative credentials to access the MusafirX Control Deck.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
              <AlertCircle className="size-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Administrator Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                <Input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@musafirx.com"
                  className="pl-10 rounded-xl text-xs font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="pl-10 pr-10 rounded-xl text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/25 text-xs md:text-sm transition-all duration-200 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="size-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Verifying Credentials...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Sign In to Admin Deck</span>
                  <ArrowRight className="size-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Security Notice */}
          <div className="pt-2 text-center">
            <p className="text-[11px] text-neutral-400 flex items-center justify-center gap-1">
              <Lock className="size-3" />
              <span>Restricted access. All sign-in attempts are encrypted and monitored.</span>
            </p>
          </div>
        </Card>

        {/* Back to Customer Portal */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            ← Return to MusafirX Customer Portal
          </Link>
        </div>
      </div>
    </div>
  )
}
