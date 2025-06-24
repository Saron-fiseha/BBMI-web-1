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

    // Get students enrolled in instructor's courses
    const students = await query(
      `
      SELECT DISTINCT
        u.id,
        u.name,
        u.email,
        u.profile_picture as avatar,
        COUNT(DISTINCT e.course_id) as enrolled_courses,
        AVG(COALESCE(cp.progress_percentage, 0)) as total_progress,
        MAX(e.created_at) as enrollment_date,
        CASE 
          WHEN MAX(u.last_login) > DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 'active'
          WHEN MAX(u.last_login) > DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 'inactive'
          ELSE 'completed'
        END as status,
        CASE 
          WHEN MAX(u.last_login) IS NULL THEN 'Never'
          WHEN MAX(u.last_login) > DATE_SUB(NOW(), INTERVAL 1 HOUR) THEN CONCAT(TIMESTAMPDIFF(MINUTE, MAX(u.last_login), NOW()), ' minutes ago')
          WHEN MAX(u.last_login) > DATE_SUB(NOW(), INTERVAL 1 DAY) THEN CONCAT(TIMESTAMPDIFF(HOUR, MAX(u.last_login), NOW()), ' hours ago')
          ELSE CONCAT(TIMESTAMPDIFF(DAY, MAX(u.last_login), NOW()), ' days ago')
        END as last_active
      FROM users u
      INNER JOIN enrollments e ON u.id = e.user_id
      INNER JOIN courses c ON e.course_id = c.id
      LEFT JOIN course_progress cp ON u.id = cp.user_id AND c.id = cp.course_id
      WHERE c.instructor_id = ?
      GROUP BY u.id, u.name, u.email, u.profile_picture
      ORDER BY MAX(e.created_at) DESC
    `,
      [instructorId],
    )

    // Get course details for each student
    const studentsWithCourses = await Promise.all(
      (students.rows ?? []).map(async (student) => {
        const courses = await query(
          `
          SELECT 
            c.id,
            c.title,
            COALESCE(cp.progress_percentage, 0) as progress,
            CASE 
              WHEN cp.progress_percentage >= 100 THEN 'completed'
              WHEN cp.progress_percentage > 0 THEN 'in_progress'
              ELSE 'not_started'
            END as status
          FROM courses c
          INNER JOIN enrollments e ON c.id = e.course_id
          LEFT JOIN course_progress cp ON c.id = cp.course_id AND e.user_id = cp.user_id
          WHERE c.instructor_id = ? AND e.user_id = ?
        `,
          [instructorId, student.id],
        )

        return {
          id: student.id.toString(),
          name: student.name,
          email: student.email,
          avatar: student.avatar,
          enrolled_courses: Number.parseInt(student.enrolled_courses) || 0,
          total_progress: Math.round(Number.parseFloat(student.total_progress) || 0),
          last_active: student.last_active,
          enrollment_date: student.enrollment_date,
          status: student.status,
          courses: (courses.rows ?? []).map((course) => ({
            id: course.id.toString(),
            title: course.title,
            progress: Math.round(Number.parseFloat(course.progress) || 0),
            status: course.status,
          })),
        }
      }),
    )

    return NextResponse.json(studentsWithCourses)
  } catch (error) {
    console.error("Error fetching instructor students:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
