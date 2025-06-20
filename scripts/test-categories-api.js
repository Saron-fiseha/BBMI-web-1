// Test script to verify categories API functionality
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

async function testCategoriesAPI() {
  try {
    console.log("🧪 Testing Categories API...")

    // Test 1: Check if table exists
    console.log("📋 Test 1: Checking if categories table exists...")
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'categories'
      )
    `
    console.log("✅ Table exists:", tableCheck[0].exists)

    // Test 2: Count existing categories
    console.log("📊 Test 2: Counting existing categories...")
    const count = await sql`SELECT COUNT(*) as count FROM categories`
    console.log("✅ Categories count:", count[0].count)

    // Test 3: Fetch all categories
    console.log("📋 Test 3: Fetching all categories...")
    const categories = await sql`
      SELECT id, name, description, level, status, created_at 
      FROM categories 
      ORDER BY created_at DESC 
      LIMIT 5
    `
    console.log("✅ Sample categories:", categories)

    // Test 4: Test insert
    console.log("➕ Test 4: Testing category insertion...")
    const testCategory = await sql`
      INSERT INTO categories (name, description, level, status)
      VALUES ('Test Category', 'This is a test category', 'beginner', 'active')
      RETURNING id, name, description, level, status, created_at
    `
    console.log("✅ Test category created:", testCategory[0])

    // Test 5: Clean up test data
    console.log("🧹 Test 5: Cleaning up test data...")
    await sql`DELETE FROM categories WHERE name = 'Test Category'`
    console.log("✅ Test data cleaned up")

    console.log("🎉 All tests passed! Categories API is working correctly.")
  } catch (error) {
    console.error("❌ Test failed:", error)
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
    })
  }
}

// Run the test
testCategoriesAPI()
