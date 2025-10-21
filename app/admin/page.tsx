"use client"

import { AdminStore } from "@/lib/admin-store"
import { StatsCard } from "@/components/agent/stats-card"
import { ActivityFeed } from "@/components/admin/activity-feed"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { Plane, DollarSign, Users, UserCog, AlertCircle, TrendingUp } from "lucide-react"

export default function AdminDashboardPage() {
  const stats = AdminStore.useState((s) => s.stats)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatsCard
          title="Total Bookings"
          value={stats.totalBookings.toLocaleString()}
          icon={Plane}
          trend="12% from last month"
          trendUp={true}
          iconBgColor="bg-primary/10"
        />
        <StatsCard
          title="Total Revenue"
          value={`₹${(stats.totalRevenue / 100000).toFixed(1)}L`}
          icon={DollarSign}
          trend="24% from last month"
          trendUp={true}
          iconBgColor="bg-green-100"
        />
        <StatsCard
          title="Active Agents"
          value={stats.activeAgents.toString()}
          icon={UserCog}
          trend="8% from last month"
          trendUp={true}
          iconBgColor="bg-accent/10"
        />
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
          icon={Users}
          trend="15% from last month"
          trendUp={true}
          iconBgColor="bg-secondary/10"
        />
        <StatsCard
          title="Pending Approvals"
          value={stats.pendingApprovals.toString()}
          icon={AlertCircle}
          iconBgColor="bg-yellow-100"
        />
        <StatsCard
          title="Monthly Growth"
          value={`${stats.monthlyGrowth}%`}
          icon={TrendingUp}
          trend="3% from last month"
          trendUp={true}
          iconBgColor="bg-primary/10"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <ActivityFeed />
      </div>
    </div>
  )
}
