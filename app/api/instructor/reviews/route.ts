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

    // Get review statistics
    const statsResult = await query(
      `
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as rating_5,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as rating_4,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as rating_3,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as rating_2,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as rating_1
      FROM course_reviews cr
      INNER JOIN courses c ON cr.course_id = c.id
      WHERE c.instructor_id = ?
    `,
      [instructorId],
    )

    const stats = statsResult.rows[0]
    const reviewStats = {
      total_reviews: Number.parseInt(stats?.total_reviews) || 0,
      average_rating: Number.parseFloat(stats?.average_rating) || 0,
      rating_distribution: {
        5: Number.parseInt(stats?.rating_5) || 0,
        4: Number.parseInt(stats?.rating_4) || 0,
        3: Number.parseInt(stats?.rating_3) || 0,
        2: Number.parseInt(stats?.rating_2) || 0,
        1: Number.parseInt(stats?.rating_1) || 0,
      },
    }

    // Get individual reviews
    const reviews = await query(
      `
      SELECT 
        cr.id,
        u.name as student_name,
        u.profile_picture as student_avatar,
        c.title as course_title,
        c.id as course_id,
        cr.rating,
        cr.comment,
        cr.created_at,
        COALESCE(cr.helpful_count, 0) as helpful_count,
        ir.reply_text as instructor_reply,
        ir.created_at as replied_at
      FROM course_reviews cr
      INNER JOIN courses c ON cr.course_id = c.id
      INNER JOIN users u ON cr.user_id = u.id
      LEFT JOIN instructor_replies ir ON cr.id = ir.review_id
      WHERE c.instructor_id = ?
      ORDER BY cr.created_at DESC
      LIMIT 50
    `,
      [instructorId],
    )

    const formattedReviews = reviews.rows.map((review) => ({
      id: review.id.toString(),
      student_name: review.student_name,
      student_avatar: review.student_avatar,
      course_title: review.course_title,
      course_id: review.course_id.toString(),
      rating: Number.parseInt(review.rating),
      comment: review.comment,
      created_at: review.created_at,
      helpful_count: Number.parseInt(review.helpful_count) || 0,
      instructor_reply: review.instructor_reply,
      replied_at: review.replied_at,
    }))

    return NextResponse.json({
      stats: reviewStats,
      reviews: formattedReviews,
    })
  } catch (error) {
    console.error("Error fetching instructor reviews:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
