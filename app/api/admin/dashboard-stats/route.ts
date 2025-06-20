import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Get total users
    const usersResult = await sql`SELECT COUNT(*) as count FROM users`
    const totalUsers = Number.parseInt(usersResult[0].count)

    // Get total courses
    const coursesResult = await sql`SELECT COUNT(*) as count FROM courses`
    const totalCourses = Number.parseInt(coursesResult[0].count)

    // Get total enrollments
    const enrollmentsResult = await sql`SELECT COUNT(*) as count FROM enrollments`
    const totalEnrollments = Number.parseInt(enrollmentsResult[0].count)

    // Get revenue (mock data for now)
    const totalRevenue = 25000

    return NextResponse.json({
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
