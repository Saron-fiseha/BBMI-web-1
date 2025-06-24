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

    // Get instructor's courses with enrollment and rating data
    const courses = await query(
      `
      SELECT 
        c.*,
        COALESCE(enrollment_stats.student_count, 0) as students,
        COALESCE(rating_stats.avg_rating, 0) as rating,
        COALESCE(c.price * enrollment_stats.student_count, 0) as earnings_amount
      FROM courses c
      LEFT JOIN (
        SELECT 
          course_id, 
          COUNT(*) as student_count
        FROM enrollments
        GROUP BY course_id
      ) enrollment_stats ON c.id = enrollment_stats.course_id
      LEFT JOIN (
        SELECT 
          course_id,
          AVG(rating) as avg_rating
        FROM course_reviews
        GROUP BY course_id
      ) rating_stats ON c.id = rating_stats.course_id
      WHERE c.instructor_id = ?
      ORDER BY c.created_at DESC
    `,
      [instructorId],
    )

    // Format the response
    const formattedCourses = (courses.rows || []).map((course) => ({
      id: course.id.toString(),
      title: course.title,
      students: Number.parseInt(course.students) || 0,
      rating: Number.parseFloat(course.rating) || 0,
      earnings: `$${(course.earnings_amount || 0).toLocaleString()}`,
      image: course.thumbnail_url || `/placeholder.svg?height=100&width=200`,
      status: course.status || "draft",
      description: course.description,
      price: course.price,
      duration: course.duration,
      level: course.level,
      created_at: course.created_at,
      updated_at: course.updated_at,
    }))

    return NextResponse.json(formattedCourses)
  } catch (error) {
    console.error("Error fetching instructor courses:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, price, duration, level, category_id, thumbnail_url } = body

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    await query(
      `
      INSERT INTO courses (
        title, description, price, duration, level, category_id, 
        instructor_id, thumbnail_url, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft', NOW(), NOW())
    `,
      [
        title,
        description,
        price || 0,
        duration || 0,
        level || "beginner",
        category_id || null,
        decoded.userId,
        thumbnail_url || null,
      ],
    )

    // Fetch the last inserted course for this instructor and title
    const courseResult = await query(
      `
      SELECT id FROM courses
      WHERE instructor_id = ? AND title = ?
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [decoded.userId, title]
    )

    const courseId = courseResult.rows?.[0]?.id

    return NextResponse.json(
      {
        id: courseId,
        message: "Course created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating course:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
