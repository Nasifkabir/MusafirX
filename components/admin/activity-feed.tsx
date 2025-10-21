"use client"

import { AdminStore, type RecentActivity } from "@/lib/admin-store"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plane, UserCog, Users, DollarSign } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function ActivityFeed() {
  const activities = AdminStore.useState((s) => s.recentActivities)

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "booking":
        return <Plane className="h-4 w-4" />
      case "agent":
        return <UserCog className="h-4 w-4" />
      case "customer":
        return <Users className="h-4 w-4" />
      case "payment":
        return <DollarSign className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: RecentActivity["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground mb-1">{activity.description}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </p>
            </div>
            <Badge variant="outline" className={getStatusColor(activity.status)}>
              {activity.status}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}
