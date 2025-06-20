import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const certificates = await sql`
      SELECT 
        cert.*,
        c.title as course_title,
        u.name as student_name
      FROM certificates cert
      JOIN courses c ON cert.course_id = c.id
      JOIN users u ON cert.user_id = u.id
      WHERE cert.user_id = ${userId}
      ORDER BY cert.issue_date DESC
    `

    return NextResponse.json({ certificates })
  } catch (error) {
    console.error("Student certificates error:", error)
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, courseId } = await request.json()

    // Check if course is 100% complete
    const enrollment = await sql`
      SELECT * FROM enrollments 
      WHERE user_id = ${userId} AND course_id = ${courseId} AND progress = 100
    `

    if (enrollment.length === 0) {
      return NextResponse.json({ error: "Course not completed" }, { status: 400 })
    }

    // Check if certificate already exists
    const existing = await sql`
      SELECT * FROM certificates 
      WHERE user_id = ${userId} AND course_id = ${courseId}
    `

    if (existing.length > 0) {
      return NextResponse.json({ certificate: existing[0] })
    }

    // Generate certificate
    const certificateCode = `CERT-${Date.now()}-${userId}-${courseId}`
    const verificationCode = `VER-${Math.random().toString(36).substring(2, 15)}`

    const course = await sql`SELECT title, instructor_id FROM courses WHERE id = ${courseId}`
    const instructor = await sql`SELECT name FROM users WHERE id = ${course[0].instructor_id}`

    const certificate = await sql`
      INSERT INTO certificates (user_id, course_id, certificate_code, verification_code, instructor_name)
      VALUES (${userId}, ${courseId}, ${certificateCode}, ${verificationCode}, ${instructor[0].name})
      RETURNING *
    `

    return NextResponse.json({ certificate: certificate[0] })
  } catch (error) {
    console.error("Certificate generation error:", error)
    return NextResponse.json({ error: "Failed to generate certificate" }, { status: 500 })
  }
}
