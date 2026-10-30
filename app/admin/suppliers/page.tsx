"use client"

import Link from "next/link"
import {
  SlidersHorizontal,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function SuppliersHubPage() {
  const suppliers = [
    {
      id: "sabre",
      name: "Sabre GDS",
      type: "Global Distribution System",
      protocol: "REST OAuth2 & BFM SOAP",
      status: "Active (Configured)",
      badge: "Primary GDS",
      badgeColor: "bg-primary text-white",
      description: "Direct connection to Sabre Bargain Finder Max flight shopping, PNR booking, and ticketing.",
      configUrl: "/admin/suppliers/sabre",
      active: true,
    },
    {
      id: "amadeus",
      name: "Amadeus GDS",
      type: "Global Distribution System",
      protocol: "Amadeus Self-Service & Enterprise REST",
      status: "Standby",
      badge: "Secondary GDS",
      badgeColor: "bg-neutral-100 text-neutral-700",
      description: "Amadeus flight offers search and instant booking integration.",
      configUrl: "#",
      active: false,
    },
    {
      id: "travelport",
      name: "Travelport Galileo",
      type: "Global Distribution System",
      protocol: "Universal API / JSON REST",
      status: "Standby",
      badge: "Optional GDS",
      badgeColor: "bg-neutral-100 text-neutral-700",
      description: "Low cost carrier and legacy airline inventory via Travelport Galileo.",
      configUrl: "#",
      active: false,
    },
    {
      id: "airline-direct",
      name: "Direct Airline Connect (NDC)",
      type: "Direct Airline API",
      protocol: "IATA NDC 21.3",
      status: "Active",
      badge: "Domestic BD",
      badgeColor: "bg-emerald-100 text-emerald-800",
      description: "Direct connections to Air Astra (2A), US-Bangla (BS), Novoair (VQ), and Biman (BG).",
      configUrl: "#",
      active: true,
    },
  ]

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Building2 className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
                GDS & Airline Suppliers
              </h1>
              <p className="text-xs md:text-sm text-neutral-500">
                Manage your travel supplier inventory connections, credentials, and failover priority
              </p>
            </div>
          </div>
        </div>

        <Button asChild className="bg-primary hover:bg-secondary text-white font-bold rounded-xl text-xs">
          <Link href="/admin/suppliers/sabre">
            <SlidersHorizontal className="size-3.5 mr-1.5" />
            Configure Sabre Credentials
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suppliers.map((supplier) => (
          <Card
            key={supplier.id}
            className="p-6 rounded-3xl border border-neutral-200 shadow-sm bg-white hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${supplier.badgeColor}`}>
                    {supplier.badge}
                  </span>
                  <h3 className="text-lg font-bold text-neutral-900 mt-2">{supplier.name}</h3>
                  <span className="text-xs text-neutral-400 font-medium">{supplier.type}</span>
                </div>

                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                    supplier.active
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                  }`}
                >
                  <span
                    className={`size-2 rounded-full ${supplier.active ? "bg-emerald-500" : "bg-neutral-400"}`}
                  />
                  {supplier.status}
                </span>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">{supplier.description}</p>
              <div className="p-2.5 rounded-xl bg-neutral-50 text-[11px] font-mono text-neutral-600 border border-neutral-100">
                Protocol: {supplier.protocol}
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
              {supplier.id === "sabre" ? (
                <Button
                  asChild
                  className="bg-primary hover:bg-secondary text-white font-bold rounded-xl text-xs w-full sm:w-auto"
                >
                  <Link href={supplier.configUrl}>
                    <span>Manage Sabre Credentials</span>
                    <ArrowRight className="size-3.5 ml-1.5" />
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" disabled className="rounded-xl text-xs">
                  Coming Soon
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
