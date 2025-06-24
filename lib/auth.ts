import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { sql } from "@/lib/db"
import { Resend } from "resend"


const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production"

export interface User {
  id: number
  full_name: string
  email: string
  phone?: string
  age?: number
  sex?: string
  role: "student" | "instructor" | "admin"
  profile_picture?: string
  email_verified: boolean
}

export interface AuthResult {
  success: boolean
  user?: User
  token?: string
  message?: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

const secretKey = new TextEncoder().encode(JWT_SECRET)

export async function generateToken(user: User): Promise<string> {
  return new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role,
    full_name: user.full_name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secretKey)
}

export async function verifyToken(token: string): Promise<any | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey)
    return payload
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

export async function registerUser(userData: {
  full_name: string
  email: string
  phone?: string
  age?: number
  sex?: string
  password: string
  profile_picture?: string
}): Promise<AuthResult> {
  try {
    console.log("Attempting to register user:", userData.email)

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${userData.email.toLowerCase()}
    `

    if (existingUser.length > 0) {
      return {
        success: false,
        message: "User with this email already exists",
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password)

    // Create user
    const result = await sql`
      INSERT INTO users (full_name, email, phone, age, sex, password_hash, profile_picture, role, email_verified)
      VALUES (
        ${userData.full_name}, 
        ${userData.email.toLowerCase()}, 
        ${userData.phone || null}, 
        ${userData.age || null}, 
        ${userData.sex || null}, 
        ${hashedPassword}, 
        ${userData.profile_picture || null}, 
        'student', 
        false
      )
      RETURNING id, full_name, email, phone, age, sex, role, profile_picture, email_verified
    `

    if (result.length === 0) {
      throw new Error("Failed to create user")
    }

    const user = result[0] as User
    const token = await generateToken(user)

    console.log("User registered successfully:", user.email)

    return {
      success: true,
      user,
      token,
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      message: "Registration failed. Please try again.",
    }
  }
}

export async function loginUser(email: string, password: string): Promise<AuthResult> {
  try {
    console.log("Attempting to login user:", email)

    // Get user by email
    const result = await sql`
      SELECT id, full_name, email, phone, age, sex, password_hash, role, profile_picture, email_verified
      FROM users 
      WHERE email = ${email.toLowerCase()}
    `

    if (result.length === 0) {
      console.log("User not found:", email)
      return {
        success: false,
        message: "Invalid email or password",
      }
    }

    const user = result[0]
    console.log("User found:", user.email, "Role:", user.role)

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash)

    if (!isValidPassword) {
      console.log("Invalid password for user:", email)
      return {
        success: false,
        message: "Invalid email or password",
      }
    }

    // Remove password hash from user object
    const { password_hash, ...userWithoutPassword } = user
    const token = await generateToken(userWithoutPassword as User)

    console.log("Login successful for user:", email, "Role:", user.role)

    return {
      success: true,
      user: userWithoutPassword as User,
      token,
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: "Login failed. Please try again.",
    }
  }
}

export async function getUserFromToken(token: string): Promise<User | null> {
  try {
    const decoded = await verifyToken(token)
    if (!decoded) return null

    // Get fresh user data from database
    const result = await sql`
      SELECT id, full_name, email, phone, age, sex, role, profile_picture, email_verified
      FROM users 
      WHERE id = ${decoded.id}
    `

    if (result.length > 0) {
      return result[0] as User
    }

    return null
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

export function generateResetToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}


const resend = new Resend(process.env.RESEND_API_KEY)

export async function createResetToken(email: string): Promise<{ success: boolean; message: string }> {
  try {

// Check if user exists
const users = await sql`
SELECT id FROM users WHERE email = ${email.toLowerCase()}
`

if (users.length === 0) {
return {
  success: false,
  message: "Email is not registered",
}
}

 // Create token and expiry
    const resetToken = generateResetToken()
    const expiresAt = new Date(Date.now() + 3600000) // 1 hour from now
 // Store token in database
    await sql`
      UPDATE users 
      SET reset_token = ${resetToken}, reset_token_expires = ${expiresAt}
      WHERE email = ${email.toLowerCase()}
    `
    // 🔒 Free Plan + No Domain = Only Test Emails Work
    // You can only send emails to test email addresses you’ve manually added in the Resend dashboard.
    // In a real app, you would send an email here
     // ✅ Send the email with the reset link
     const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

     // Send the email
    const response = await resend.emails.send({
      
      // from: "no-reply@bbmi.com", // You MUST verify this address in Resend
      from: "onboarding@resend.dev", 
      to: email,
       subject: "Reset your BBMI password",
       html: `
         <p>Hi,</p>
         <p>You requested a password reset. Click the link below to reset your password:</p>
         <p><a href="${resetUrl}">${resetUrl}</a></p>
         <p>This link will expire in 1 hour.</p>
         <p>If you didn't request this, you can ignore this email.</p>
       `,
     })
     console.log("Password reset email sent to:", email, "Response:", response)

     return {
       success: true,
       message: "Password reset link sent to your email",
     }
   } catch (error) {
     console.error("Error sending password reset email:", error)
     return {
       success: false,
       message: "Something went wrong. Please try again later.",
     }
   }
 }
 

export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  try {
    const hashedPassword = await hashPassword(newPassword)

    const result = await sql`
      UPDATE users 
      SET password_hash = ${hashedPassword}, reset_token = NULL, reset_token_expires = NULL
      WHERE reset_token = ${token} AND reset_token_expires > NOW()
      RETURNING id
    `

    return result.length > 0
  } catch (error) {
    console.error("Password reset error:", error)
    return false
  }
}
