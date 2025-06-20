import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production"
const secretKey = new TextEncoder().encode(JWT_SECRET)

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey)
    return payload
  } catch (error) {
    console.error("Token verification failed in middleware:", error)
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log("Middleware checking path:", pathname)

  // Protected routes
  const protectedRoutes = ["/dashboard", "/admin", "/instructor"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    console.log("Protected route detected:", pathname)

    const token =
      request.cookies.get("auth_token")?.value || request.headers.get("authorization")?.replace("Bearer ", "")

    console.log("Token found:", !!token)

    if (!token) {
      console.log("No token, redirecting to login")
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const payload = await verifyToken(token)
    if (!payload) {
      console.log("Invalid token, redirecting to login")
      return NextResponse.redirect(new URL("/login", request.url))
    }

    console.log("Token valid, user role:", payload.role)

    // Role-based access control
    const userRole = payload.role as string

    if (pathname.startsWith("/admin") && userRole !== "admin") {
      console.log("Admin access denied, redirecting to dashboard")
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    if (pathname.startsWith("/instructor") && userRole !== "instructor" && userRole !== "admin") {
      console.log("Instructor access denied, redirecting to dashboard")
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/instructor/:path*"],
}
