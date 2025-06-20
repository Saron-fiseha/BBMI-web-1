import bcrypt from "bcryptjs"
import { sql } from "../lib/db.js"

async function createAdminUser() {
  try {
    console.log("Creating admin user...")

    // Hash the password properly
    const password = "Admin@123"
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    console.log("Password hash generated:", hashedPassword)

    // Delete existing admin if exists
    await sql`DELETE FROM users WHERE email = 'admin@glamour.com'`

    // Insert new admin user
    const result = await sql`
      INSERT INTO users (name, email, password_hash, role, phone, address, status, created_at, updated_at) 
      VALUES (
        'System Administrator', 
        'admin@glamour.com', 
        ${hashedPassword}, 
        'admin', 
        '+1234567890', 
        '123 Admin Street, Admin City', 
        'active', 
        NOW(), 
        NOW()
      )
      RETURNING id, name, email, role
    `

    console.log("Admin user created successfully:", result[0])

    // Verify the user can be found
    const verification = await sql`
      SELECT id, name, email, role, status 
      FROM users 
      WHERE email = 'admin@glamour.com'
    `

    console.log("Verification:", verification[0])

    // Test password verification
    const testUser = await sql`
      SELECT password_hash 
      FROM users 
      WHERE email = 'admin@glamour.com'
    `

    const isValid = await bcrypt.compare(password, testUser[0].password_hash)
    console.log("Password verification test:", isValid ? "PASSED" : "FAILED")
  } catch (error) {
    console.error("Error creating admin user:", error)
  }
}

createAdminUser()
