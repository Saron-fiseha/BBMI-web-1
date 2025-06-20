"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts"

const monthlyData = [
  { name: "Jan", students: 40, revenue: 2400 },
  { name: "Feb", students: 30, revenue: 1398 },
  { name: "Mar", students: 20, revenue: 9800 },
  { name: "Apr", students: 27, revenue: 3908 },
  { name: "May", students: 18, revenue: 4800 },
  { name: "Jun", students: 23, revenue: 3800 },
  { name: "Jul", students: 34, revenue: 4300 },
]

const modulesCourseData = [
  { name: "Makeup Artistry", modules: 12, courses: 3 },
  { name: "Hair Styling", modules: 8, courses: 2 },
  { name: "Skincare", modules: 6, courses: 2 },
  { name: "Nail Art", modules: 4, courses: 1 },
  { name: "Bridal Makeup", modules: 10, courses: 2 },
]

const studentsPerCourseData = [
  { name: "Professional Makeup", students: 45, fill: "#C5A100" },
  { name: "Hair Styling Basics", students: 32, fill: "#6B2D5C" },
  { name: "Advanced Skincare", students: 28, fill: "#F4D03F" },
  { name: "Bridal Specialist", students: 38, fill: "#8E44AD" },
  { name: "Nail Artistry", students: 22, fill: "#E67E22" },
]

const DashboardPage = () => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    newRegistrations: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push(user ? "/dashboard" : "/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchDashboardStats()
    }
  }, [user])

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setDashboardStats(data.stats)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error)
    }
  }

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-mustard"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-charcoal mb-2">Welcome back, {user.full_name}</h1>
        <p className="text-deep-purple">BBMI - Brushed by Betty Makeup Institute Administration</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-mustard/10 to-mustard/5 border-mustard/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-charcoal">Total Students</CardTitle>
            <CardDescription className="text-deep-purple">Across all courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-mustard">{dashboardStats.totalStudents || 250}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple/10 to-purple/5 border-purple/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-charcoal">Active Courses</CardTitle>
            <CardDescription className="text-deep-purple">Currently running</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-deep-purple">{dashboardStats.activeCourses || 12}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-mustard/10 to-mustard/5 border-mustard/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-charcoal">New Registrations</CardTitle>
            <CardDescription className="text-deep-purple">This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-mustard">{dashboardStats.newRegistrations || 35}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple/10 to-purple/5 border-purple/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-charcoal">Total Revenue</CardTitle>
            <CardDescription className="text-deep-purple">This year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-deep-purple">${dashboardStats.totalRevenue || 120000}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance */}
        <Card className="bg-ivory border-mustard/20">
          <CardHeader>
            <CardTitle className="text-charcoal">Monthly Performance</CardTitle>
            <CardDescription className="text-deep-purple">Students and revenue trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" stroke="#222222" />
                <YAxis stroke="#222222" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#F8F1E5",
                    border: "1px solid #C5A100",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="students" fill="#C5A100" name="Students" />
                <Bar dataKey="revenue" fill="#6B2D5C" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Modules and Courses */}
        <Card className="bg-ivory border-mustard/20">
          <CardHeader>
            <CardTitle className="text-charcoal">Modules & Courses Overview</CardTitle>
            <CardDescription className="text-deep-purple">Distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={modulesCourseData}>
                <XAxis dataKey="name" stroke="#222222" fontSize={12} />
                <YAxis stroke="#222222" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#F8F1E5",
                    border: "1px solid #C5A100",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="modules" fill="#C5A100" name="Modules" />
                <Bar dataKey="courses" fill="#6B2D5C" name="Courses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Students per Course Pie Chart */}
      <Card className="bg-ivory border-mustard/20">
        <CardHeader>
          <CardTitle className="text-charcoal">Students Distribution by Course</CardTitle>
          <CardDescription className="text-deep-purple">Current enrollment breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={studentsPerCourseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="students"
              >
                {studentsPerCourseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#F8F1E5",
                  border: "1px solid #C5A100",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Overview Section */}
      <Card className="bg-gradient-to-r from-mustard/5 to-purple/5 border-mustard/20">
        <CardHeader>
          <CardTitle className="text-charcoal">BBMI - Brushed by Betty Makeup Institute Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-deep-purple leading-relaxed">
            Welcome to the BBMI admin dashboard. Here you can monitor key metrics, manage courses, track student
            progress, and oversee all aspects of your beauty education platform. Use the sidebar to navigate between
            different administrative functions.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardPage
