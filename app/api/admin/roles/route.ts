import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const roles = await sql`
      SELECT 
        r.*,
        (SELECT COUNT(*) FROM users WHERE role = r.name) as user_count
      FROM roles r
      ORDER BY r.created_at
    `

    return NextResponse.json({ roles })
  } catch (error) {
    console.error("Roles fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, permissions } = await request.json()

    const role = await sql`
      INSERT INTO roles (name, description, permissions)
      VALUES (${name}, ${description}, ${JSON.stringify(permissions)})
      RETURNING *
    `

    return NextResponse.json({ role: role[0] })
  } catch (error) {
    console.error("Role creation error:", error)
    return NextResponse.json({ error: "Failed to create role" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, description, permissions } = await request.json()

    const role = await sql`
      UPDATE roles 
      SET name = ${name}, description = ${description}, permissions = ${JSON.stringify(permissions)}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json({ role: role[0] })
  } catch (error) {
    console.error("Role update error:", error)
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    await sql`DELETE FROM roles WHERE id = ${id} AND name NOT IN ('admin', 'instructor', 'student')`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Role deletion error:", error)
    return NextResponse.json({ error: "Failed to delete role" }, { status: 500 })
  }
}
