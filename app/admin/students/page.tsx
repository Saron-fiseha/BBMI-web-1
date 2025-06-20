"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Search, Download, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Student {
  id: string
  name: string
  email: string
  phone: string
  enrolledCourses: number
  completedCourses: number
  totalHours: number
  joinDate: string
  lastActive: string
  status: "active" | "inactive" | "suspended"
}

export default function StudentsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      enrolledCourses: 3,
      completedCourses: 1,
      totalHours: 45,
      joinDate: "2024-01-15",
      lastActive: "2024-06-15",
      status: "active",
    },
    {
      id: "2",
      name: "Emily Davis",
      email: "emily.davis@email.com",
      phone: "+1 (555) 234-5678",
      enrolledCourses: 2,
      completedCourses: 2,
      totalHours: 78,
      joinDate: "2024-02-10",
      lastActive: "2024-06-14",
      status: "active",
    },
    {
      id: "3",
      name: "Jessica Wilson",
      email: "jessica.wilson@email.com",
      phone: "+1 (555) 345-6789",
      enrolledCourses: 1,
      completedCourses: 0,
      totalHours: 12,
      joinDate: "2024-03-05",
      lastActive: "2024-05-20",
      status: "inactive",
    },
  ])

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || student.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleDeleteStudent = (studentId: string) => {
    setStudents(students.filter((student) => student.id !== studentId))
    toast({
      title: "Student removed",
      description: "Student has been removed successfully.",
    })
  }

  const handleResetPassword = (studentId: string) => {
    toast({
      title: "Password reset",
      description: "Password reset email has been sent to the student.",
    })
  }

  const exportStudents = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Email,Phone,Enrolled,Completed,Hours,Status,Join Date\n" +
      filteredStudents
        .map(
          (s) =>
            `"${s.name}","${s.email}","${s.phone}",${s.enrolledCourses},${s.completedCourses},${s.totalHours},"${s.status}","${s.joinDate}"`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "students.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students Management</h1>
          <p className="text-gray-600">Manage all registered students</p>
        </div>
        <Button variant="outline" onClick={exportStudents}>
          <Download className="h-4 w-4 mr-2" />
          Export Students
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Students ({filteredStudents.length})</CardTitle>
          <CardDescription>Complete list of registered students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Student</th>
                  <th className="text-left p-4">Contact</th>
                  <th className="text-left p-4">Courses</th>
                  <th className="text-left p-4">Progress</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Last Active</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-gray-500">Joined {student.joinDate}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="text-sm">{student.email}</div>
                        <div className="text-sm text-gray-500">{student.phone}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="text-sm">Enrolled: {student.enrolledCourses}</div>
                        <div className="text-sm text-gray-500">Completed: {student.completedCourses}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="text-sm">{student.totalHours} hours</div>
                        <div className="text-sm text-gray-500">
                          {Math.round((student.completedCourses / student.enrolledCourses) * 100) || 0}% complete
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(student.status)}>{student.status}</Badge>
                    </td>
                    <td className="p-4 text-sm text-gray-500">{student.lastActive}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" title="Edit Student">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          title="Reset Password"
                          onClick={() => handleResetPassword(student.id)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          title="Delete Student"
                          onClick={() => handleDeleteStudent(student.id)}
                        >
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
    </div>
  )
}
