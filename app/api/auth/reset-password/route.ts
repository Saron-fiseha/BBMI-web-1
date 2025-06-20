import { type NextRequest, NextResponse } from "next/server"
import { resetPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password, confirmPassword } = body

    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Token, password, and confirm password are required",
        },
        { status: 400 },
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match",
        },
        { status: 400 },
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters long",
        },
        { status: 400 },
      )
    }

    const result = await resetPassword(token, password)

    if (result) {
      return NextResponse.json({
        success: true,
        message: "Password has been reset successfully",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired reset token",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Reset password API error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
