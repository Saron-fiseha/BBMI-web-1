"use client"

import { useState, useEffect, useCallback } from "react"
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
import { Plus, Edit, Trash2, Search, Download, RotateCcw, Eye, Calendar, Clock, MapPin, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  instructorsAPI,
  type Instructor,
  type CreateInstructorData,
  type UpdateInstructorData,
  type InstructorSession,
  type ResetPasswordData,
} from "@/lib/instructors-api"

export default function InstructorsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterSpecialization, setFilterSpecialization] = useState("all")
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSessionsDialogOpen, setIsSessionsDialogOpen] = useState(false)
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false)
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null)
  const [instructorSessions, setInstructorSessions] = useState<InstructorSession[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(false)

  const [newInstructor, setNewInstructor] = useState<CreateInstructorData>({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: 0,
    status: "active",
    password: "",
  })

  const [editInstructor, setEditInstructor] = useState<UpdateInstructorData>({
    id: "",
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: 0,
    status: "active",
    password: "",
  })

  const [resetPasswordData, setResetPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
    email: "",
  })

  const specializations = [
    "Makeup Artistry",
    "Hair Styling",
    "Skincare & Facial",
    "Nail Care",
    "Bridal Beauty",
    "Special Effects Makeup",
  ]

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "on-leave", label: "On Leave" },
  ]

  // Debounced fetch function for real-time search
  const debouncedFetchInstructors = useCallback(
    debounce(async (search: string, status: string, specialization: string) => {
      try {
        setLoading(true)
        const data = await instructorsAPI.getInstructors(search.trim(), status, specialization)
        setInstructors(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch instructors",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }, 300),
    [toast],
  )

  // Simple debounce function
  function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // Fetch instructor sessions
  const fetchInstructorSessions = async (instructorId: string) => {
    try {
      setSessionsLoading(true)
      const sessions = await instructorsAPI.getInstructorSessions(instructorId)
      setInstructorSessions(sessions)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch instructor sessions",
        variant: "destructive",
      })
    } finally {
      setSessionsLoading(false)
    }
  }

  // Trigger search immediately when filters change
  useEffect(() => {
    debouncedFetchInstructors(searchQuery, filterStatus, filterSpecialization)
  }, [searchQuery, filterStatus, filterSpecialization, debouncedFetchInstructors])

  // Initial load
  useEffect(() => {
    debouncedFetchInstructors("", "all", "all")
  }, [debouncedFetchInstructors])

  const handleCreateInstructor = async () => {
    try {
      await instructorsAPI.createInstructor(newInstructor)
      setNewInstructor({
        name: "",
        email: "",
        phone: "",
        specialization: "",
        experience: 0,
        status: "active",
        password: "",
      })
      setIsCreateDialogOpen(false)
      debouncedFetchInstructors("", "all", "all")
      toast({
        title: "Success",
        description: `${newInstructor.name} has been added as an instructor.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create instructor",
        variant: "destructive",
      })
    }
  }

  const handleEditInstructor = async () => {
    try {
      await instructorsAPI.updateInstructor(editInstructor)
      setIsEditDialogOpen(false)
      debouncedFetchInstructors("", "all", "all")
      toast({
        title: "Success",
        description: "Instructor has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update instructor",
        variant: "destructive",
      })
    }
  }

  const handleDeleteInstructor = async (instructorId: string) => {
    if (!confirm("Are you sure you want to delete this instructor?")) return

    try {
      await instructorsAPI.deleteInstructor(instructorId)
      debouncedFetchInstructors("", "all", "all")
      toast({
        title: "Success",
        description: "Instructor has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete instructor",
        variant: "destructive",
      })
    }
  }

  const handleResetPassword = async () => {
    if (!selectedInstructor) return

    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (resetPasswordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      })
      return
    }

    try {
      const resetData: ResetPasswordData = {
        instructorId: selectedInstructor.id,
        newPassword: resetPasswordData.newPassword,
        email: resetPasswordData.email,
      }

      const result = await instructorsAPI.resetPassword(resetData)

      setIsResetPasswordDialogOpen(false)
      setResetPasswordData({
        newPassword: "",
        confirmPassword: "",
        email: "",
      })

      toast({
        title: "Password Reset Successful",
        description: `Password has been reset for ${result.name}. Email notification sent to ${result.email}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset password",
        variant: "destructive",
      })
    }
  }

  const openResetPasswordDialog = (instructor: Instructor) => {
    setSelectedInstructor(instructor)
    setResetPasswordData({
      newPassword: "",
      confirmPassword: "",
      email: instructor.email,
    })
    setIsResetPasswordDialogOpen(true)
  }

  const handleViewSessions = async (instructor: Instructor) => {
    setSelectedInstructor(instructor)
    setIsSessionsDialogOpen(true)
    await fetchInstructorSessions(instructor.id)
  }

  const openEditDialog = (instructor: Instructor) => {
    setEditInstructor({
      id: instructor.id,
      name: instructor.name,
      email: instructor.email,
      phone: instructor.phone,
      specialization: instructor.specialization,
      experience: instructor.experience,
      status: instructor.status,
      password: "",
    })
    setIsEditDialogOpen(true)
  }

  const exportInstructors = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Email,Phone,Specialization,Courses,Students,Experience,Status,Join Date,Upcoming Sessions\n" +
      instructors
        .map(
          (i) =>
            `"${i.name}","${i.email}","${i.phone}","${i.specialization}",${i.courses_teaching},${i.total_students},${i.experience},"${i.status}","${i.join_date}",${i.upcoming_sessions}`,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading instructors...</div>
      </div>
    )
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
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
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
                <div className="grid grid-cols-2 gap-4">
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
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={newInstructor.status}
                      onValueChange={(value) => setNewInstructor({ ...newInstructor, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    value={newInstructor.password}
                    onChange={(e) => setNewInstructor({ ...newInstructor, password: e.target.value })}
                    placeholder="Enter password"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
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
        <Select value={filterSpecialization} onValueChange={setFilterSpecialization}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by specialization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specializations</SelectItem>
            {specializations.map((spec) => (
              <SelectItem key={spec} value={spec}>
                {spec}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Instructors Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Instructors ({instructors.length})</CardTitle>
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
                  <th className="text-left p-4">Upcoming Sessions</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {instructors.map((instructor) => (
                  <tr key={instructor.id} className="border-b">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{instructor.name}</div>
                        <div className="text-sm text-gray-500">Joined {instructor.join_date}</div>
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
                        <div className="text-sm">{instructor.courses_teaching} courses</div>
                        <div className="text-sm text-gray-500">{instructor.total_students} students</div>
                      </div>
                    </td>
                    <td className="p-4">{instructor.experience} years</td>
                    <td className="p-4">
                      <Badge className={getStatusColor(instructor.status)}>{instructor.status}</Badge>
                    </td>
                    <td className="p-4">
                      <div
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        onClick={() => handleViewSessions(instructor)}
                        title="Click to view sessions"
                      >
                        <span className="text-sm font-medium text-blue-600">{instructor.upcoming_sessions}</span>
                        <Eye className="h-4 w-4 text-blue-600" />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          title="Edit Instructor"
                          onClick={() => openEditDialog(instructor)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          title="Reset Password"
                          onClick={() => openResetPasswordDialog(instructor)}
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Instructor</DialogTitle>
            <DialogDescription>Update instructor information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={editInstructor.name}
                  onChange={(e) => setEditInstructor({ ...editInstructor, name: e.target.value })}
                  placeholder="Enter instructor name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={editInstructor.email}
                  onChange={(e) => setEditInstructor({ ...editInstructor, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={editInstructor.phone}
                  onChange={(e) => setEditInstructor({ ...editInstructor, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Experience (years)</label>
                <Input
                  type="number"
                  value={editInstructor.experience}
                  onChange={(e) => setEditInstructor({ ...editInstructor, experience: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Specialization</label>
                <Select
                  value={editInstructor.specialization}
                  onValueChange={(value) => setEditInstructor({ ...editInstructor, specialization: value })}
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
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={editInstructor.status}
                  onValueChange={(value) => setEditInstructor({ ...editInstructor, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">New Password (leave empty to keep current)</label>
              <Input
                type="password"
                value={editInstructor.password}
                onChange={(e) => setEditInstructor({ ...editInstructor, password: e.target.value })}
                placeholder="Enter new password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditInstructor}>Update Instructor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Update the account password</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={resetPasswordData.email}
                onChange={(e) => setResetPasswordData({ ...resetPasswordData, email: e.target.value })}
                placeholder="Instructor email"
                disabled
              />
            </div>
            <div>
              <label className="text-sm font-medium">New Password</label>
              <Input
                type="password"
                value={resetPasswordData.newPassword}
                onChange={(e) => setResetPasswordData({ ...resetPasswordData, newPassword: e.target.value })}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Confirm New Password</label>
              <Input
                type="password"
                value={resetPasswordData.confirmPassword}
                onChange={(e) => setResetPasswordData({ ...resetPasswordData, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword}>Reset Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sessions Dialog */}
      <Dialog open={isSessionsDialogOpen} onOpenChange={setIsSessionsDialogOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Upcoming Sessions - {selectedInstructor?.name}</DialogTitle>
            <DialogDescription>View all upcoming sessions for this instructor</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {sessionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-lg">Loading sessions...</div>
              </div>
            ) : instructorSessions.length > 0 ? (
              <div className="space-y-4">
                {instructorSessions.map((session) => (
                  <Card key={session.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{session.session_title}</h3>
                        <p className="text-sm text-gray-600">{session.course_name}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{session.session_date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {session.session_time} ({session.duration_minutes} min)
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{session.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{session.student_count} students</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-4">
                        {session.status}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No upcoming sessions found for this instructor.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}