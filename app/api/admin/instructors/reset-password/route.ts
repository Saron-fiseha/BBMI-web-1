import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

// POST - Reset instructor password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { instructorId, newPassword, email } = body

    if (!instructorId || !newPassword || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 10)

    // Update password in database
    const result = await sql`
      UPDATE instructors 
      SET password_hash = ${passwordHash}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${instructorId} AND email = ${email}
      RETURNING name, email
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 })
    }

    const instructor = result[0]

    // Here you would typically send an email notification
    // For now, we'll just simulate the email sending
    console.log(`Password reset email would be sent to: ${instructor.email}`)
    console.log(`New password for ${instructor.name}: ${newPassword}`)

    // In a real application, you would use a service like:
    // - SendGrid
    // - AWS SES
    // - Nodemailer
    // - Resend

    // Example email content:
    const emailContent = {
      to: instructor.email,
      subject: "Password Reset - Beauty Salon LMS",
      body: `
        Dear ${instructor.name},
        
        Your password has been reset by an administrator.
        Your new temporary password is: ${newPassword}
        
        Please log in and change your password immediately.
        
        Best regards,
        Beauty Salon LMS Team
      `,
    }

    return NextResponse.json({
      message: "Password reset successfully",
      instructor: { name: instructor.name, email: instructor.email },
    })
  } catch (error) {
    console.error("Error resetting password:", error)
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
  }
}