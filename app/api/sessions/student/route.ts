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

    // Get sessions for courses the student is enrolled in
    const sessions = await sql`
      SELECT 
        ls.*,
        c.title as course_title,
        u.name as instructor_name,
        se.attended,
        CASE WHEN se.user_id IS NOT NULL THEN true ELSE false END as is_enrolled
      FROM live_sessions ls
      JOIN courses c ON ls.course_id = c.id
      JOIN users u ON ls.instructor_id = u.id
      JOIN enrollments e ON e.course_id = c.id
      LEFT JOIN session_enrollments se ON se.session_id = ls.id AND se.user_id = ${userId}
      WHERE e.user_id = ${userId}
      AND ls.session_date >= CURRENT_DATE
      ORDER BY ls.session_date, ls.start_time
    `

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error("Student sessions error:", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}
