"use client"

import { AgentStore } from "@/lib/agent-store"
import { StatsCard } from "@/components/agent/stats-card"
import { BookingsTable } from "@/components/agent/bookings-table"
import { CommissionChart } from "@/components/agent/commission-chart"
import { QuickActions } from "@/components/agent/quick-actions"
import { Plane, DollarSign, TrendingUp, Clock } from "lucide-react"

export default function AgentDashboardPage() {
  const stats = AgentStore.useState((s) => s.stats)

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary to-accent py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Agent Dashboard</h1>
          <p className="text-white/90">Welcome back! Here's your business overview</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Bookings"
            value={stats.totalBookings.toString()}
            icon={Plane}
            trend="12% from last month"
            trendUp={true}
            iconBgColor="bg-primary/10"
          />
          <StatsCard
            title="Total Revenue"
            value={`₹${(stats.totalRevenue / 1000).toFixed(1)}K`}
            icon={DollarSign}
            trend="8% from last month"
            trendUp={true}
            iconBgColor="bg-accent/10"
          />
          <StatsCard
            title="Total Commission"
            value={`₹${(stats.totalCommission / 1000).toFixed(1)}K`}
            icon={TrendingUp}
            trend="15% from last month"
            trendUp={true}
            iconBgColor="bg-green-100"
          />
          <StatsCard
            title="Pending Bookings"
            value={stats.pendingBookings.toString()}
            icon={Clock}
            iconBgColor="bg-yellow-100"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <CommissionChart />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>

        {/* Bookings Table */}
        <BookingsTable />
      </div>
    </div>
  )
}
