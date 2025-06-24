import { type NextRequest, NextResponse } from "next/server"
import { getUserFromToken } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user || user.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const instructorId = user.id

    // Get instructor's course count
    const courseCount = await sql`
      SELECT COUNT(*) as count
      FROM courses 
      WHERE instructor_id = ${instructorId}
    `

    // Get total students across all instructor's courses
    const studentCount = await sql`
      SELECT COUNT(DISTINCT e.user_id) as count
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE c.instructor_id = ${instructorId}
        AND e.status = 'active'
    `

    // Get average rating
    const avgRating = await sql`
      SELECT AVG(r.rating) as avg_rating
      FROM reviews r
      JOIN courses c ON r.course_id = c.id
      WHERE c.instructor_id = ${instructorId}
    `

    // Get upcoming sessions count
    const upcomingSessions = await sql`
      SELECT COUNT(*) as count
      FROM sessions s
      WHERE s.instructor_id = ${instructorId}
        AND s.scheduled_at > NOW()
        AND s.status IN ('scheduled', 'confirmed')
    `

    // Get total earnings (mock calculation)
    const earnings = await sql`
      SELECT SUM(c.price) as total_earnings
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE c.instructor_id = ${instructorId}
        AND e.status = 'active'
    `

    // Get recent activity
    const recentActivity = await sql`
      (
        SELECT 
          'enrollment' as type,
          CONCAT('New student enrolled in ', c.title) as title,
          CONCAT(u.full_name, ' joined your course') as description,
          e.created_at as activity_time,
          u.profile_picture as avatar
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        JOIN users u ON e.user_id = u.id
        WHERE c.instructor_id = ${instructorId}
        ORDER BY e.created_at DESC
        LIMIT 3
      )
      UNION ALL
      (
        SELECT 
          'review' as type,
          CONCAT('New review for ', c.title) as title,
          CONCAT(r.rating, '-star review: ', LEFT(r.comment, 50)) as description,
          r.created_at as activity_time,
          u.profile_picture as avatar
        FROM reviews r
        JOIN courses c ON r.course_id = c.id
        JOIN users u ON r.user_id = u.id
        WHERE c.instructor_id = ${instructorId}
        ORDER BY r.created_at DESC
        LIMIT 2
      )
      ORDER BY activity_time DESC
      LIMIT 5
    `

    const stats = {
      totalCourses: Number(courseCount[0]?.count || 0),
      totalStudents: Number(studentCount[0]?.count || 0),
      averageRating: Number(Number(avgRating[0]?.avg_rating || 0).toFixed(1)),
      upcomingSessions: Number(upcomingSessions[0]?.count || 0),
      totalEarnings: Number(earnings[0]?.total_earnings || 0),
      monthlyGrowth: "+15%", // This would be calculated based on historical data
    }

    type Activity = {
      type: string
      title: string
      description: string
      activity_time: string | Date
      avatar: string
    }

    const formattedActivity = recentActivity.map((activity: Activity) => ({
      id: Math.random().toString(36).substr(2, 9),
      type: activity.type,
      title: activity.title,
      description: activity.description,
      time: formatTimeAgo(new Date(activity.activity_time)),
      avatar: activity.avatar,
    }))

    return NextResponse.json({
      stats,
      recentActivity: formattedActivity,
    })
  } catch (error) {
    console.error("Error fetching instructor dashboard:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  return date.toLocaleDateString()
}
