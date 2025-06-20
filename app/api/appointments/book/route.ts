import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { instructorId, date, time, topic, notes, type } = body

    // Insert appointment into database
    const result = await sql`
      INSERT INTO appointments (
        student_id, instructor_id, appointment_date, appointment_time, 
        topic, notes, type, status, created_at
      ) VALUES (
        1, ${instructorId}, ${date}, ${time}, 
        ${topic}, ${notes}, ${type}, 'scheduled', NOW()
      ) RETURNING id
    `

    return NextResponse.json({
      success: true,
      id: result[0].id,
      message: "Appointment booked successfully",
    })
  } catch (error) {
    console.error("Error booking appointment:", error)
    return NextResponse.json({ error: "Failed to book appointment" }, { status: 500 })
  }
}
