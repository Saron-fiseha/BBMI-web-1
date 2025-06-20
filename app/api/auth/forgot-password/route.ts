import { type NextRequest, NextResponse } from "next/server"
import { createResetToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 })
    }

    const result = await createResetToken(email.toLowerCase())

    if (result) {
      return NextResponse.json({
        success: true,
        message: "Password reset instructions have been sent to your email",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send reset email",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Forgot password API error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
