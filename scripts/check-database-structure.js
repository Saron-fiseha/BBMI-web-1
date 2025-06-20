import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

async function checkDatabaseStructure() {
  try {
    console.log("🔍 Checking database structure...")

    // Check if categories table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'categories'
      );
    `

    console.log("📊 Categories table exists:", tableExists[0].exists)

    if (tableExists[0].exists) {
      // Get table structure
      const columns = await sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'categories'
        ORDER BY ordinal_position;
      `

      console.log("📋 Categories table structure:")
      columns.forEach((col) => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`)
      })

      // Count records
      const count = await sql`SELECT COUNT(*) as total FROM categories`
      console.log(`📊 Total categories: ${count[0].total}`)

      // Show sample data
      const sample = await sql`SELECT id, name, level, status FROM categories LIMIT 3`
      console.log("📝 Sample categories:")
      sample.forEach((cat) => {
        console.log(`  - ${cat.id}: ${cat.name} (${cat.level}, ${cat.status})`)
      })
    }

    // Check other tables
    const allTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `

    console.log("📋 All tables in database:")
    allTables.forEach((table) => {
      console.log(`  - ${table.table_name}`)
    })

    console.log("✅ Database structure check completed")
  } catch (error) {
    console.error("❌ Error checking database structure:", error)
  }
}

checkDatabaseStructure()
