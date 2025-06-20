import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const courseId = searchParams.get("courseId")

    let query = `
      SELECT e.*, c.title, c.description, c.image_url, c.price, u.name as instructor_name
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      LEFT JOIN users u ON c.instructor_id = u.id
    `
    const params: any[] = []
    const conditions: string[] = []

    if (userId) {
      conditions.push(`e.user_id = $${params.length + 1}`)
      params.push(userId)
    }

    if (courseId) {
      conditions.push(`e.course_id = $${params.length + 1}`)
      params.push(courseId)
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`
    }

    query += " ORDER BY e.enrolled_at DESC"

    const result = await sql(query, params)

    return NextResponse.json({ enrollments: result })
  } catch (error) {
    console.error("Error fetching enrollments:", error)
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, courseId } = body

    // Check if already enrolled
    const existingEnrollment = await sql("SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2", [
      userId,
      courseId,
    ])

    if (existingEnrollment.length > 0) {
      return NextResponse.json({ error: "Already enrolled in this course" }, { status: 400 })
    }

    // Create enrollment
    const result = await sql("INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) RETURNING *", [
      userId,
      courseId,
    ])

    return NextResponse.json({ enrollment: result[0] })
  } catch (error) {
    console.error("Error creating enrollment:", error)
    return NextResponse.json({ error: "Failed to create enrollment" }, { status: 500 })
  }
}
