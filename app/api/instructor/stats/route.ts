import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const instructorId = decoded.userId

    // Get total students across all instructor's courses
    const studentsResult = await query(
      `
      SELECT COUNT(DISTINCT e.user_id) as total_students
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE c.instructor_id = ?
    `,
      [instructorId],
    )

    // Get active courses count
    const coursesResult = await query(
      `
      SELECT COUNT(*) as active_courses
      FROM courses
      WHERE instructor_id = ? AND status = 'published'
    `,
      [instructorId],
    )

    // Get total earnings (mock calculation)
    const earningsResult = await query(
      `
      SELECT COALESCE(SUM(c.price * enrollment_count.count), 0) as total_earnings
      FROM courses c
      LEFT JOIN (
        SELECT course_id, COUNT(*) as count
        FROM enrollments
        GROUP BY course_id
      ) enrollment_count ON c.id = enrollment_count.course_id
      WHERE c.instructor_id = ?
    `,
      [instructorId],
    )

    // Get average rating
    const ratingResult = await query(
      `
      SELECT AVG(rating) as avg_rating, COUNT(*) as review_count
      FROM course_reviews cr
      JOIN courses c ON cr.course_id = c.id
      WHERE c.instructor_id = ?
    `,
      [instructorId],
    )

    // Get growth metrics (comparing last 30 days vs previous 30 days)
    const growthResult = await query(
      `
      SELECT 
        COUNT(CASE WHEN e.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as recent_enrollments,
        COUNT(CASE WHEN e.created_at >= DATE_SUB(NOW(), INTERVAL 60 DAY) AND e.created_at < DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as previous_enrollments
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE c.instructor_id = ?
    `,
      [instructorId],
    )

    const totalStudents = studentsResult.rows[0]?.total_students || 0
    const activeCourses = coursesResult.rows[0]?.active_courses || 0
    const totalEarnings = earningsResult.rows[0]?.total_earnings || 0
    const averageRating = Number.parseFloat(ratingResult.rows[0]?.avg_rating || 0).toFixed(2)
    const reviewCount = ratingResult.rows[0]?.review_count || 0

    const recentEnrollments = growthResult.rows[0]?.recent_enrollments || 0
    const previousEnrollments = growthResult.rows[0]?.previous_enrollments || 0
    const enrollmentGrowth =
      previousEnrollments > 0
        ? Math.round(((recentEnrollments - previousEnrollments) / previousEnrollments) * 100)
        : recentEnrollments > 0
          ? 100
          : 0

    const stats = {
      totalStudents: Number.parseInt(totalStudents),
      activeCourses: Number.parseInt(activeCourses),
      totalEarnings: Number.parseFloat(totalEarnings),
      averageRating: Number.parseFloat(averageRating),
      studentsGrowth:
        enrollmentGrowth > 0 ? `+${enrollmentGrowth}% from last month` : `${enrollmentGrowth}% from last month`,
      earningsGrowth: `+$${Math.round(totalEarnings * 0.1)} this month`, // Mock calculation
      reviewCount: Number.parseInt(reviewCount),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching instructor stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
