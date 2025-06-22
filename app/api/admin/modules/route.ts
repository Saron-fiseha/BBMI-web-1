import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  console.log("🔍 API: Fetching modules...")
  try {
    const modules = await sql`
      SELECT 
        m.*,
        COALESCE(t.name, 'No Program') as program_name
      FROM modules m
      LEFT JOIN trainings t ON m.training_id::text = t.id::text
      ORDER BY m.created_at DESC
    `

    console.log("✅ API: Query successful, found modules:", modules.length)

    return NextResponse.json(
      modules.map((module) => ({
        id: module.id,
        name: module.name,
        description: module.description,
        moduleCode: module.code,
        programId: module.training_id,
        programName: module.program_name,
        videoId: module.video_url,
        duration: module.duration,
        order: module.order_index,
        status: module.status,
        createdAt: module.created_at,
      })),
    )
  } catch (error) {
    console.error("❌ API: Error fetching modules:", error)
    return NextResponse.json({ error: "Failed to fetch modules" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log("📝 API: Creating new module...")
  try {
    const body = await request.json()
    const { name, description, moduleCode, programId, programName, videoId, duration, order, status } = body

    console.log("📊 API: Module data received:", { name, moduleCode, status })

    const result = await sql`
      INSERT INTO modules (
        name, description, code, training_id, video_url, 
        duration, order_index, status, created_at, updated_at
      )
      VALUES (
        ${name}, ${description}, ${moduleCode}, ${programId}, ${videoId},
        ${duration}, ${order}, ${status || "draft"}, NOW(), NOW()
      )
      RETURNING *
    `

    const newModule = result[0]
    console.log("✅ API: Module created successfully:", newModule.id)

    return NextResponse.json({
      id: newModule.id,
      name: newModule.name,
      description: newModule.description,
      moduleCode: newModule.code,
      programId: newModule.training_id,
      programName: programName,
      videoId: newModule.video_url,
      duration: newModule.duration,
      order: newModule.order_index,
      status: newModule.status,
      createdAt: newModule.created_at,
    })
  } catch (error) {
    console.error("❌ API: Error creating module:", error)
    return NextResponse.json({ error: "Failed to create module" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  console.log("🔄 API: Updating module...")
  try {
    const body = await request.json()
    const { id, name, description, moduleCode, programId, programName, videoId, duration, order, status } = body

    console.log("📊 API: Update data received:", { id, name, moduleCode, status })

    const result = await sql`
      UPDATE modules 
      SET 
        name = ${name},
        description = ${description},
        code = ${moduleCode},
        training_id = ${programId},
        video_url = ${videoId},
        duration = ${duration},
        order_index = ${order},
        status = ${status},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      console.log("❌ API: Module not found for update:", id)
      return NextResponse.json({ error: "Module not found" }, { status: 404 })
    }

    const updatedModule = result[0]
    console.log("✅ API: Module updated successfully:", updatedModule.id)

    return NextResponse.json({
      id: updatedModule.id,
      name: updatedModule.name,
      description: updatedModule.description,
      moduleCode: updatedModule.code,
      programId: updatedModule.training_id,
      programName: programName,
      videoId: updatedModule.video_url,
      duration: updatedModule.duration,
      order: updatedModule.order_index,
      status: updatedModule.status,
      createdAt: updatedModule.created_at,
    })
  } catch (error) {
    console.error("❌ API: Error updating module:", error)
    return NextResponse.json({ error: "Failed to update module" }, { status: 500 })
  }
}
