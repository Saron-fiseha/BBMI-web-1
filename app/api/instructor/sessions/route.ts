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

    // Get instructor's upcoming sessions
    const sessions = await query(
      `
      SELECT 
        s.*,
        c.title as course_title,
        COALESCE(booking_stats.student_count, 0) as students
      FROM sessions s
      LEFT JOIN courses c ON s.course_id = c.id
      LEFT JOIN (
        SELECT 
          session_id, 
          COUNT(*) as student_count
        FROM session_bookings
        WHERE status = 'confirmed'
        GROUP BY session_id
      ) booking_stats ON s.id = booking_stats.session_id
      WHERE s.instructor_id = ? 
        AND s.scheduled_at > NOW()
        AND s.status IN ('scheduled', 'confirmed')
      ORDER BY s.scheduled_at ASC
      LIMIT 10
    `,
      [instructorId],
    )

    // Format the response
    const formattedSessions = sessions.rows.map((session) => {
      const scheduledDate = new Date(session.scheduled_at)
      return {
        id: session.id.toString(),
        title: session.title || `Live Session: ${session.course_title}`,
        date: scheduledDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time:
          scheduledDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }) +
          ` - ${new Date(scheduledDate.getTime() + (session.duration || 60) * 60000).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}`,
        students: Number.parseInt(session.students) || 0,
        status: session.status,
        course_id: session.course_id,
        duration: session.duration,
        meeting_url: session.meeting_url,
        description: session.description,
      }
    })

    return NextResponse.json(formattedSessions)
  } catch (error) {
    console.error("Error fetching instructor sessions:", error)
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
    const { title, description, course_id, scheduled_at, duration, meeting_url } = body

    if (!title || !scheduled_at) {
      return NextResponse.json({ error: "Title and scheduled time are required" }, { status: 400 })
    }

    await query(
      `
      INSERT INTO sessions (
        title, description, course_id, instructor_id, scheduled_at, 
        duration, meeting_url, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'scheduled', NOW(), NOW())
    `,
      [
        title,
        description || null,
        course_id || null,
        decoded.userId,
        scheduled_at,
        duration || 60,
        meeting_url || null,
      ],
    )

    // Retrieve the last inserted session (assuming 'id' is auto-increment primary key)
    const sessionResult = await query(
      `SELECT id FROM sessions WHERE instructor_id = ? AND title = ? AND scheduled_at = ? ORDER BY id DESC LIMIT 1`,
      [decoded.userId, title, scheduled_at]
    )
    const sessionId = sessionResult.rows[0]?.id

    return NextResponse.json(
      {
        id: sessionId,
        message: "Session scheduled successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
