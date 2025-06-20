import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const courseId = params.id

    // Get course details with instructor info
    const courseResult = await sql(
      `
      SELECT c.*, u.name as instructor_name, u.image_url as instructor_image
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE c.id = $1
    `,
      [courseId],
    )

    if (courseResult.length === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Get course lessons
    const lessonsResult = await sql(
      `
      SELECT id, title, description, duration, order_index
      FROM lessons
      WHERE course_id = $1
      ORDER BY order_index
    `,
      [courseId],
    )

    // Get course reviews
    const reviewsResult = await sql(
      `
      SELECT r.rating, r.comment, r.created_at, u.name as user_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.course_id = $1
      ORDER BY r.created_at DESC
    `,
      [courseId],
    )

    const course = {
      ...courseResult[0],
      lessons: lessonsResult,
      reviews: reviewsResult,
    }

    return NextResponse.json({ course })
  } catch (error) {
    console.error("Error fetching course:", error)
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const courseId = params.id
    const body = await request.json()
    const { title, description, price, duration, level } = body

    const result = await sql(
      `
      UPDATE courses 
      SET title = $1, description = $2, price = $3, duration = $4, level = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `,
      [title, description, price, duration, level, courseId],
    )

    if (result.length === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({ course: result[0] })
  } catch (error) {
    console.error("Error updating course:", error)
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 })
  }
}
