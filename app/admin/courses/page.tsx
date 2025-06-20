"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"

export default function AdminCoursesPage() {
  const courses = [
    { id: 1, name: "Advanced Makeup Techniques", category: "Makeup", students: 45, status: "active" },
    { id: 2, name: "Hair Styling Fundamentals", category: "Hair", students: 38, status: "active" },
    { id: 3, name: "Skincare Specialist", category: "Skincare", students: 29, status: "draft" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
              <p className="text-gray-600">Manage all training courses</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Course
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Courses</CardTitle>
            <CardDescription>Complete list of training courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Course Name</th>
                    <th className="text-left p-4">Category</th>
                    <th className="text-left p-4">Students</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="border-b">
                      <td className="p-4 font-medium">{course.name}</td>
                      <td className="p-4">{course.category}</td>
                      <td className="p-4">{course.students}</td>
                      <td className="p-4">
                        <Badge variant={course.status === "active" ? "default" : "secondary"}>{course.status}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
