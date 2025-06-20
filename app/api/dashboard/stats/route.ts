import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "1" // Default to demo user

    // Get user's enrolled courses
    const enrolledCoursesResult = await sql(
      `
      SELECT COUNT(*) as count
      FROM enrollments
      WHERE user_id = $1
    `,
      [userId],
    )

    // Get completed courses
    const completedCoursesResult = await sql(
      `
      SELECT COUNT(*) as count
      FROM enrollments
      WHERE user_id = $1 AND completed_at IS NOT NULL
    `,
      [userId],
    )

    // Get certificates earned
    const certificatesResult = await sql(
      `
      SELECT COUNT(*) as count
      FROM certificates
      WHERE user_id = $1
    `,
      [userId],
    )

    // Get recent activity (enrollments)
    const recentActivityResult = await sql(
      `
      SELECT c.title, c.image_url, e.enrolled_at
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = $1
      ORDER BY e.enrolled_at DESC
      LIMIT 5
    `,
      [userId],
    )

    // Get progress data
    const progressResult = await sql(
      `
      SELECT 
        c.title,
        COUNT(l.id) as total_lessons,
        COUNT(CASE WHEN p.completed = true THEN 1 END) as completed_lessons
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      LEFT JOIN lessons l ON c.id = l.course_id
      LEFT JOIN progress p ON l.id = p.lesson_id AND p.user_id = e.user_id
      WHERE e.user_id = $1
      GROUP BY c.id, c.title
    `,
      [userId],
    )

    const stats = {
      enrolledCourses: Number.parseInt(enrolledCoursesResult[0]?.count || "0"),
      completedCourses: Number.parseInt(completedCoursesResult[0]?.count || "0"),
      certificates: Number.parseInt(certificatesResult[0]?.count || "0"),
      recentActivity: recentActivityResult,
      progress: progressResult,
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
