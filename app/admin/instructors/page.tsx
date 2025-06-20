"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Search, Download, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Instructor {
  id: string
  name: string
  email: string
  phone: string
  specialization: string
  coursesTeaching: number
  totalStudents: number
  experience: number // years
  joinDate: string
  lastActive: string
  status: "active" | "inactive" | "on-leave"
}

export default function InstructorsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const [instructors, setInstructors] = useState<Instructor[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.instructor@email.com",
      phone: "+1 (555) 123-4567",
      specialization: "Makeup Artistry",
      coursesTeaching: 3,
      totalStudents: 45,
      experience: 8,
      joinDate: "2023-01-15",
      lastActive: "2024-06-15",
      status: "active",
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael.instructor@email.com",
      phone: "+1 (555) 234-5678",
      specialization: "Hair Styling",
      coursesTeaching: 2,
      totalStudents: 38,
      experience: 12,
      joinDate: "2023-03-10",
      lastActive: "2024-06-14",
      status: "active",
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "emily.instructor@email.com",
      phone: "+1 (555) 345-6789",
      specialization: "Skincare & Facial",
      coursesTeaching: 1,
      totalStudents: 22,
      experience: 6,
      joinDate: "2023-06-05",
      lastActive: "2024-05-20",
      status: "on-leave",
    },
  ])

  const [newInstructor, setNewInstructor] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: 0,
  })

  const specializations = [
    "Makeup Artistry",
    "Hair Styling",
    "Skincare & Facial",
    "Nail Care",
    "Bridal Beauty",
    "Special Effects Makeup",
  ]

  const filteredInstructors = instructors.filter((instructor) => {
    const matchesSearch =
      instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || instructor.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleCreateInstructor = () => {
    const instructor: Instructor = {
      id: Date.now().toString(),
      ...newInstructor,
      coursesTeaching: 0,
      totalStudents: 0,
      joinDate: new Date().toISOString().split("T")[0],
      lastActive: new Date().toISOString().split("T")[0],
      status: "active",
    }
    setInstructors([...instructors, instructor])
    setNewInstructor({
      name: "",
      email: "",
      phone: "",
      specialization: "",
      experience: 0,
    })
    toast({
      title: "Instructor added",
      description: `${newInstructor.name} has been added as an instructor.`,
    })
  }

  const handleDeleteInstructor = (instructorId: string) => {
    setInstructors(instructors.filter((instructor) => instructor.id !== instructorId))
    toast({
      title: "Instructor removed",
      description: "Instructor has been removed successfully.",
    })
  }

  const handleResetPassword = (instructorId: string) => {
    toast({
      title: "Password reset",
      description: "Password reset email has been sent to the instructor.",
    })
  }

  const exportInstructors = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Email,Phone,Specialization,Courses,Students,Experience,Status,Join Date\n" +
      filteredInstructors
        .map(
          (i) =>
            `"${i.name}","${i.email}","${i.phone}","${i.specialization}",${i.coursesTeaching},${i.totalStudents},${i.experience},"${i.status}","${i.joinDate}"`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "instructors.csv")
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
      case "on-leave":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instructors Management</h1>
          <p className="text-gray-600">Manage all instructors (Admin-only role assignment)</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportInstructors}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Instructor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Instructor</DialogTitle>
                <DialogDescription>Create a new instructor account (Admin only)</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      value={newInstructor.name}
                      onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })}
                      placeholder="Enter instructor name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={newInstructor.email}
                      onChange={(e) => setNewInstructor({ ...newInstructor, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      value={newInstructor.phone}
                      onChange={(e) => setNewInstructor({ ...newInstructor, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Experience (years)</label>
                    <Input
                      type="number"
                      value={newInstructor.experience}
                      onChange={(e) => setNewInstructor({ ...newInstructor, experience: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Specialization</label>
                  <Select
                    value={newInstructor.specialization}
                    onValueChange={(value) => setNewInstructor({ ...newInstructor, specialization: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateInstructor}>Add Instructor</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search instructors..."
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
            <SelectItem value="on-leave">On Leave</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Instructors Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Instructors ({filteredInstructors.length})</CardTitle>
          <CardDescription>Complete list of registered instructors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Instructor</th>
                  <th className="text-left p-4">Contact</th>
                  <th className="text-left p-4">Specialization</th>
                  <th className="text-left p-4">Teaching</th>
                  <th className="text-left p-4">Experience</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstructors.map((instructor) => (
                  <tr key={instructor.id} className="border-b">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{instructor.name}</div>
                        <div className="text-sm text-gray-500">Joined {instructor.joinDate}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="text-sm">{instructor.email}</div>
                        <div className="text-sm text-gray-500">{instructor.phone}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{instructor.specialization}</Badge>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="text-sm">{instructor.coursesTeaching} courses</div>
                        <div className="text-sm text-gray-500">{instructor.totalStudents} students</div>
                      </div>
                    </td>
                    <td className="p-4">{instructor.experience} years</td>
                    <td className="p-4">
                      <Badge className={getStatusColor(instructor.status)}>{instructor.status}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" title="Edit Instructor">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          title="Reset Password"
                          onClick={() => handleResetPassword(instructor.id)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          title="Remove Instructor"
                          onClick={() => handleDeleteInstructor(instructor.id)}
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
