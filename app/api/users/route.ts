import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")

    let query = "SELECT id, name, email, role, image_url, created_at FROM users"
    const params: any[] = []

    if (role) {
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
    const body = await request.json()
    const { name, email, role = "student", image_url } = body

    const result = await sql(
      "INSERT INTO users (name, email, role, image_url, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, image_url, created_at",
      [name, email, role, image_url, "demo_hash"],
    )

    return NextResponse.json({ user: result[0] })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
