import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 GET /api/admin/categories - Starting fetch")

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const level = searchParams.get("level") || "all"

    console.log("🔍 Search params:", { search, level })

    // Base query using tagged template literals - removed the problematic courses join
    let categories

    if (search && level !== "all") {
      // Both search and level filter
      categories = await sql`
        SELECT 
          c.id,
          c.name,
          c.description,
          c.image_url,
          c.level,
          c.status,
          c.created_at,
          c.updated_at,
          0 as trainings_count
        FROM categories c
        WHERE (c.name ILIKE ${`%${search}%`} OR c.description ILIKE ${`%${search}%`})
        AND c.level = ${level}
        ORDER BY c.created_at DESC
      `
    } else if (search) {
      // Only search filter
      categories = await sql`
        SELECT 
          c.id,
          c.name,
          c.description,
          c.image_url,
          c.level,
          c.status,
          c.created_at,
          c.updated_at,
          0 as trainings_count
        FROM categories c
        WHERE (c.name ILIKE ${`%${search}%`} OR c.description ILIKE ${`%${search}%`})
        ORDER BY c.created_at DESC
      `
    } else if (level !== "all") {
      // Only level filter
      categories = await sql`
        SELECT 
          c.id,
          c.name,
          c.description,
          c.image_url,
          c.level,
          c.status,
          c.created_at,
          c.updated_at,
          0 as trainings_count
        FROM categories c
        WHERE c.level = ${level}
        ORDER BY c.created_at DESC
      `
    } else {
      // No filters
      categories = await sql`
        SELECT 
          c.id,
          c.name,
          c.description,
          c.image_url,
          c.level,
          c.status,
          c.created_at,
          c.updated_at,
          0 as trainings_count
        FROM categories c
        ORDER BY c.created_at DESC
      `
    }

    console.log("✅ Query successful, found categories:", categories.length)
    console.log("📊 Categories data:", categories)

    return NextResponse.json({
      categories,
      success: true,
      count: categories.length,
    })
  } catch (error) {
    console.error("❌ Categories fetch error:", error)
    console.error("❌ Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
    })

    return NextResponse.json(
      {
        error: "Failed to fetch categories",
        details: error instanceof Error ? error.message : "Unknown error",
        categories: [],
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 POST /api/admin/categories - Starting creation")

    const body = await request.json()
    console.log("📝 Request body:", body)

    const { name, description, image_url, level } = body

    // Validation
    if (!name || !description) {
      console.log("❌ Validation failed: Missing required fields")
      return NextResponse.json(
        {
          error: "Name and description are required",
          success: false,
        },
        { status: 400 },
      )
    }

    if (name.trim().length === 0 || description.trim().length === 0) {
      console.log("❌ Validation failed: Empty fields")
      return NextResponse.json(
        {
          error: "Name and description cannot be empty",
          success: false,
        },
        { status: 400 },
      )
    }

    console.log("✅ Validation passed, inserting into database...")

    // Test database connection first
    try {
      await sql`SELECT 1 as test`
      console.log("✅ Database connection successful")
    } catch (dbError) {
      console.error("❌ Database connection failed:", dbError)
      return NextResponse.json(
        {
          error: "Database connection failed",
          success: false,
        },
        { status: 500 },
      )
    }

    // Insert the category using tagged template literals
    const result = await sql`
      INSERT INTO categories (name, description, image_url, level, status, created_at, updated_at)
      VALUES (${name.trim()}, ${description.trim()}, ${image_url || ""}, ${level || "beginner"}, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, name, description, image_url, level, status, created_at, updated_at
    `

    console.log("✅ Insert successful, result:", result)

    if (!result || result.length === 0) {
      console.error("❌ No result returned from insert")
      return NextResponse.json(
        {
          error: "Failed to create category - no result returned",
          success: false,
        },
        { status: 500 },
      )
    }

    const newCategory = result[0]
    console.log("🎉 Category created successfully:", newCategory)

    return NextResponse.json({
      category: newCategory,
      success: true,
      message: "Category created successfully",
    })
  } catch (error) {
    console.error("❌ Category creation error:", error)
    console.error("❌ Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
    })

    return NextResponse.json(
      {
        error: "Failed to create category",
        details: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("🔄 PUT /api/admin/categories - Starting update")

    const { id, name, description, image_url, level, status } = await request.json()

    if (!id || !name || !description) {
      return NextResponse.json(
        {
          error: "ID, name and description are required",
          success: false,
        },
        { status: 400 },
      )
    }

    const result = await sql`
      UPDATE categories 
      SET name = ${name}, description = ${description}, image_url = ${image_url || ""}, 
          level = ${level || "beginner"}, status = ${status || "active"}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, name, description, image_url, level, status, created_at, updated_at
    `

    if (result.length === 0) {
      return NextResponse.json(
        {
          error: "Category not found",
          success: false,
        },
        { status: 404 },
      )
    }

    console.log("✅ Category updated successfully:", result[0])

    return NextResponse.json({
      category: result[0],
      success: true,
    })
  } catch (error) {
    console.error("❌ Category update error:", error)
    return NextResponse.json(
      {
        error: "Failed to update category",
        success: false,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log("🗑️ DELETE /api/admin/categories - Starting deletion")

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        {
          error: "Category ID is required",
          success: false,
        },
        { status: 400 },
      )
    }

    await sql`DELETE FROM categories WHERE id = ${id}`

    console.log("✅ Category deleted successfully")

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    })
  } catch (error) {
    console.error("❌ Category deletion error:", error)
    return NextResponse.json(
      {
        error: "Failed to delete category",
        success: false,
      },
      { status: 500 },
    )
  }
}
