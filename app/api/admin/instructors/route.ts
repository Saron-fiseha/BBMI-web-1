import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

// GET - Fetch instructors with search and filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "all"
    const specialization = searchParams.get("specialization") || "all"

    const baseQuery = sql`
      SELECT 
        i.*,
        COUNT(s.id) as upcoming_sessions
      FROM instructors i
      LEFT JOIN instructor_sessions s ON i.id = s.instructor_id 
        AND s.session_date >= CURRENT_DATE 
        AND s.status = 'scheduled'
      WHERE 1=1
    `

    // Build dynamic query based on filters
    if (search && status !== "all" && specialization !== "all") {
      const result = await sql`
        SELECT 
          i.*,
          COUNT(s.id) as upcoming_sessions
        FROM instructors i
        LEFT JOIN instructor_sessions s ON i.id = s.instructor_id 
          AND s.session_date >= CURRENT_DATE 
          AND s.status = 'scheduled'
        WHERE (i.name ILIKE ${`%${search}%`} OR i.email ILIKE ${`%${search}%`} OR i.specialization ILIKE ${`%${search}%`})
          AND i.status = ${status}
          AND i.specialization = ${specialization}
        GROUP BY i.id 
        ORDER BY i.created_at DESC
      `
      return NextResponse.json({ instructors: result })
    } else if (search && status !== "all") {
      const result = await sql`
        SELECT 
          i.*,
          COUNT(s.id) as upcoming_sessions
        FROM instructors i
        LEFT JOIN instructor_sessions s ON i.id = s.instructor_id 
          AND s.session_date >= CURRENT_DATE 
          AND s.status = 'scheduled'
        WHERE (i.name ILIKE ${`%${search}%`} OR i.email ILIKE ${`%${search}%`} OR i.specialization ILIKE ${`%${search}%`})
          AND i.status = ${status}
        GROUP BY i.id 
        ORDER BY i.created_at DESC
      `
      return NextResponse.json({ instructors: result })
    } else if (search && specialization !== "all") {
      const result = await sql`
        SELECT 
          i.*,
          COUNT(s.id) as upcoming_sessions
        FROM instructors i
        LEFT JOIN instructor_sessions s ON i.id = s.instructor_id 
          AND s.session_date >= CURRENT_DATE 
          AND s.status = 'scheduled'
        WHERE (i.name ILIKE ${`%${search}%`} OR i.email ILIKE ${`%${search}%`} OR i.specialization ILIKE ${`%${search}%`})
          AND i.specialization = ${specialization}
        GROUP BY i.id 
        ORDER BY i.created_at DESC
      `
      return NextResponse.json({ instructors: result })
    } else if (status !== "all" && specialization !== "all") {
      const result = await sql`
        SELECT 
          i.*,
          COUNT(s.id) as upcoming_sessions
        FROM instructors i
        LEFT JOIN instructor_sessions s ON i.id = s.instructor_id 
          AND s.session_date >= CURRENT_DATE 
          AND s.status = 'scheduled'
        WHERE i.status = ${status}
          AND i.specialization = ${specialization}
        GROUP BY i.id 
        ORDER BY i.created_at DESC
      `
      return NextResponse.json({ instructors: result })
    } else if (search) {
      const result = await sql`
        SELECT 
          i.*,
          COUNT(s.id) as upcoming_sessions
        FROM instructors i
        LEFT JOIN instructor_sessions s ON i.id = s.instructor_id 
          AND s.session_date >= CURRENT_DATE 
          AND s.status = 'scheduled'
        WHERE (i.name ILIKE ${`%${search}%`} OR i.email ILIKE ${`%${search}%`} OR i.specialization ILIKE ${`%${search}%`})
        GROUP BY i.id 
        ORDER BY i.created_at DESC
      `
      return NextResponse.json({ instructors: result })
    } else if (status !== "all") {
      const result = await sql`
        SELECT 
          i.*,
          COUNT(s.id) as upcoming_sessions
        FROM instructors i
        LEFT JOIN instructor_sessions s ON i.id = s.instructor_id 
          AND s.session_date >= CURRENT_DATE 
          AND s.status = 'scheduled'
        WHERE i.status = ${status}
        GROUP BY i.id 
        ORDER BY i.created_at DESC
      `
      return NextResponse.json({ instructors: result })
    } else if (specialization !== "all") {
      const result = await sql`
        SELECT 
          i.*,
          COUNT(s.id) as upcoming_sessions
        FROM instructors i
        LEFT JOIN instructor_sessions s ON i.id = s.instructor_id 
          AND s.session_date >= CURRENT_DATE 
          AND s.status = 'scheduled'
        WHERE i.specialization = ${specialization}
        GROUP BY i.id 
        ORDER BY i.created_at DESC
      `
      return NextResponse.json({ instructors: result })
    } else {
      const result = await sql`
        SELECT 
          i.*,
          COUNT(s.id) as upcoming_sessions
        FROM instructors i
        LEFT JOIN instructor_sessions s ON i.id = s.instructor_id 
          AND s.session_date >= CURRENT_DATE 
          AND s.status = 'scheduled'
        GROUP BY i.id 
        ORDER BY i.created_at DESC
      `
      return NextResponse.json({ instructors: result })
    }
  } catch (error) {
    console.error("Error fetching instructors:", error)
    return NextResponse.json({ error: "Failed to fetch instructors" }, { status: 500 })
  }
}

// POST - Create new instructor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, specialization, experience, status, password } = body

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    const result = await sql`
      INSERT INTO instructors (name, email, phone, specialization, experience, status, password_hash)
      VALUES (${name}, ${email}, ${phone}, ${specialization}, ${experience}, ${status}, ${passwordHash})
      RETURNING *
    `

    return NextResponse.json({ instructor: result[0] })
  } catch (error) {
    console.error("Error creating instructor:", error)
    return NextResponse.json({ error: "Failed to create instructor" }, { status: 500 })
  }
}

// PUT - Update instructor
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, email, phone, specialization, experience, status, password } = body

    let result
    if (password) {
      const passwordHash = await bcrypt.hash(password, 10)
      result = await sql`
        UPDATE instructors 
        SET name = ${name}, email = ${email}, phone = ${phone}, specialization = ${specialization}, 
            experience = ${experience}, status = ${status}, password_hash = ${passwordHash}, 
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `
    } else {
      result = await sql`
        UPDATE instructors 
        SET name = ${name}, email = ${email}, phone = ${phone}, specialization = ${specialization}, 
            experience = ${experience}, status = ${status}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `
    }

    return NextResponse.json({ instructor: result[0] })
  } catch (error) {
    console.error("Error updating instructor:", error)
    return NextResponse.json({ error: "Failed to update instructor" }, { status: 500 })
  }
}

// DELETE - Delete instructor
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Instructor ID is required" }, { status: 400 })
    }

    await sql`DELETE FROM instructors WHERE id = ${id}`
    return NextResponse.json({ message: "Instructor deleted successfully" })
  } catch (error) {
    console.error("Error deleting instructor:", error)
    return NextResponse.json({ error: "Failed to delete instructor" }, { status: 500 })
  }
}