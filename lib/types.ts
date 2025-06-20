export interface User {
  id: string
  name: string
  email: string
  image?: string
  role: "admin" | "instructor" | "student"
}

export interface Course {
  id: string
  title: string
  description: string
  image?: string
  category: string
  level: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  students: number
  rating: number
  instructor: string
  price: number
}

export interface Lesson {
  id: string
  title: string
  description: string
  courseId: string
  videoUrl?: string
  duration: number
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  status: "active" | "completed" | "cancelled"
  progress: number
  createdAt: Date
  updatedAt: Date
}

export interface Certificate {
  id: string
  userId: string
  courseId: string
  issueDate: Date
  verificationCode: string
}

export interface Payment {
  id: string
  userId: string
  courseId: string
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "refunded"
  paymentMethod: string
  transactionId: string
  createdAt: Date
}

export interface Review {
  id: string
  userId: string
  courseId: string
  rating: number
  comment?: string
  createdAt: Date
}

export interface Appointment {
  id: string
  userId: string
  instructorId: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  status: "scheduled" | "cancelled" | "completed"
  createdAt: Date
  updatedAt: Date
}

export interface Instructor {
  id: string
  name: string
  title: string
  bio: string
  image?: string
  specialties: string[]
  experience: string
  students: number
  courses: number
  rating: number
}
