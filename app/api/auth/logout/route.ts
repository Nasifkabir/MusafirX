import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { destroySession } from "@/lib/db"

export async function POST() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("mx_admin_session")?.value

    if (token) {
      destroySession(token)
    }

    const response = NextResponse.json({
      success: true,
      message: "Successfully logged out.",
    })

    response.cookies.delete("mx_admin_session")
    return response
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
