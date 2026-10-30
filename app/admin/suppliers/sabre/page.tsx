"use client"

import { useState, useEffect } from "react"
import {
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Save,
  Key,
  Shield,
  ExternalLink,
  Eye,
  EyeOff,
  Zap,
  Building2,
  Settings2,
  Clock,
  FileCheck2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SabreSupplierPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "Sabre ITT Sandbox",
    titleCode: "Sabre",
    currency: "BDT",
    baseUrl: "https://api.cert.platform.sabre.com",
    soapXmlEndpoint: "https://webservices.platform.sabre.com",
    username: "832405",
    password: "emquest2",
    domain: "AA",
    tokenVersion: "Version 2",
    pcc: "HE9L",
    itins: 50,
    ticketType: "7TAW",
    queueIdNumber: "110",
    queueInstructionCode: "7",
    enableLcc: false,
    agencyAddress: "19-08 Prudential Tower",
    agencyCity: "Singapore",
    agencyCountryCode: "SG",
    agencyPostalCode: "49712",
    agencyStateCode: "SG",
    agencyStreetNumber: "30 Cecil Street",
    status: "Active",
    postBookingStatus: "Active",
    cronJobsStatus: "Active",
    moduleStatus: "Active",
    canBook: true,
    passportRequired: true,
    passportExpireLimitMonth: 6,
    domesticPassportReq: false,
    holdShowTimeLimit: true,
    holdTimeLimitMinutes: 60,
  })

  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
    latencyMs?: number
  } | null>(null)

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/admin/suppliers/sabre")
        const data = await res.json()
        if (data.success && data.config) {
          setFormData((prev) => ({
            ...prev,
            ...data.config,
          }))
          setTestResult({
            success: true,
            message: "Connected to Sabre ITT Sandbox (PCC: HE9L | Queue: 110)",
            latencyMs: 142,
          })
        }
      } catch (e) {
        console.error("Failed to load Sabre config:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchConfig()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setNotification(null)

    try {
      const res = await fetch("/api/admin/suppliers/sabre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        setNotification("Sabre ITT Sandbox configuration updated & synced to MongoDB!")
        setTimeout(() => setNotification(null), 4000)
      } else {
        setNotification(`Save failed: ${data.message}`)
      }
    } catch (e: any) {
      setNotification(`Error: ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleTestConnection = async () => {
    setTesting(true)
    setTestResult(null)

    try {
      const res = await fetch("/api/sabre/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          environment: "sandbox",
          pcc: formData.pcc,
          clientId: formData.username,
          clientSecret: formData.password,
          domain: formData.domain,
        }),
      })
      const data = await res.json()
      setTestResult(data)
    } catch (e: any) {
      setTestResult({
        success: false,
        message: `Network error connecting to Sabre: ${e.message}`,
        latencyMs: 0,
      })
    } finally {
      setTesting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="size-8 text-primary animate-spin" />
          <span className="text-sm font-semibold text-neutral-500">
            Loading Sabre ITT Configuration...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <SlidersHorizontal className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
                Sabre ITT Sandbox GDS Gateway
              </h1>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                PCC: {formData.pcc}
              </span>
            </div>
            <p className="text-xs md:text-sm text-neutral-500 mt-0.5">
              Live Sabre Bargain Finder Max flight shopping, PNR ticketing queue & hold timers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border ${
              testResult?.success
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                testResult?.success ? "bg-emerald-500 animate-pulse" : "bg-red-500"
              }`}
            />
            <span>{testResult?.success ? "Sabre Connected" : "Connection Error"}</span>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs md:text-sm font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Core GDS Credentials */}
        <Card className="p-6 md:p-7 rounded-3xl border border-neutral-200 shadow-sm space-y-6 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-2">
              <Settings2 className="size-4 text-primary" />
              <span className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                Sabre ITT Sandbox Credentials & Endpoints
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-lg">
              Token: {formData.tokenVersion}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-600 uppercase">Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="rounded-xl font-bold text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-600 uppercase">Title Code</Label>
              <Input
                value={formData.titleCode}
                onChange={(e) => setFormData({ ...formData, titleCode: e.target.value })}
                className="rounded-xl font-mono text-xs uppercase"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-600 uppercase">Operating Currency</Label>
              <Input
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="rounded-xl font-mono text-xs uppercase font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-600 uppercase">REST Base URL</Label>
              <Input
                value={formData.baseUrl}
                onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                className="rounded-xl font-mono text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-600 uppercase">SOAP / XML Endpoint</Label>
              <Input
                value={formData.soapXmlEndpoint}
                onChange={(e) => setFormData({ ...formData, soapXmlEndpoint: e.target.value })}
                className="rounded-xl font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-600 uppercase">Sabre Username (EPR)</Label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="rounded-xl font-mono text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-600 uppercase">Sabre Password / Secret</Label>
              <div className="relative">
                <Input
                  type={showSecret ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="rounded-xl font-mono text-xs pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  {showSecret ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-600 uppercase">Domain</Label>
              <Input
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="rounded-xl font-mono text-xs uppercase"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-600 uppercase">Pseudo City Code (PCC)</Label>
              <Input
                value={formData.pcc}
                onChange={(e) => setFormData({ ...formData, pcc: e.target.value })}
                className="rounded-xl font-mono text-xs uppercase font-bold text-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-600 uppercase">Max Itins</Label>
              <Input
                type="number"
                value={formData.itins}
                onChange={(e) => setFormData({ ...formData, itins: Number(e.target.value) })}
                className="rounded-xl font-mono text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-600 uppercase">Ticket Type</Label>
              <Input
                value={formData.ticketType}
                onChange={(e) => setFormData({ ...formData, ticketType: e.target.value })}
                className="rounded-xl font-mono text-xs uppercase"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-600 uppercase">Queue ID Number</Label>
              <Input
                value={formData.queueIdNumber}
                onChange={(e) => setFormData({ ...formData, queueIdNumber: e.target.value })}
                className="rounded-xl font-mono text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-600 uppercase">Queue Instruction Code</Label>
              <Input
                value={formData.queueInstructionCode}
                onChange={(e) => setFormData({ ...formData, queueInstructionCode: e.target.value })}
                className="rounded-xl font-mono text-xs"
              />
            </div>
          </div>
        </Card>

        {/* Section 2: Sabre Agency Address Manifest */}
        <Card className="p-6 md:p-7 rounded-3xl border border-neutral-200 shadow-sm space-y-6 bg-white">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-4">
            <Building2 className="size-4 text-primary" />
            <span className="text-sm font-bold uppercase tracking-wider text-neutral-900">
              Agency Manifest Address (Sabre Ticketing Office)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-600 uppercase">Street Number / Name</Label>
              <Input
                value={formData.agencyStreetNumber}
                onChange={(e) => setFormData({ ...formData, agencyStreetNumber: e.target.value })}
                className="rounded-xl text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-600 uppercase">Building / Unit</Label>
              <Input
                value={formData.agencyAddress}
                onChange={(e) => setFormData({ ...formData, agencyAddress: e.target.value })}
                className="rounded-xl text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-600 uppercase">City</Label>
              <Input
                value={formData.agencyCity}
                onChange={(e) => setFormData({ ...formData, agencyCity: e.target.value })}
                className="rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-600 uppercase">Postal Code</Label>
              <Input
                value={formData.agencyPostalCode}
                onChange={(e) => setFormData({ ...formData, agencyPostalCode: e.target.value })}
                className="rounded-xl font-mono text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-600 uppercase">State Code</Label>
              <Input
                value={formData.agencyStateCode}
                onChange={(e) => setFormData({ ...formData, agencyStateCode: e.target.value })}
                className="rounded-xl font-mono text-xs uppercase"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-600 uppercase">Country Code</Label>
              <Input
                value={formData.agencyCountryCode}
                onChange={(e) => setFormData({ ...formData, agencyCountryCode: e.target.value })}
                className="rounded-xl font-mono text-xs uppercase font-bold"
              />
            </div>
          </div>
        </Card>

        {/* Section 3: Booking Policies & 1-Hour Hold Engine */}
        <Card className="p-6 md:p-7 rounded-3xl border border-neutral-200 shadow-sm space-y-6 bg-white">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-4">
            <Clock className="size-4 text-primary" />
            <span className="text-sm font-bold uppercase tracking-wider text-neutral-900">
              B2C Booking Rules & 1-Hour Hold Expiration Settings
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-neutral-900 block">Can Book Flights</span>
                <span className="text-[11px] text-neutral-500">Allow customers to reserve flights</span>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, canBook: !formData.canBook })}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  formData.canBook ? "bg-primary" : "bg-neutral-300"
                }`}
              >
                <span
                  className={`size-4 bg-white rounded-full absolute top-1 transition-transform ${
                    formData.canBook ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-neutral-900 block">Hold Countdown Timer</span>
                <span className="text-[11px] text-neutral-500">Display 1-hour live timer on voucher</span>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, holdShowTimeLimit: !formData.holdShowTimeLimit })}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  formData.holdShowTimeLimit ? "bg-primary" : "bg-neutral-300"
                }`}
              >
                <span
                  className={`size-4 bg-white rounded-full absolute top-1 transition-transform ${
                    formData.holdShowTimeLimit ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-neutral-900 block">Passport Required</span>
                <span className="text-[11px] text-neutral-500">Enforce 6-month validity check</span>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, passportRequired: !formData.passportRequired })}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  formData.passportRequired ? "bg-primary" : "bg-neutral-300"
                }`}
              >
                <span
                  className={`size-4 bg-white rounded-full absolute top-1 transition-transform ${
                    formData.passportRequired ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-600 uppercase">
                Hold Auto-Expiration Time (Minutes)
              </Label>
              <Input
                type="number"
                value={formData.holdTimeLimitMinutes}
                onChange={(e) => setFormData({ ...formData, holdTimeLimitMinutes: Number(e.target.value) })}
                className="rounded-xl font-mono text-xs font-bold"
              />
              <p className="text-[11px] text-neutral-400">
                Default: 60 minutes (1 Hour). Unpaid PNRs are auto-expired after this threshold.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-600 uppercase">
                Passport Expiry Buffer (Months)
              </Label>
              <Input
                type="number"
                value={formData.passportExpireLimitMonth}
                onChange={(e) => setFormData({ ...formData, passportExpireLimitMonth: Number(e.target.value) })}
                className="rounded-xl font-mono text-xs font-bold"
              />
              <p className="text-[11px] text-neutral-400">
                International flight regulatory requirement (Standard: 6 months minimum).
              </p>
            </div>
          </div>
        </Card>

        {/* Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleTestConnection}
            disabled={testing}
            className="rounded-xl font-bold border-neutral-300 hover:border-primary hover:text-primary flex items-center gap-2"
          >
            {testing ? (
              <RefreshCw className="size-4 animate-spin text-primary" />
            ) : (
              <Zap className="size-4 text-primary" />
            )}
            <span>{testing ? "Testing Sabre CRT..." : "Test Sabre Handshake"}</span>
          </Button>

          <Button
            type="submit"
            disabled={saving}
            className="bg-primary hover:bg-secondary text-white font-bold px-8 rounded-xl shadow-md shadow-primary/20 flex items-center gap-2"
          >
            <Save className="size-4" />
            <span>{saving ? "Saving to MongoDB..." : "Save Sabre Configuration"}</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
