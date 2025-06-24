"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
// Update the path below to the correct location of instructor-layout in your project
// Try updating the import to match the actual file name and casing
// Update the import path and casing to match your actual file structure, for example:
import { InstructorLayout } from "@/components/instructor/instructor-layout"
// If your file is named differently, adjust the path and casing accordingly.
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Star, Calendar, TrendingUp, Clock, MessageSquare, Video } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

interface DashboardStats {
  totalCourses: number
  totalStudents: number
  averageRating: number
  upcomingSessions: number
  totalEarnings: number
  monthlyGrowth: string
}

interface RecentActivity {
  id: string
  type: "enrollment" | "review" | "message" | "session"
  title: string
  description: string
  time: string
  avatar?: string
}

export default function InstructorDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading && (!user || user.role !== "instructor")) {
      router.push(user ? "/dashboard" : "/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && user.role === "instructor") {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoadingData(true)

      // Fetch instructor dashboard stats
      const statsResponse = await fetch("/api/instructor/dashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (statsResponse.ok) {
        const data = await statsResponse.json()
        setStats(data.stats)
        setRecentActivity(data.recentActivity || [])
      } else {
        // Use mock data if API fails
        setStats({
          totalCourses: 3,
          totalStudents: 247,
          averageRating: 4.8,
          upcomingSessions: 2,
          totalEarnings: 12450,
          monthlyGrowth: "+15%",
        })
        setRecentActivity([
          {
            id: "1",
            type: "enrollment",
            title: "New Student Enrolled",
            description: "Sarah Johnson enrolled in Advanced Hair Styling",
            time: "2 hours ago",
          },
          {
            id: "2",
            type: "review",
            title: "New Review Received",
            description: "5-star review for Professional Makeup Artistry",
            time: "4 hours ago",
          },
          {
            id: "3",
            type: "session",
            title: "Session Reminder",
            description: "Live Q&A session starts in 30 minutes",
            time: "30 minutes",
          },
        ])
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Using sample data.",
        variant: "destructive",
      })
    } finally {
      setLoadingData(false)
    }
  }

  if (loading || !user || user.role !== "instructor") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "enrollment":
        return <Users className="h-4 w-4 text-blue-500" />
      case "review":
        return <Star className="h-4 w-4 text-yellow-500" />
      case "message":
        return <MessageSquare className="h-4 w-4 text-green-500" />
      case "session":
        return <Video className="h-4 w-4 text-purple-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user?.email}! 👋
            </h1>
            <p className="text-muted-foreground mt-2">Here's what's happening with your courses and students today.</p>
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/instructor/sessions">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Session
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {loadingData ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalCourses || 0}</div>
              <p className="text-xs text-muted-foreground">Active courses</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
              <p className="text-xs text-muted-foreground">Enrolled students</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.averageRating || 0}</div>
              <p className="text-xs text-muted-foreground">From student reviews</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.upcomingSessions || 0}</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/instructor/sessions">
                <Video className="mr-2 h-4 w-4" />
                Schedule Live Session
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/instructor/students">
                <Users className="mr-2 h-4 w-4" />
                View Students
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/instructor/reviews">
                <Star className="mr-2 h-4 w-4" />
                Check Reviews
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/instructor/messages">
                <MessageSquare className="mr-2 h-4 w-4" />
                Messages
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your courses and students</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No recent activity</h3>
                <p className="text-muted-foreground">Activity from your courses and students will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Overview
          </CardTitle>
          <CardDescription>Your teaching performance this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">${stats?.totalEarnings?.toLocaleString() || 0}</div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="text-xs text-green-600 font-medium">{stats?.monthlyGrowth || "+0%"} from last month</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats?.totalStudents || 0}</div>
              <p className="text-sm text-muted-foreground">Active Students</p>
              <p className="text-xs text-blue-600 font-medium">Across all courses</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats?.averageRating || 0}</div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
              <p className="text-xs text-yellow-600 font-medium">From student feedback</p>
            </div>
          </div>
        </CardContent>
      </Card>
      </>
  )
}





