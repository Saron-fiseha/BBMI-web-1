import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const type = searchParams.get("type") || "all"

    let query = `
      SELECT 
        p.*,
        COALESCE((SELECT COUNT(*) FROM courses WHERE project_id = p.id), 0) as trainings_count,
        COALESCE((SELECT COUNT(DISTINCT e.user_id) FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE c.project_id = p.id), 0) as students_count
      FROM projects p
      WHERE 1=1
    `
    const params = []
    let paramIndex = 1

    if (search) {
      query += ` AND (p.name ILIKE $${paramIndex} OR p.mentor_name ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    if (type !== "all") {
      query += ` AND p.type = $${paramIndex}`
      params.push(type)
      paramIndex++
    }

    query += ` ORDER BY p.created_at DESC`

    const projects = await sql(query, params)

    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Projects fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, image_url, type, mentor_name, mentor_address } = await request.json()

    if (!name || !description || !mentor_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const project = await sql`
      INSERT INTO projects (name, description, image_url, type, mentor_name, mentor_address, status, created_at, updated_at)
      VALUES (${name}, ${description}, ${image_url || ""}, ${type}, ${mentor_name}, ${mentor_address || ""}, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `

    return NextResponse.json({ project: project[0] })
  } catch (error) {
    console.error("Project creation error:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, description, image_url, type, mentor_name, mentor_address, status } = await request.json()

    if (!id || !name || !description || !mentor_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const project = await sql`
      UPDATE projects 
      SET name = ${name}, description = ${description}, image_url = ${image_url || ""}, 
          type = ${type}, mentor_name = ${mentor_name}, mentor_address = ${mentor_address || ""}, 
          status = ${status || "active"}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (project.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ project: project[0] })
  } catch (error) {
    console.error("Project update error:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    await sql`DELETE FROM projects WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Project deletion error:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
