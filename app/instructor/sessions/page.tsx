"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
// Make sure the file exists at the following path, or update the import to the correct path:

import { InstructorLayout } from "@/components/instructor/instructor-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Users, Video, Plus, Edit, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Session {
  id: string
  title: string
  description?: string
  course_id?: string
  course_title?: string
  scheduled_at: string
  duration: number
  students: number
  status: string
  meeting_url?: string
}

interface Course {
  id: string
  title: string
}

export default function InstructorSessions() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course_id: "none", // Updated default value to be a non-empty string
    scheduled_at: "",
    duration: 60,
    meeting_url: "",
  })

  useEffect(() => {
    if (!loading && (!user || user.role !== "instructor")) {
      router.push(user ? "/dashboard" : "/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && user.role === "instructor") {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      setLoadingData(true)

      // Fetch sessions
      const sessionsResponse = await fetch("/api/instructor/sessions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json()
        setSessions(sessionsData)
      }

      // Fetch courses
      const coursesResponse = await fetch("/api/instructor/courses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json()
        setCourses(coursesData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load sessions data.",
        variant: "destructive",
      })
    } finally {
      setLoadingData(false)
    }
  }

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/instructor/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Session scheduled successfully!",
        })
        setIsCreateDialogOpen(false)
        setFormData({
          title: "",
          description: "",
          course_id: "none", // Updated default value to be a non-empty string
          scheduled_at: "",
          duration: 60,
          meeting_url: "",
        })
        fetchData()
      } else {
        throw new Error("Failed to create session")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule session. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading || !user || user.role !== "instructor") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    }
  }

  return (
    <InstructorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Live Sessions</h1>
            <p className="text-muted-foreground">Schedule and manage your live teaching sessions</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Session
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Schedule New Session</DialogTitle>
                <DialogDescription>Create a new live session for your students.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateSession} className="space-y-4">
                <div>
                  <Label htmlFor="title">Session Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Live Q&A: Hair Styling Techniques"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="course">Course (Optional)</Label>
                  <Select
                    value={formData.course_id}
                    onValueChange={(value) => setFormData({ ...formData, course_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No specific course</SelectItem>{" "}
                      {/* Updated value prop to be a non-empty string */}
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="scheduled_at">Date & Time</Label>
                  <Input
                    id="scheduled_at"
                    type="datetime-local"
                    value={formData.scheduled_at}
                    onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) })}
                    min="15"
                    max="180"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What will you cover in this session?"
                  />
                </div>
                <div>
                  <Label htmlFor="meeting_url">Meeting URL (Optional)</Label>
                  <Input
                    id="meeting_url"
                    value={formData.meeting_url}
                    onChange={(e) => setFormData({ ...formData, meeting_url: e.target.value })}
                    placeholder="https://zoom.us/j/..."
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Schedule Session</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sessions List */}
        {loadingData ? (
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent className="animate-pulse">
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sessions.length > 0 ? (
          <div className="grid gap-4">
            {sessions.map((session) => {
              const { date, time } = formatDateTime(session.scheduled_at)
              return (
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Video className="h-5 w-5 text-blue-500" />
                          {session.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {time} ({session.duration} min)
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {session.students} enrolled
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {session.description && <p className="text-sm text-muted-foreground mb-4">{session.description}</p>}
                    {session.course_title && <p className="text-sm font-medium mb-4">Course: {session.course_title}</p>}
                    <div className="flex gap-2">
                      <Button size="sm">Start Session</Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {session.meeting_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={session.meeting_url} target="_blank" rel="noopener noreferrer">
                            Join Meeting
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Video className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No sessions scheduled</h3>
              <p className="text-muted-foreground mb-4 text-center">
                Schedule your first live session to connect with your students in real-time
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Your First Session
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </InstructorLayout>
  )
}
