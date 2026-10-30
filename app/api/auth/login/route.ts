import { NextResponse } from "next/server"
import { getUserByEmail, verifyPassword, createSession } from "@/lib/db"

// In-memory rate limiting map for brute-force protection
const failedAttempts = new Map<string, { count: number; lockedUntil: number }>()

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      )
    }

    const cleanEmail = email.toLowerCase().trim()
    const now = Date.now()

    // Check rate limit
    const attempt = failedAttempts.get(cleanEmail)
    if (attempt && attempt.lockedUntil > now) {
      const waitMinutes = Math.ceil((attempt.lockedUntil - now) / 60000)
      return NextResponse.json(
        {
          success: false,
          message: `Too many failed attempts. Account access temporarily locked. Try again in ${waitMinutes} minute(s).`,
        },
        { status: 429 }
      )
    }

    const user = getUserByEmail(cleanEmail)
    const isUserValid = user && user.status === "active"
    const isPasswordValid = isUserValid
      ? verifyPassword(password, user.passwordHash, user.salt)
      : false

    if (!isUserValid || !isPasswordValid) {
      // Record failed attempt
      const currentCount = (attempt?.count || 0) + 1
      const isLocked = currentCount >= 5
      failedAttempts.set(cleanEmail, {
        count: isLocked ? 0 : currentCount,
        lockedUntil: isLocked ? now + 5 * 60 * 1000 : 0, // 5 min lockout
      })

      return NextResponse.json(
        {
          success: false,
          message: isLocked
            ? "Too many failed attempts. Account temporarily locked for 5 minutes."
            : "Invalid administrator credentials. Access denied.",
        },
        { status: 401 }
      )
    }

    // Reset failed attempts upon successful login
    failedAttempts.delete(cleanEmail)

    const session = createSession(user)

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful! Welcome Super Administrator.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: "mx_admin_session",
      value: session.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return response
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Login error: ${error.message}` },
      { status: 500 }
    )
  }
}
