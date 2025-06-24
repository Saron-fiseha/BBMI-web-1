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

    // Get message threads for instructor
    const messages = await query(
      `
      SELECT 
        mt.id,
        u.id as student_id,
        u.name as student_name,
        u.profile_picture as student_avatar,
        mt.subject,
        (
          SELECT m.content 
          FROM messages m 
          WHERE m.thread_id = mt.id 
          ORDER BY m.created_at DESC 
          LIMIT 1
        ) as last_message,
        mt.created_at,
        mt.updated_at,
        CASE 
          WHEN mt.last_read_by_instructor IS NULL OR mt.updated_at > mt.last_read_by_instructor THEN 'unread'
          WHEN EXISTS(
            SELECT 1 FROM messages m 
            WHERE m.thread_id = mt.id 
            AND m.sender_type = 'instructor' 
            AND m.created_at = (
              SELECT MAX(created_at) FROM messages m2 WHERE m2.thread_id = mt.id
            )
          ) THEN 'replied'
          ELSE 'read'
        END as status,
        (SELECT COUNT(*) FROM messages m WHERE m.thread_id = mt.id) as message_count
      FROM message_threads mt
      INNER JOIN users u ON mt.student_id = u.id
      WHERE mt.instructor_id = ?
      ORDER BY mt.updated_at DESC
    `,
      [instructorId],
    )

    const formattedMessages = messages.rows.map((message) => ({
      id: message.id.toString(),
      student_id: message.student_id.toString(),
      student_name: message.student_name,
      student_avatar: message.student_avatar,
      subject: message.subject,
      last_message: message.last_message,
      created_at: message.created_at,
      updated_at: message.updated_at,
      status: message.status,
      message_count: Number.parseInt(message.message_count) || 0,
    }))

    return NextResponse.json(formattedMessages)
  } catch (error) {
    console.error("Error fetching instructor messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
