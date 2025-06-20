"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Search, MoreHorizontal, Users, Star } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function InstructorCoursesPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock courses data
  const courses = [
    {
      id: "1",
      title: "Advanced Hair Styling Techniques",
      status: "published",
      students: 324,
      rating: 4.8,
      earnings: "$9,720",
      image: "/placeholder.svg?height=100&width=200",
      lastUpdated: "2 weeks ago",
    },
    {
      id: "2",
      title: "Professional Makeup Artistry",
      status: "published",
      students: 412,
      rating: 4.9,
      earnings: "$14,420",
      image: "/placeholder.svg?height=100&width=200",
      lastUpdated: "1 month ago",
    },
    {
      id: "3",
      title: "Bridal Hair & Makeup Masterclass",
      status: "draft",
      students: 0,
      rating: 0,
      earnings: "$0",
      image: "/placeholder.svg?height=100&width=200",
      lastUpdated: "3 days ago",
    },
  ]

  // Filter courses based on search query and status
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || course.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <>
      <DashboardHeader heading="My Courses" text="Manage your courses and track their performance.">
        <Button asChild>
          <Link href="/instructor/courses/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Course
          </Link>
        </Button>
      </DashboardHeader>

      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/4 lg:w-1/5">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="w-full md:w-3/4 lg:w-4/5 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            course.status === "published"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                          } mr-2`}
                        >
                          {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                        </span>
                        <span>Last updated {course.lastUpdated}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/instructor/courses/${course.id}`}>Edit Course</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/instructor/courses/${course.id}/analytics`}>View Analytics</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/instructor/courses/${course.id}/students`}>Manage Students</Link>
                        </DropdownMenuItem>
                        {course.status === "draft" ? (
                          <DropdownMenuItem>Publish Course</DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>Unpublish Course</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm font-medium">Students</span>
                      </div>
                      <p className="text-lg">{course.students}</p>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm font-medium">Rating</span>
                      </div>
                      <p className="text-lg">{course.rating > 0 ? `${course.rating}/5` : "No ratings"}</p>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">Earnings</span>
                      </div>
                      <p className="text-lg">{course.earnings}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/instructor/courses/${course.id}`}>Edit Course</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/instructor/courses/${course.id}/content`}>Manage Content</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/courses/${course.id}`}>Preview</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filter"
                : "You haven't created any courses yet"}
            </p>
            <Button asChild>
              <Link href="/instructor/courses/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Course
              </Link>
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
