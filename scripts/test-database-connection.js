import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

async function testDatabaseConnection() {
  try {
    console.log("🔍 Testing database connection...")
    console.log("📊 DATABASE_URL exists:", !!process.env.DATABASE_URL)
    console.log("📊 DATABASE_URL preview:", process.env.DATABASE_URL?.substring(0, 50) + "...")

    // Test basic connection
    const result = await sql`SELECT 1 as test, CURRENT_TIMESTAMP as now`
    console.log("✅ Database connection successful!")
    console.log("📊 Test result:", result)

    // Check if categories table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'categories'
      ) as table_exists
    `
    console.log("📊 Categories table exists:", tableCheck[0].table_exists)

    if (tableCheck[0].table_exists) {
      // Get table structure
      const structure = await sql`
        SELECT column_name, data_type, is_nullable, column_default 
        FROM information_schema.columns 
        WHERE table_name = 'categories' 
        ORDER BY ordinal_position
      `
      console.log("📊 Table structure:", structure)

      // Get sample data
      const sampleData = await sql`SELECT * FROM categories LIMIT 3`
      console.log("📊 Sample data:", sampleData)

      // Get row count
      const count = await sql`SELECT COUNT(*) as total FROM categories`
      console.log("📊 Total categories:", count[0].total)
    } else {
      console.log("❌ Categories table does not exist!")
      console.log("💡 Run the fix-categories-table-v2.sql script to create it")
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    console.error("❌ Error details:", {
      message: error.message,
      stack: error.stack,
    })
  }
}

testDatabaseConnection()
