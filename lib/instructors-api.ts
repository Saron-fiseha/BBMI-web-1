export interface Instructor {
  id: string
  name: string
  email: string
  phone: string
  specialization: string
  experience: number
  status: "active" | "inactive" | "on-leave"
  courses_teaching: number
  total_students: number
  join_date: string
  last_active: string
  upcoming_sessions: number
}

export interface InstructorSession {
  id: string
  session_title: string
  session_date: string
  session_time: string
  duration_minutes: number
  student_count: number
  status: string
  course_name: string
  location: string
}

export interface CreateInstructorData {
  name: string
  email: string
  phone: string
  specialization: string
  experience: number
  status: string
  password: string
}

export interface UpdateInstructorData extends CreateInstructorData {
  id: string
  password?: string
}

export interface ResetPasswordData {
  instructorId: string
  newPassword: string
  email: string
}

class InstructorsAPI {
  private baseUrl = "/api/admin/instructors"

  async getInstructors(search?: string, status?: string, specialization?: string): Promise<Instructor[]> {
    const params = new URLSearchParams()
    if (search) params.append("search", search)
    if (status && status !== "all") params.append("status", status)
    if (specialization && specialization !== "all") params.append("specialization", specialization)

    const response = await fetch(`${this.baseUrl}?${params}`)
    if (!response.ok) throw new Error("Failed to fetch instructors")

    const data = await response.json()
    return data.instructors
  }

  async createInstructor(instructorData: CreateInstructorData): Promise<Instructor> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(instructorData),
    })

    if (!response.ok) throw new Error("Failed to create instructor")

    const data = await response.json()
    return data.instructor
  }

  async updateInstructor(instructorData: UpdateInstructorData): Promise<Instructor> {
    const response = await fetch(this.baseUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(instructorData),
    })

    if (!response.ok) throw new Error("Failed to update instructor")

    const data = await response.json()
    return data.instructor
  }

  async deleteInstructor(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}?id=${id}`, {
      method: "DELETE",
    })

    if (!response.ok) throw new Error("Failed to delete instructor")
  }

  async resetPassword(resetData: ResetPasswordData): Promise<{ name: string; email: string }> {
    const response = await fetch(`${this.baseUrl}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resetData),
    })

    if (!response.ok) throw new Error("Failed to reset password")

    const data = await response.json()
    return data.instructor
  }

  async getInstructorSessions(instructorId: string): Promise<InstructorSession[]> {
    // For now, return mock data as requested
    const mockSessions: InstructorSession[] = [
      {
        id: "1",
        session_title: "Advanced Makeup Techniques",
        session_date: "2024-06-25",
        session_time: "10:00 AM",
        duration_minutes: 120,
        student_count: 8,
        status: "scheduled",
        course_name: "Professional Makeup Artistry",
        location: "Studio A",
      },
      {
        id: "2",
        session_title: "Bridal Makeup Workshop",
        session_date: "2024-06-27",
        session_time: "2:00 PM",
        duration_minutes: 180,
        student_count: 6,
        status: "scheduled",
        course_name: "Bridal Beauty Specialist",
        location: "Studio B",
      },
      {
        id: "3",
        session_title: "Color Theory in Makeup",
        session_date: "2024-06-30",
        session_time: "9:00 AM",
        duration_minutes: 90,
        student_count: 12,
        status: "scheduled",
        course_name: "Professional Makeup Artistry",
        location: "Main Hall",
      },
    ]

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return mockSessions
  }
}

export const instructorsAPI = new InstructorsAPI()