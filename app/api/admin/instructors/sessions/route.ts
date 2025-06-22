import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// GET - Fetch instructor sessions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const instructorId = searchParams.get("instructorId")

    if (!instructorId) {
      return NextResponse.json({ error: "Instructor ID is required" }, { status: 400 })
    }

    const result = await sql`
      SELECT 
        id,
        session_title,
        session_date,
        session_time,
        duration_minutes,
        student_count,
        status
      FROM instructor_sessions 
      WHERE instructor_id = ${instructorId} 
        AND session_date >= CURRENT_DATE 
      ORDER BY session_date ASC, session_time ASC
    `

    return NextResponse.json({ sessions: result })
  } catch (error) {
    console.error("Error fetching instructor sessions:", error)
    return NextResponse.json({ error: "Failed to fetch instructor sessions" }, { status: 500 })
  }
}