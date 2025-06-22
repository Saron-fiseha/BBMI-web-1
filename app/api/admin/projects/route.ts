import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const type = searchParams.get("type") || "all"
    const status = searchParams.get("status") || "all"

    // Build query based on filters using tagged template literals
    if (search && type !== "all" && status !== "all") {
      const projects = await sql`
        SELECT 
          p.*,
          0 as trainings_count,
          0 as students_count
        FROM projects p
        WHERE (p.name ILIKE ${`%${search}%`} OR p.mentor_name ILIKE ${`%${search}%`} OR p.description ILIKE ${`%${search}%`})
        AND p.type = ${type}
        AND p.status = ${status}
        ORDER BY p.created_at DESC
      `
      return NextResponse.json({ projects })
    } else if (search && type !== "all") {
      const projects = await sql`
        SELECT 
          p.*,
          0 as trainings_count,
          0 as students_count
        FROM projects p
        WHERE (p.name ILIKE ${`%${search}%`} OR p.mentor_name ILIKE ${`%${search}%`} OR p.description ILIKE ${`%${search}%`})
        AND p.type = ${type}
        ORDER BY p.created_at DESC
      `
      return NextResponse.json({ projects })
    } else if (search && status !== "all") {
      const projects = await sql`
        SELECT 
          p.*,
          0 as trainings_count,
          0 as students_count
        FROM projects p
        WHERE (p.name ILIKE ${`%${search}%`} OR p.mentor_name ILIKE ${`%${search}%`} OR p.description ILIKE ${`%${search}%`})
        AND p.status = ${status}
        ORDER BY p.created_at DESC
      `
      return NextResponse.json({ projects })
    } else if (type !== "all" && status !== "all") {
      const projects = await sql`
        SELECT 
          p.*,
          0 as trainings_count,
          0 as students_count
        FROM projects p
        WHERE p.type = ${type}
        AND p.status = ${status}
        ORDER BY p.created_at DESC
      `
      return NextResponse.json({ projects })
    } else if (search) {
      const projects = await sql`
        SELECT 
          p.*,
          0 as trainings_count,
          0 as students_count
        FROM projects p
        WHERE (p.name ILIKE ${`%${search}%`} OR p.mentor_name ILIKE ${`%${search}%`} OR p.description ILIKE ${`%${search}%`})
        ORDER BY p.created_at DESC
      `
      return NextResponse.json({ projects })
    } else if (type !== "all") {
      const projects = await sql`
        SELECT 
          p.*,
          0 as trainings_count,
          0 as students_count
        FROM projects p
        WHERE p.type = ${type}
        ORDER BY p.created_at DESC
      `
      return NextResponse.json({ projects })
    } else if (status !== "all") {
      const projects = await sql`
        SELECT 
          p.*,
          0 as trainings_count,
          0 as students_count
        FROM projects p
        WHERE p.status = ${status}
        ORDER BY p.created_at DESC
      `
      return NextResponse.json({ projects })
    } else {
      const projects = await sql`
        SELECT 
          p.*,
          0 as trainings_count,
          0 as students_count
        FROM projects p
        ORDER BY p.created_at DESC
      `
      return NextResponse.json({ projects })
    }
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
      VALUES (${name}, ${description}, ${image_url || ""}, ${type || "free"}, ${mentor_name}, ${mentor_address || ""}, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
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
          type = ${type || "free"}, mentor_name = ${mentor_name}, mentor_address = ${mentor_address || ""}, 
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
