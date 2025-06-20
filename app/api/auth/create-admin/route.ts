import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Check if admin already exists
    const existingAdmin = await sql`
      SELECT id FROM users WHERE email = ${email} AND role = 'admin'
    `

    if (existingAdmin.length > 0) {
      // Update existing admin
      await sql`
        UPDATE users 
        SET password = ${hashedPassword}
        WHERE email = ${email} AND role = 'admin'
      `
      return NextResponse.json({ message: "Admin account updated successfully" })
    } else {
      // Create new admin
      await sql`
        INSERT INTO users (email, password, role, name)
        VALUES (${email}, ${hashedPassword}, 'admin', 'Admin User')
      `
      return NextResponse.json({ message: "Admin account created successfully" })
    }
  } catch (error) {
    console.error("Create admin error:", error)
    return NextResponse.json({ error: "Failed to create admin account" }, { status: 500 })
  }
}
