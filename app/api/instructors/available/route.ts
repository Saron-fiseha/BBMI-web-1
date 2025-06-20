import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const instructors = await sql`
      SELECT id, name, specialization, email, status
      FROM users 
      WHERE role = 'instructor' AND status = 'active'
      ORDER BY name
    `

    const formattedInstructors = instructors.map((instructor) => ({
      id: instructor.id.toString(),
      name: instructor.name,
      specialization: instructor.specialization || "General",
      available: instructor.status === "active",
    }))

    return NextResponse.json({ instructors: formattedInstructors })
  } catch (error) {
    console.error("Error fetching instructors:", error)
    return NextResponse.json({ error: "Failed to fetch instructors" }, { status: 500 })
  }
}
