import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  iconBgColor?: string
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp, iconBgColor = "bg-primary/10" }: StatsCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
          {trend && (
            <p className={cn("text-sm font-medium", trendUp ? "text-green-600" : "text-red-600")}>
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center", iconBgColor)}>
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  )
}
