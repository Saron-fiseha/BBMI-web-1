import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Get total counts
    const totalStudents = await sql`SELECT COUNT(*) as count FROM users WHERE role = 'student'`
    const totalInstructors = await sql`SELECT COUNT(*) as count FROM users WHERE role = 'instructor'`
    const totalCourses = await sql`SELECT COUNT(*) as count FROM trainings WHERE status = 'active'`
    const totalEnrollments = await sql`SELECT COUNT(*) as count FROM enrollments`

    // Get revenue data
    const revenue = await sql`
      SELECT SUM(payment_amount) as total_revenue 
      FROM enrollments 
      WHERE payment_status = 'completed'
    `

    // Get monthly data
    const monthlyData = await sql`
      SELECT 
        DATE_TRUNC('month', enrolled_at) as month,
        COUNT(*) as students,
        SUM(payment_amount) as revenue
      FROM enrollments
      WHERE enrolled_at >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', enrolled_at)
      ORDER BY month
    `

    // Get course distribution
    const courseDistribution = await sql`
      SELECT 
        c.title,
        COUNT(e.id) as students,
        c.price
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      GROUP BY c.id, c.title, c.price
      ORDER BY students DESC
      LIMIT 10
    `

    // Get category stats
    const categoryStats = await sql`
      SELECT 
        cat.name,
        COUNT(c.id) as courses,
        COUNT(m.id) as modules
      FROM categories cat
      LEFT JOIN courses c ON cat.id = c.category_id
      LEFT JOIN modules m ON c.id = m.course_id
      GROUP BY cat.id, cat.name
      ORDER BY courses DESC
    `

    return NextResponse.json({
      stats: {
        totalStudents: Number.parseInt(totalStudents[0].count),
        totalInstructors: Number.parseInt(totalInstructors[0].count),
        totalCourses: Number.parseInt(totalCourses[0].count),
        totalEnrollments: Number.parseInt(totalEnrollments[0].count),
        totalRevenue: Number.parseFloat(revenue[0].total_revenue || 0),
      },
      monthlyData,
      courseDistribution,
      categoryStats,
    })
  } catch (error) {
    console.error("Admin dashboard error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
