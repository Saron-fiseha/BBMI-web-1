import { type NextRequest, NextResponse } from "next/server"
import { createResetToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      )
    }

    const result = await createResetToken(email.toLowerCase())

    return NextResponse.json(
      result,
      { status: result.success ? 200 : 400 }
    )
  } catch (error) {
    console.error("Forgot password API error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
