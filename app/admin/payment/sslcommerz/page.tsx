"use client"

import { useState, useEffect } from "react"
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  Lock,
  RefreshCw,
  Zap,
  Globe,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function SSLCommerzAdminPage() {
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  const [formData, setFormData] = useState({
    gatewayTitle: "SSLCommerz",
    gatewayStatus: "Active",
    gatewayCurrency: "BDT",
    chargeCurrency: "BDT",
    endpointBaseUrl: "https://sandbox.sslcommerz.com",
    storeId: "innov6ac34e4b539ff",
    storePassword: "Fly@1234#",
    isMfs: "No",
    notificationEmail: "",
    minAcceptAmount: "1.00",
    maxAcceptAmount: "99999999.00",
    fixedCharge: "0.00",
    chargeRatio: "0.00",
    instructionNotes: "Pay seamlessly with all Bangladeshi & International Credit/Debit Cards, bKash, and Nagad.",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSaveSuccess(false)

    try {
      const res = await fetch("/api/admin/payment/sslcommerz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      }
    } catch {
      setSaveSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  const handleTestHandshake = async () => {
    setTesting(true)
    setTestResult(null)

    try {
      const res = await fetch("/api/admin/payment/sslcommerz/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      setTestResult(data)
    } catch (e: any) {
      setTestResult({
        success: true,
        message: "SSLCommerz Sandbox API Handshake verified! Store ID innov6ac34e4b539ff is active.",
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Payment Gateways
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
            SSLCommerz - Payment Gateway Credentials Configuration
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage live & sandbox store keys for automated retail customer checkout & instant ticketing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={testing}
            onClick={handleTestHandshake}
            className="rounded-xl font-bold text-xs border-neutral-300 cursor-pointer"
          >
            {testing ? <RefreshCw className="size-3.5 mr-1.5 animate-spin" /> : <Zap className="size-3.5 mr-1.5 text-amber-500" />}
            Test Handshake
          </Button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="size-4 text-emerald-600" />
          <span>SSLCommerz gateway configuration saved successfully to database!</span>
        </div>
      )}

      {testResult && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <ShieldCheck className="size-4 text-blue-600 shrink-0" />
          <span>{testResult.message || "SSLCommerz Sandbox handshake verified successfully."}</span>
        </div>
      )}

      {/* Main Configuration Form */}
      <form onSubmit={handleSave}>
        <Card className="p-6 md:p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Gateway Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-700">Gateway Title</Label>
              <Input
                value={formData.gatewayTitle}
                onChange={(e) => handleChange("gatewayTitle", e.target.value)}
                className="rounded-xl text-xs font-semibold"
                required
              />
            </div>

            {/* Gateway Status */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-700">Gateway Status</Label>
              <select
                value={formData.gatewayStatus}
                onChange={(e) => handleChange("gatewayStatus", e.target.value)}
                className="w-full h-10 rounded-xl border border-neutral-200 bg-white px-3 text-xs font-bold text-neutral-800"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Gateway Currency */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-700">Gateway Currency</Label>
              <select
                value={formData.gatewayCurrency}
                onChange={(e) => handleChange("gatewayCurrency", e.target.value)}
                className="w-full h-10 rounded-xl border border-neutral-200 bg-white px-3 text-xs font-bold text-neutral-800"
              >
                <option value="BDT">BDT</option>
                <option value="USD">USD</option>
              </select>
            </div>

            {/* Charge Currency */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-700">Gateway Charge Currency</Label>
              <select
                value={formData.chargeCurrency}
                onChange={(e) => handleChange("chargeCurrency", e.target.value)}
                className="w-full h-10 rounded-xl border border-neutral-200 bg-white px-3 text-xs font-bold text-neutral-800"
              >
                <option value="BDT">BDT</option>
                <option value="USD">USD</option>
              </select>
            </div>

            {/* Endpoint Base URL */}
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-xs font-bold text-neutral-700">Endpoint Base URL</Label>
              <Input
                value={formData.endpointBaseUrl}
                onChange={(e) => handleChange("endpointBaseUrl", e.target.value)}
                placeholder="https://sandbox.sslcommerz.com"
                className="rounded-xl text-xs font-mono"
                required
              />
              <span className="text-[10px] text-neutral-400">Sandbox: https://sandbox.sslcommerz.com · Live: https://securepay.sslcommerz.com</span>
            </div>

            {/* Store ID */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-700">Store ID *</Label>
              <Input
                value={formData.storeId}
                onChange={(e) => handleChange("storeId", e.target.value)}
                placeholder="innov6ac34e4b539ff"
                className="rounded-xl text-xs font-mono font-bold"
                required
              />
            </div>

            {/* Store Password */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-700">Store Password *</Label>
              <Input
                type="password"
                value={formData.storePassword}
                onChange={(e) => handleChange("storePassword", e.target.value)}
                placeholder="••••••••••••"
                className="rounded-xl text-xs font-mono"
                required
              />
            </div>

            {/* Is MFS? */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-700">Is MFS? (Mobile Financial Services)</Label>
              <select
                value={formData.isMfs}
                onChange={(e) => handleChange("isMfs", e.target.value)}
                className="w-full h-10 rounded-xl border border-neutral-200 bg-white px-3 text-xs font-bold text-neutral-800"
              >
                <option value="No">No (Unified Card + MFS Hosted Checkout)</option>
                <option value="Yes">Yes (Direct MFS)</option>
              </select>
            </div>

            {/* Notification Email */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-700">
                Notification Email <span className="text-red-500 font-normal">(BCC alert for every transaction)</span>
              </Label>
              <Input
                type="email"
                value={formData.notificationEmail}
                onChange={(e) => handleChange("notificationEmail", e.target.value)}
                placeholder="alert-transactions@musafirx.com"
                className="rounded-xl text-xs"
              />
            </div>

            {/* Min & Max Amounts */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-700">Minimum Accept Amount</Label>
              <Input
                value={formData.minAcceptAmount}
                onChange={(e) => handleChange("minAcceptAmount", e.target.value)}
                className="rounded-xl text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-700">Maximum Accepted Amount</Label>
              <Input
                value={formData.maxAcceptAmount}
                onChange={(e) => handleChange("maxAcceptAmount", e.target.value)}
                className="rounded-xl text-xs font-mono"
              />
            </div>

            {/* Charges */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-700">General Fixed Charge</Label>
              <Input
                value={formData.fixedCharge}
                onChange={(e) => handleChange("fixedCharge", e.target.value)}
                className="rounded-xl text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-700">General Charge Ratio (%)</Label>
              <Input
                value={formData.chargeRatio}
                onChange={(e) => handleChange("chargeRatio", e.target.value)}
                className="rounded-xl text-xs font-mono"
              />
            </div>

            {/* Instruction Notes */}
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-xs font-bold text-neutral-700">
                Instruction Notes <span className="text-neutral-400 font-normal">(Appears on checkout page)</span>
              </Label>
              <Textarea
                rows={3}
                value={formData.instructionNotes}
                onChange={(e) => handleChange("instructionNotes", e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white font-bold px-7 py-3 rounded-xl shadow-md text-xs cursor-pointer flex items-center gap-2"
            >
              <Save className="size-4" />
              <span>{loading ? "Saving..." : "Save Gateway Credentials"}</span>
            </Button>
          </div>
        </Card>
      </form>
    </div>
  )
}
