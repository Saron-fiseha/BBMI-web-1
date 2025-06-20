"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart } from "@/components/ui/chart"
import { ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from "recharts"
import { BookOpen, Users, DollarSign, Star, PlusCircle } from "lucide-react"
import Link from "next/link"

export default function InstructorDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== "instructor")) {
      router.push(user ? "/dashboard" : "/login")
    }
  }, [user, loading, router])

  if (loading || !user || user.role !== "instructor") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  // Mock data for charts
  const earningsData = [
    { name: "Jan", earnings: 1200 },
    { name: "Feb", earnings: 1500 },
    { name: "Mar", earnings: 1800 },
    { name: "Apr", earnings: 1600 },
    { name: "May", earnings: 2000 },
    { name: "Jun", earnings: 2200 },
  ]

  const studentData = [
    { name: "Jan", students: 40 },
    { name: "Feb", students: 55 },
    { name: "Mar", students: 70 },
    { name: "Apr", students: 65 },
    { name: "May", students: 80 },
    { name: "Jun", students: 95 },
  ]

  // Mock courses data
  const courses = [
    {
      id: "1",
      title: "Advanced Hair Styling Techniques",
      students: 324,
      rating: 4.8,
      earnings: "$9,720",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "2",
      title: "Professional Makeup Artistry",
      students: 412,
      rating: 4.9,
      earnings: "$14,420",
      image: "/placeholder.svg?height=100&width=200",
    },
  ]

  // Mock upcoming sessions
  const upcomingSessions = [
    {
      id: "1",
      title: "Live Q&A: Hair Styling Techniques",
      date: "June 15, 2025",
      time: "2:00 PM - 3:30 PM",
      students: 45,
    },
    {
      id: "2",
      title: "Makeup Demo: Bridal Looks",
      date: "June 18, 2025",
      time: "1:00 PM - 2:30 PM",
      students: 62,
    },
  ]

  return (
    <DashboardLayout>
      <DashboardHeader
        heading={`Welcome back, ${user.name}`}
        text="Manage your courses, students, and view your earnings."
      >
        <Button asChild>
          <Link href="/instructor/courses/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Course
          </Link>
        </Button>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">736</div>
            <p className="text-xs text-muted-foreground">+24 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">1 in development</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,140</div>
            <p className="text-xs text-muted-foreground">+$2,100 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.85</div>
            <p className="text-xs text-muted-foreground">From 520 reviews</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="earnings" className="mt-6">
        <TabsList>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>
        <TabsContent value="earnings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
              <CardDescription>Your monthly earnings for the current year</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="earnings" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Enrollments</CardTitle>
              <CardDescription>Monthly student enrollments for the current year</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="students" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <h2 className="mt-10 mb-4 text-2xl font-bold">My Courses</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/3">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="w-full md:w-2/3 p-4">
                <h3 className="font-bold">{course.title}</h3>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Students</p>
                    <p className="font-medium">{course.students}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rating</p>
                    <p className="font-medium">{course.rating}/5</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Earnings</p>
                    <p className="font-medium">{course.earnings}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button asChild variant="outline">
                    <Link href={`/instructor/courses/${course.id}`}>Manage Course</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <h2 className="mt-10 mb-4 text-2xl font-bold">Upcoming Live Sessions</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {upcomingSessions.map((session) => (
          <Card key={session.id}>
            <CardHeader>
              <CardTitle>{session.title}</CardTitle>
              <CardDescription>
                {session.date} • {session.time}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{session.students} students enrolled</p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Edit Session
                </Button>
                <Button size="sm">Start Session</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}
