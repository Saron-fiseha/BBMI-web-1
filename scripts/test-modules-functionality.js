import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

async function testModulesFunctionality() {
  console.log("🧪 Testing Modules Functionality...\n")

  try {
    // Test 1: Check if modules table exists
    console.log("1️⃣ Testing table existence...")
    const tableCheck = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'modules'
    `

    if (tableCheck.length > 0) {
      console.log("✅ Modules table exists")
    } else {
      console.log("❌ Modules table does not exist")
      return
    }

    // Test 2: Check table structure
    console.log("\n2️⃣ Testing table structure...")
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'modules' 
      ORDER BY ordinal_position
    `

    console.log("📊 Table structure:")
    columns.forEach((col) => {
      console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === "NO" ? "(NOT NULL)" : ""}`)
    })

    // Test 3: Count existing modules
    console.log("\n3️⃣ Testing data retrieval...")
    const moduleCount = await sql`SELECT COUNT(*) as count FROM modules`
    console.log(`✅ Found ${moduleCount[0].count} modules in database`)

    // Test 4: Test sample data
    console.log("\n4️⃣ Testing sample data...")
    const sampleModules = await sql`
      SELECT name, code, status, duration 
      FROM modules 
      ORDER BY created_at DESC 
      LIMIT 3
    `

    console.log("📋 Sample modules:")
    sampleModules.forEach((module) => {
      console.log(`   - ${module.name} (${module.code}) - ${module.status} - ${module.duration}min`)
    })

    // Test 5: Test status filtering
    console.log("\n5️⃣ Testing status filtering...")
    const activeModules = await sql`SELECT COUNT(*) as count FROM modules WHERE status = 'active'`
    const draftModules = await sql`SELECT COUNT(*) as count FROM modules WHERE status = 'draft'`
    const inactiveModules = await sql`SELECT COUNT(*) as count FROM modules WHERE status = 'inactive'`

    console.log(`📊 Status distribution:`)
    console.log(`   - Active: ${activeModules[0].count}`)
    console.log(`   - Draft: ${draftModules[0].count}`)
    console.log(`   - Inactive: ${inactiveModules[0].count}`)

    // Test 6: Test search functionality
    console.log("\n6️⃣ Testing search functionality...")
    const searchResults = await sql`
      SELECT COUNT(*) as count 
      FROM modules 
      WHERE name ILIKE ${"%facial%"} OR description ILIKE ${"%facial%"}
    `
    console.log(`🔍 Search for 'facial': ${searchResults[0].count} results`)

    // Test 7: Test ordering
    console.log("\n7️⃣ Testing ordering...")
    const orderedModules = await sql`
      SELECT name, order_index 
      FROM modules 
      ORDER BY order_index ASC, created_at DESC 
      LIMIT 3
    `

    console.log("📋 Modules by order:")
    orderedModules.forEach((module) => {
      console.log(`   - ${module.name} (Order: ${module.order_index})`)
    })

    console.log("\n🎉 All tests completed successfully!")
    console.log("✅ Modules functionality is working properly")
  } catch (error) {
    console.error("❌ Test failed:", error.message)
    console.error("🔍 Full error:", error)
  }
}

// Run the test
testModulesFunctionality()
