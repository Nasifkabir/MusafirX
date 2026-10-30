import type React from "react"
import { cookies } from "next/headers"
import { validateSession } from "@/lib/db"
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get("mx_admin_session")?.value
  const session = token ? validateSession(token) : null

  return (
    <AdminAuthGuard initialAuthenticated={Boolean(session)}>
      {children}
    </AdminAuthGuard>
  )
}
