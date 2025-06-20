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

    const enrollments = await sql`
      SELECT 
        e.*,
        c.title,
        c.description,
        c.image_url,
        c.duration_hours,
        c.modules_count,
        u.name as instructor_name,
        (
          SELECT name FROM modules 
          WHERE course_id = c.id AND order_index > 
          (SELECT COALESCE(MAX(m2.order_index), 0) FROM modules m2 
           JOIN module_progress mp ON m2.id = mp.module_id 
           WHERE mp.user_id = e.user_id AND mp.course_id = c.id AND mp.completed = true)
          ORDER BY order_index LIMIT 1
        ) as next_lesson
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE e.user_id = ${userId}
      ORDER BY e.last_accessed DESC
    `

    return NextResponse.json({ enrollments })
  } catch (error) {
    console.error("Student enrollments error:", error)
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 })
  }
}
