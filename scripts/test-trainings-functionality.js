import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

async function testTrainingsFunctionality() {
  try {
    console.log("🧪 Testing trainings functionality...")

    // 1. Check if trainings table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'trainings'
      );
    `

    console.log("📊 Trainings table exists:", tableExists[0].exists)

    if (tableExists[0].exists) {
      // 2. Get table structure
      const columns = await sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'trainings'
        ORDER BY ordinal_position;
      `

      console.log("📋 Trainings table structure:")
      columns.forEach((col) => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`)
      })

      // 3. Count records
      const count = await sql`SELECT COUNT(*) as total FROM trainings`
      console.log(`📊 Total trainings: ${count[0].total}`)

      // 4. Test basic query
      const trainings = await sql`
        SELECT 
          t.*,
          COALESCE(c.name, 'Unknown') as category_name,
          0 as current_trainees,
          0 as modules_count
        FROM trainings t
        LEFT JOIN categories c ON t.category_id::text = c.id::text
        ORDER BY t.created_at DESC
        LIMIT 3
      `

      console.log("📝 Sample trainings with categories:")
      trainings.forEach((training) => {
        console.log(`  - ${training.name} (${training.course_code}) - Category: ${training.category_name}`)
      })

      // 5. Test filtered query
      const activeTrainings = await sql`
        SELECT COUNT(*) as count FROM trainings WHERE status = 'active'
      `
      console.log(`✅ Active trainings: ${activeTrainings[0].count}`)

      // 6. Test category relationship
      const categoriesCount = await sql`SELECT COUNT(*) as count FROM categories`
      console.log(`📊 Available categories: ${categoriesCount[0].count}`)
    } else {
      console.log("❌ Trainings table does not exist - run the setup script first")
    }

    console.log("✅ Trainings functionality test completed")
  } catch (error) {
    console.error("❌ Error testing trainings functionality:", error)
  }
}

testTrainingsFunctionality()
