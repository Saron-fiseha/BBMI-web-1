import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromToken } from "@/lib/auth"
import { hashPassword } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const user = await getUserFromToken(token)

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")

    let query = `
      SELECT id, full_name, email, phone, age, sex, role, profile_picture, email_verified, created_at
      FROM users
    `
    const params: any[] = []

    if (role && role !== "all") {
      query += " WHERE role = $1"
      params.push(role)
    }

    query += " ORDER BY created_at DESC"

    const result = await sql(query, params)

    return NextResponse.json({ users: result })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const user = await getUserFromToken(token)

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { full_name, email, phone, age, sex, role, password } = body

    // Validation
    if (!full_name || !email || !password || !role) {
      return NextResponse.json({ error: "Full name, email, password, and role are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const result = await sql`
      INSERT INTO users (full_name, email, phone, age, sex, password_hash, role, email_verified)
      VALUES (${full_name}, ${email}, ${phone || null}, ${age || null}, ${sex || null}, ${hashedPassword}, ${role}, true)
      RETURNING id, full_name, email, phone, age, sex, role, profile_picture, email_verified, created_at
    `

    return NextResponse.json({ user: result[0] })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
