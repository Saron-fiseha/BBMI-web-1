import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const instructorId = decoded.userId

    // Get instructor profile
    const profileResult = await query(
      `
      SELECT 
        u.*,
        ip.bio,
        ip.location,
        ip.specialties,
        ip.experience_years,
        ip.certifications,
        ip.social_links,
        COUNT(DISTINCT c.id) as total_courses,
        COUNT(DISTINCT e.user_id) as total_students,
        AVG(cr.rating) as average_rating
      FROM users u
      LEFT JOIN instructor_profiles ip ON u.id = ip.user_id
      LEFT JOIN courses c ON u.id = c.instructor_id
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN course_reviews cr ON c.id = cr.course_id
      WHERE u.id = ?
      GROUP BY u.id
    `,
      [instructorId],
    )

    if (profileResult.rows.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const profile = profileResult.rows[0]

    const formattedProfile = {
      id: profile.id.toString(),
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      bio: profile.bio,
      location: profile.location,
      profile_picture: profile.profile_picture,
      specialties: profile.specialties ? JSON.parse(profile.specialties) : [],
      experience_years: Number.parseInt(profile.experience_years) || 0,
      certifications: profile.certifications ? JSON.parse(profile.certifications) : [],
      social_links: profile.social_links ? JSON.parse(profile.social_links) : {},
      joined_date: profile.created_at,
      total_students: Number.parseInt(profile.total_students) || 0,
      total_courses: Number.parseInt(profile.total_courses) || 0,
      average_rating: Number.parseFloat(profile.average_rating) || 0,
    }

    return NextResponse.json(formattedProfile)
  } catch (error) {
    console.error("Error fetching instructor profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const instructorId = decoded.userId
    const body = await request.json()

    const { name, email, phone, bio, location, specialties, experience_years, certifications, social_links } = body

    // Update user table
    await query(
      `
      UPDATE users 
      SET name = ?, email = ?, phone = ?, updated_at = NOW()
      WHERE id = ?
    `,
      [name, email, phone, instructorId],
    )

    // Update or insert instructor profile
    await query(
      `
      INSERT INTO instructor_profiles (
        user_id, bio, location, specialties, experience_years, 
        certifications, social_links, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE
        bio = VALUES(bio),
        location = VALUES(location),
        specialties = VALUES(specialties),
        experience_years = VALUES(experience_years),
        certifications = VALUES(certifications),
        social_links = VALUES(social_links),
        updated_at = NOW()
    `,
      [
        instructorId,
        bio,
        location,
        JSON.stringify(specialties),
        experience_years,
        JSON.stringify(certifications),
        JSON.stringify(social_links),
      ],
    )

    return NextResponse.json({ message: "Profile updated successfully" })
  } catch (error) {
    console.error("Error updating instructor profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
