"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Play } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Enrollment {
  id: number
  course_id: number
  title: string
  description: string
  image_url: string
  progress: number
  payment_status: string
  last_accessed: string
  next_lesson: string
  instructor_name: string
  duration_hours: number
  modules_count: number
  completed_modules: number
  total_modules: number
}

export default function StudentCoursesPage() {
  const { toast } = useToast()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  // Mock user ID - in real app, get from auth context
  const userId = 1

  useEffect(() => {
    fetchEnrollments()
  }, [])

  const fetchEnrollments = async () => {
    try {
      const response = await fetch(`/api/enrollments/student?userId=${userId}`)
      const data = await response.json()

      if (response.ok) {
        setEnrollments(data.enrollments)
      } else {
        toast({
          title: "Error",
          description: "Failed to load courses",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Enrollments fetch error:", error)
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateLastAccessed = async (courseId: number) => {
    try {
      await fetch("/api/enrollments/update-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, courseId }),
      })
      // Refresh data
      fetchEnrollments()
    } catch (error) {
      console.error("Update access error:", error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <DashboardHeader heading="My Courses" text="Loading your courses..." />
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DashboardHeader heading="My Courses" text="Track your progress and continue learning." />

      <div className="grid gap-6">
        {enrollments.map((enrollment) => (
          <Card key={enrollment.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 lg:w-1/4">
                <img
                  src={enrollment.image_url || "/placeholder.svg?height=200&width=300"}
                  alt={enrollment.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="w-full md:w-2/3 lg:w-3/4 p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{enrollment.title}</h3>
                  <Badge variant={enrollment.payment_status === "completed" ? "default" : "secondary"}>
                    {enrollment.payment_status === "completed" ? "Paid" : "Free"}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  Instructor: {enrollment.instructor_name} • {enrollment.duration_hours} hours
                </p>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{Math.round(enrollment.progress)}%</span>
                  </div>
                  <Progress value={enrollment.progress} />
                  <p className="text-xs text-muted-foreground mt-1">
                    {enrollment.completed_modules} of {enrollment.total_modules} modules completed
                  </p>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    {enrollment.next_lesson && (
                      <div className="flex items-start space-x-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm">Next Lesson:</p>
                          <p className="text-sm font-medium">{enrollment.next_lesson}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Last accessed {new Date(enrollment.last_accessed).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {enrollment.progress < 100 ? (
                      <Button asChild onClick={() => updateLastAccessed(enrollment.course_id)}>
                        <Link href={`/courses/${enrollment.course_id}`}>
                          <Play className="h-4 w-4 mr-2" />
                          Continue Learning
                        </Link>
                      </Button>
                    ) : (
                      <>
                        <Button asChild variant="outline">
                          <Link href={`/dashboard/certificates?course=${enrollment.course_id}`}>View Certificate</Link>
                        </Button>
                        <Button asChild>
                          <Link href={`/courses/${enrollment.course_id}`}>Review Course</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {enrollments.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Courses Enrolled</h3>
            <p className="text-muted-foreground mb-6">
              You haven't enrolled in any courses yet. Start your learning journey today!
            </p>
            <Button asChild>
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
        </Card>
      )}

      <div className="mt-8 text-center">
        <Button variant="outline" asChild>
          <Link href="/courses">Browse More Courses</Link>
        </Button>
      </div>
    </div>
  )
}
