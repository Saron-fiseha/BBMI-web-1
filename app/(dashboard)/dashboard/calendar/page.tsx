"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { CalendarIcon, Clock, Plus, Video, User, MapPin } from "lucide-react"

interface Session {
  id: string
  title: string
  date: string
  time: string
  instructor: string
  location: string
  type: "live" | "appointment"
}

interface Instructor {
  id: string
  name: string
  specialization: string
  available: boolean
}

export default function CalendarPage() {
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isBooking, setIsBooking] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [appointmentData, setAppointmentData] = useState({
    instructorId: "",
    date: "",
    time: "",
    topic: "",
    notes: "",
    type: "consultation" as "consultation" | "practical" | "review",
  })

  // Fetch sessions and instructors on component mount
  useEffect(() => {
    fetchSessions()
    fetchInstructors()
  }, [])

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/sessions/student")
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions || [])
      }
    } catch (error) {
      console.error("Error fetching sessions:", error)
    }
  }

  const fetchInstructors = async () => {
    try {
      const response = await fetch("/api/instructors/available")
      if (response.ok) {
        const data = await response.json()
        setInstructors(data.instructors || [])
      }
    } catch (error) {
      console.error("Error fetching instructors:", error)
      // Mock data for demo
      setInstructors([
        { id: "1", name: "Sarah Johnson", specialization: "Hair Styling", available: true },
        { id: "2", name: "Michael Chen", specialization: "Makeup Artistry", available: true },
        { id: "3", name: "Emily Rodriguez", specialization: "Nail Care", available: true },
      ])
    }
  }

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsBooking(true)

    try {
      const response = await fetch("/api/appointments/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Appointment booked successfully",
          description: `Your ${appointmentData.type} session has been scheduled.`,
        })

        // Add new appointment to sessions list
        const newSession: Session = {
          id: result.id || Date.now().toString(),
          title: `${appointmentData.type} - ${appointmentData.topic}`,
          date: appointmentData.date,
          time: appointmentData.time,
          instructor: instructors.find((i) => i.id === appointmentData.instructorId)?.name || "",
          location: "Online",
          type: "appointment",
        }
        setSessions([...sessions, newSession])

        // Reset form
        setAppointmentData({
          instructorId: "",
          date: "",
          time: "",
          topic: "",
          notes: "",
          type: "consultation",
        })
        setIsDialogOpen(false)
      } else {
        throw new Error("Failed to book appointment")
      }
    } catch (error) {
      toast({
        title: "Error booking appointment",
        description: "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsBooking(false)
    }
  }

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ]

  return (
    <div className="space-y-6">
      <DashboardHeader heading="Calendar" text="View your upcoming sessions and book appointments.">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-mustard hover:bg-mustard/90 text-ivory">
              <Plus className="mr-2 h-4 w-4" />
              Book Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-ivory border-mustard/20">
            <DialogHeader>
              <DialogTitle className="text-charcoal">Book an Appointment</DialogTitle>
              <DialogDescription className="text-deep-purple">
                Schedule a one-on-one session with an instructor.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleBookAppointment}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="instructor" className="text-charcoal">
                    Select Instructor
                  </Label>
                  <Select
                    value={appointmentData.instructorId}
                    onValueChange={(value) => setAppointmentData({ ...appointmentData, instructorId: value })}
                    required
                  >
                    <SelectTrigger className="border-mustard/20 focus:border-mustard">
                      <SelectValue placeholder="Choose an instructor" />
                    </SelectTrigger>
                    <SelectContent className="bg-ivory border-mustard/20">
                      {instructors.map((instructor) => (
                        <SelectItem key={instructor.id} value={instructor.id}>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>
                              {instructor.name} - {instructor.specialization}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date" className="text-charcoal">
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={appointmentData.date}
                      onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
                      className="border-mustard/20 focus:border-mustard"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time" className="text-charcoal">
                      Time
                    </Label>
                    <Select
                      value={appointmentData.time}
                      onValueChange={(value) => setAppointmentData({ ...appointmentData, time: value })}
                      required
                    >
                      <SelectTrigger className="border-mustard/20 focus:border-mustard">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent className="bg-ivory border-mustard/20">
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{time}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="type" className="text-charcoal">
                    Session Type
                  </Label>
                  <Select
                    value={appointmentData.type}
                    onValueChange={(value: "consultation" | "practical" | "review") =>
                      setAppointmentData({ ...appointmentData, type: value })
                    }
                  >
                    <SelectTrigger className="border-mustard/20 focus:border-mustard">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-ivory border-mustard/20">
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="practical">Practical Session</SelectItem>
                      <SelectItem value="review">Course Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="topic" className="text-charcoal">
                    Topic
                  </Label>
                  <Input
                    id="topic"
                    placeholder="What would you like to discuss?"
                    value={appointmentData.topic}
                    onChange={(e) => setAppointmentData({ ...appointmentData, topic: e.target.value })}
                    className="border-mustard/20 focus:border-mustard"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes" className="text-charcoal">
                    Additional Notes
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Any specific questions or areas you'd like to focus on?"
                    rows={3}
                    value={appointmentData.notes}
                    onChange={(e) => setAppointmentData({ ...appointmentData, notes: e.target.value })}
                    className="border-mustard/20 focus:border-mustard"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-mustard/20 text-mustard hover:bg-mustard/10"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isBooking} className="bg-mustard hover:bg-mustard/90 text-ivory">
                  {isBooking ? "Booking..." : "Book Appointment"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </DashboardHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar Section */}
        <div className="lg:col-span-1">
          <Card className="border-mustard/20">
            <CardHeader>
              <CardTitle className="text-charcoal">Calendar</CardTitle>
              <CardDescription className="text-deep-purple">Select a date to view sessions</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border border-mustard/20 w-full"
                classNames={{
                  months: "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                  month: "space-y-4 w-full flex flex-col",
                  table: "w-full h-full border-collapse space-y-1",
                  head_row: "",
                  row: "w-full mt-2",
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sessions Section */}
        <div className="lg:col-span-2">
          <Card className="border-mustard/20">
            <CardHeader>
              <CardTitle className="text-charcoal">Upcoming Sessions</CardTitle>
              <CardDescription className="text-deep-purple">Your scheduled classes and appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {sessions.length > 0 ? (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-mustard/20 rounded-lg bg-ivory/50"
                    >
                      <div className="space-y-2 mb-4 md:mb-0">
                        <h3 className="font-medium text-charcoal">{session.title}</h3>
                        <div className="flex items-center text-sm text-deep-purple">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          <span>{session.date}</span>
                        </div>
                        <div className="flex items-center text-sm text-deep-purple">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{session.time}</span>
                        </div>
                        <div className="flex items-center text-sm text-deep-purple">
                          <User className="h-4 w-4 mr-2" />
                          <span>Instructor: {session.instructor}</span>
                        </div>
                        <div className="flex items-center text-sm text-deep-purple">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{session.location}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="md:ml-4 border-mustard text-mustard hover:bg-mustard hover:text-ivory"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        {session.type === "live" ? "Join Session" : "Join Meeting"}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 mx-auto text-mustard/50 mb-4" />
                  <p className="text-deep-purple mb-2">You don't have any upcoming sessions.</p>
                  <p className="text-sm text-deep-purple/70">Book an appointment to get started!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
