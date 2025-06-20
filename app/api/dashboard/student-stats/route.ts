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

    /* ---------- REAL DATABASE QUERIES ---------- */
    const enrolledCourses = await sql`SELECT
        e.*,
        c.title,
        c.description,
        c.image_url,
        c.price,
        c.duration_hours,
        c.level,
        u.name      AS instructor_name,
        cat.name    AS category_name
      FROM enrollments e
      JOIN courses      c   ON e.course_id  = c.id
      LEFT JOIN users   u   ON c.instructor_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE e.user_id = ${userId}
      ORDER BY e.last_accessed DESC`

    const [stats] = await sql`SELECT
        COUNT(*)                         AS total_courses,
        COALESCE(AVG(progress), 0)       AS avg_progress,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_courses,
        COALESCE(SUM(payment_amount), 0) AS total_spent
      FROM enrollments
      WHERE user_id = ${userId}`

    const recentActivity = await sql`SELECT
        mp.last_accessed,
        m.name  AS module_name,
        c.title AS course_title
      FROM module_progress mp
      JOIN modules m ON mp.module_id = m.id
      JOIN courses c ON mp.course_id = c.id
      WHERE mp.user_id = ${userId}
      ORDER BY mp.last_accessed DESC
      LIMIT 5`

    return NextResponse.json({ enrolledCourses, stats, recentActivity })
  } catch (error) {
    console.error("Student dashboard stats error (falling back to empty):", error)

    // Safe fallback so the UI can still render
    return NextResponse.json({
      enrolledCourses: [],
      stats: {
        total_courses: 0,
        avg_progress: 0,
        completed_courses: 0,
        total_spent: 0,
      },
      recentActivity: [],
    })
  }
}
