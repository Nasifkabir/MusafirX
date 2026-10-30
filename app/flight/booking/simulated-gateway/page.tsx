"use client"

import { useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"
import { ShieldCheck, CreditCard, Lock, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

function GatewayInner() {
  const searchParams = useSearchParams()
  const ref = searchParams.get("ref") || "MX-SAMPLE"
  const tranId = searchParams.get("tranId") || "TXN-SAMPLE"
  const amount = searchParams.get("amount") || "4578"

  const [paymentChannel, setPaymentChannel] = useState<"card" | "bkash" | "nagad">("card")
  const [submitting, setSubmitting] = useState(false)

  const handlePay = () => {
    setSubmitting(true)
    const form = document.createElement("form")
    form.method = "POST"
    form.action = `/api/payment/sslcommerz/success?ref=${encodeURIComponent(ref)}`

    const addField = (name: string, value: string) => {
      const input = document.createElement("input")
      input.type = "hidden"
      input.name = name
      input.value = value
      form.appendChild(input)
    }

    addField("val_id", `VAL_SIM_${Date.now()}`)
    addField("tran_id", tranId)
    addField("amount", amount)
    addField("card_type", paymentChannel === "card" ? "VISA-CityBank" : paymentChannel.toUpperCase())
    addField("bank_tran_id", `BNK-${Math.floor(10000000 + Math.random() * 90000000)}`)
    addField("status", "VALID")

    document.body.appendChild(form)
    form.submit()
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white shadow-2xl border border-neutral-200 space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black">
              SSL
            </div>
            <div>
              <h2 className="text-base font-black text-neutral-900 leading-tight">
                SSLCommerz Sandbox Payment
              </h2>
              <span className="text-[11px] text-neutral-500 font-mono">Store: innov6ac34e4b539ff</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <ShieldCheck className="size-3.5" />
            256-Bit SSL
          </span>
        </div>

        <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-neutral-500">Booking Reference:</span>
            <span className="font-mono font-bold text-neutral-800">{ref}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Transaction ID:</span>
            <span className="font-mono text-neutral-800">{tranId}</span>
          </div>
          <div className="flex justify-between pt-2 border-t text-sm font-black text-neutral-900">
            <span>Payable Amount:</span>
            <span className="text-primary text-base">৳ {parseFloat(amount).toLocaleString()} BDT</span>
          </div>
        </div>

        {/* Payment Channels */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-neutral-600 block">Select Payment Method:</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "card", label: "Credit/Debit Card", icon: "💳" },
              { id: "bkash", label: "bKash MFS", icon: "📱" },
              { id: "nagad", label: "Nagad MFS", icon: "⚡" },
            ].map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => setPaymentChannel(ch.id as any)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  paymentChannel === ch.id
                    ? "border-primary bg-primary/5 text-primary font-bold shadow-xs"
                    : "border-neutral-200 hover:border-neutral-300 text-neutral-600"
                }`}
              >
                <span className="text-xl">{ch.icon}</span>
                <span className="text-[11px] leading-tight">{ch.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          <Button
            type="button"
            disabled={submitting}
            onClick={handlePay}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/25 text-sm cursor-pointer"
          >
            {submitting ? "Confirming with Bank..." : `Pay ৳ ${parseFloat(amount).toLocaleString()} & Issue E-Ticket`}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => (window.location.href = `/flight/booking/confirmation?ref=${encodeURIComponent(ref)}&status=cancelled`)}
            className="w-full rounded-xl text-xs text-neutral-500 border-neutral-200"
          >
            Cancel and Return
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default function SimulatedGatewayPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Loading Payment Gateway...</div>}>
      <GatewayInner />
    </Suspense>
  )
}
