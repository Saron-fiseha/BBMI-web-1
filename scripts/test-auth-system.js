import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL)

async function testAuthSystem() {
  console.log("🔍 Testing Authentication System...")

  try {
    // Test database connection
    console.log("\n1. Testing database connection...")
    const connectionTest = await sql`SELECT 1 as test`
    console.log("✅ Database connection successful")

    // Test user table
    console.log("\n2. Testing users table...")
    const users = await sql`SELECT id, email, role FROM users LIMIT 5`
    console.log("✅ Users table accessible")
    console.log("Users found:", users.length)

    // Test admin user
    console.log("\n3. Testing admin user...")
    const adminUser = await sql`
      SELECT id, full_name, email, role, password_hash 
      FROM users 
      WHERE email = 'admin@bbmi.com'
    `

    if (adminUser.length > 0) {
      console.log("✅ Admin user found:", adminUser[0].email)

      // Test password verification
      const isValidPassword = await bcrypt.compare("Admin123!", adminUser[0].password_hash)
      console.log("✅ Password verification:", isValidPassword ? "PASSED" : "FAILED")
    } else {
      console.log("❌ Admin user not found")
    }

    // Test instructor user
    console.log("\n4. Testing instructor user...")
    const instructorUser = await sql`
      SELECT id, full_name, email, role 
      FROM users 
      WHERE email = 'instructor@bbmi.com'
    `

    if (instructorUser.length > 0) {
      console.log("✅ Instructor user found:", instructorUser[0].email)
    } else {
      console.log("❌ Instructor user not found")
    }

    // Test courses
    console.log("\n5. Testing courses...")
    const courses = await sql`SELECT id, title, instructor_id FROM courses LIMIT 3`
    console.log("✅ Courses found:", courses.length)

    console.log("\n🎉 Authentication system test completed!")
    console.log("\n📋 Login Credentials:")
    console.log("Admin: admin@bbmi.com / Admin123!")
    console.log("Instructor: instructor@bbmi.com / Instructor123!")
    console.log("Student: student@bbmi.com / Student123!")
  } catch (error) {
    console.error("❌ Test failed:", error)
  }
}

testAuthSystem()
