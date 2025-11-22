"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export function CommissionChart() {
  const monthlyData = [
    { month: "Jul", commission: 12500 },
    { month: "Aug", commission: 15800 },
    { month: "Sep", commission: 18200 },
    { month: "Oct", commission: 16900 },
    { month: "Nov", commission: 21300 },
    { month: "Dec", commission: 24600 },
  ]

  const maxCommission = Math.max(...monthlyData.map((d) => d.commission))

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">Commission Trends</h3>
          <p className="text-sm text-muted-foreground">Monthly commission earnings</p>
        </div>
        <div className="flex items-center gap-2 text-green-600">
          <TrendingUp className="h-5 w-5" />
          <span className="text-sm font-semibold">+18.5%</span>
        </div>
      </div>

      <div className="space-y-4">
        {monthlyData.map((data) => (
          <div key={data.month} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{data.month}</span>
              <span className="font-semibold text-foreground">BDT{data.commission.toLocaleString()}</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                style={{ width: `${(data.commission / maxCommission) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
