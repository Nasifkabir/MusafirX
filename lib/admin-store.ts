import { Store } from "pullstate"

export interface AdminStats {
  totalBookings: number
  totalRevenue: number
  activeAgents: number
  totalCustomers: number
  pendingApprovals: number
  monthlyGrowth: number
}

export interface RecentActivity {
  id: string
  type: "booking" | "agent" | "customer" | "payment"
  description: string
  timestamp: string
  status: "success" | "pending" | "failed"
}

interface AdminState {
  stats: AdminStats
  recentActivities: RecentActivity[]
}

const mockActivities: RecentActivity[] = [
  {
    id: "1",
    type: "booking",
    description: "New flight booking by Rajesh Kumar - DEL to BOM",
    timestamp: "2025-01-10T10:30:00Z",
    status: "success",
  },
  {
    id: "2",
    type: "agent",
    description: "Agent registration approved - Travel World Agency",
    timestamp: "2025-01-10T09:15:00Z",
    status: "success",
  },
  {
    id: "3",
    type: "payment",
    description: "Payment received - ₹45,000 for booking SKY12345678",
    timestamp: "2025-01-10T08:45:00Z",
    status: "success",
  },
  {
    id: "4",
    type: "customer",
    description: "New customer registration - Priya Sharma",
    timestamp: "2025-01-10T07:20:00Z",
    status: "success",
  },
  {
    id: "5",
    type: "booking",
    description: "Hotel booking pending approval - Grand Palace Hotel",
    timestamp: "2025-01-10T06:10:00Z",
    status: "pending",
  },
]

export const AdminStore = new Store<AdminState>({
  stats: {
    totalBookings: 1247,
    totalRevenue: 8450000,
    activeAgents: 156,
    totalCustomers: 3890,
    pendingApprovals: 23,
    monthlyGrowth: 18.5,
  },
  recentActivities: mockActivities,
})
