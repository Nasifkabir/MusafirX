import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { validateSession } from "@/lib/db"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("mx_admin_session")?.value

    if (!token) {
      return NextResponse.json(
        { success: false, authenticated: false, message: "No active session." },
        { status: 401 }
      )
    }

    const session = validateSession(token)
    if (!session) {
      return NextResponse.json(
        { success: false, authenticated: false, message: "Session expired or invalid." },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: session.userId,
        name: session.userName,
        email: session.userEmail,
        role: session.role,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, authenticated: false, message: error.message },
      { status: 500 }
    )
  }
}
