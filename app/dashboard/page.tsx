"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Award, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface EnrolledCourse {
  id: number
  title: string
  description: string
  image_url: string
  progress: number
  payment_status: string
  price: number
  instructor_name: string
  category_name: string
  last_accessed: string
  next_lesson: string
  completed_modules: number
  total_modules: number
}

interface DashboardStats {
  total_courses: number
  avg_progress: number
  completed_courses: number
  total_spent: number
}

const DashboardPage = () => {
  const { toast } = useToast()
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock user ID - in real app, get from auth context
  const userId = 1

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`/api/dashboard/student-stats?userId=${userId}`)
      const data = await response.json()

      if (response.ok) {
        setEnrolledCourses(data.enrolledCourses)
        setStats(data.stats)
      } else {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent">
          BBMI Student Dashboard
        </h1>
        <p className="text-gray-700 mb-4">Welcome back! Here's your learning progress and upcoming activities.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Enrolled Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_courses || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Average Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats?.avg_progress || 0)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Award className="h-4 w-4 mr-2" />
              Completed Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completed_courses || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Total Investment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.total_spent || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Courses */}
      <div>
        <h2 className="text-2xl font-bold mb-4">My Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={course.image_url || "/placeholder.svg?height=200&width=300"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={course.payment_status === "completed" ? "default" : "secondary"}>
                    {course.price > 0 ? (course.payment_status === "completed" ? "Paid" : "Payment Pending") : "Free"}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription>
                  Instructor: {course.instructor_name} • {course.category_name}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{Math.round(course.progress)}%</span>
                  </div>
                  <Progress value={course.progress} />
                  <p className="text-xs text-muted-foreground mt-1">
                    {course.completed_modules} of {course.total_modules} modules completed
                  </p>
                </div>

                {course.next_lesson && (
                  <div className="flex items-start space-x-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Next: {course.next_lesson}</p>
                      <p className="text-xs text-muted-foreground">
                        Last accessed: {new Date(course.last_accessed).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                <Button asChild className="w-full">
                  <Link href={`/courses/${course.id}`}>
                    {course.progress < 100 ? "Continue Learning" : "Review Course"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {enrolledCourses.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Courses Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start your beauty education journey by enrolling in a course.
              </p>
              <Button asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button asChild variant="outline" className="h-auto p-4">
          <Link href="/dashboard/courses" className="flex flex-col items-center space-y-2">
            <BookOpen className="h-6 w-6" />
            <span>My Courses</span>
          </Link>
        </Button>

        <Button asChild variant="outline" className="h-auto p-4">
          <Link href="/dashboard/certificates" className="flex flex-col items-center space-y-2">
            <Award className="h-6 w-6" />
            <span>Certificates</span>
          </Link>
        </Button>

        <Button asChild variant="outline" className="h-auto p-4">
          <Link href="/dashboard/calendar" className="flex flex-col items-center space-y-2">
            <Calendar className="h-6 w-6" />
            <span>Live Sessions</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default DashboardPage
