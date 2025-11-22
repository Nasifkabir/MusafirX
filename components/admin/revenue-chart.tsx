"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export function RevenueChart() {
  const monthlyData = [
    { month: "Jul", revenue: 650000 },
    { month: "Aug", revenue: 720000 },
    { month: "Sep", revenue: 680000 },
    { month: "Oct", revenue: 790000 },
    { month: "Nov", revenue: 850000 },
    { month: "Dec", revenue: 920000 },
  ]

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue))

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-1">Revenue Overview</h3>
          <p className="text-sm text-muted-foreground">Monthly revenue trends</p>
        </div>
        <div className="flex items-center gap-2 text-green-600">
          <TrendingUp className="h-5 w-5" />
          <span className="text-sm font-semibold">+24.5%</span>
        </div>
      </div>

      <div className="space-y-4">
        {monthlyData.map((data) => (
          <div key={data.month} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{data.month}</span>
              <span className="font-semibold text-foreground">BDT{(data.revenue / 1000).toFixed(0)}K</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
