import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  const response = NextResponse.json(
    { success: true, message: "Logged out successfully" },
    { status: 200 }
  )

  // Clear the auth token from cookies
  response.cookies.set({
    name: "auth_token", // your JWT cookie name
    value: "",
    path: "/",
    maxAge: 0,
  })

  return response
}
