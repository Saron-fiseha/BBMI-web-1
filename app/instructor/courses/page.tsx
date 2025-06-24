"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { InstructorLayout } from "@/components/instructor/instructor-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Search, Users, Star, DollarSign, Eye, Edit, MoreHorizontal } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface Course {
  id: string
  title: string
  description: string
  students: number
  rating: number
  earnings: string
  image: string
  status: string
  price: number
  duration: number
  level: string
  created_at: string
  updated_at: string
}

export default function InstructorCourses() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    if (!loading && (!user || user.role !== "instructor")) {
      router.push(user ? "/dashboard" : "/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && user.role === "instructor") {
      fetchCourses()
    }
  }, [user])

  const fetchCourses = async () => {
    try {
      setLoadingData(true)
      const response = await fetch("/api/instructor/courses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCourses(data)
      } else {
        // Mock data fallback
        setCourses([
          {
            id: "1",
            title: "Advanced Hair Styling Techniques",
            description: "Master advanced hair styling techniques for professional results",
            students: 324,
            rating: 4.8,
            earnings: "$9,720",
            image: "/placeholder.svg?height=200&width=300",
            status: "published",
            price: 299,
            duration: 120,
            level: "advanced",
            created_at: "2024-01-15",
            updated_at: "2024-06-20",
          },
          {
            id: "2",
            title: "Professional Makeup Artistry",
            description: "Complete guide to professional makeup techniques",
            students: 412,
            rating: 4.9,
            earnings: "$14,420",
            image: "/placeholder.svg?height=200&width=300",
            status: "published",
            price: 399,
            duration: 180,
            level: "intermediate",
            created_at: "2024-02-10",
            updated_at: "2024-06-18",
          },
          {
            id: "3",
            title: "Bridal Hair & Makeup Masterclass",
            description: "Specialized techniques for bridal beauty",
            students: 0,
            rating: 0,
            earnings: "$0",
            image: "/placeholder.svg?height=200&width=300",
            status: "draft",
            price: 499,
            duration: 240,
            level: "advanced",
            created_at: "2024-06-15",
            updated_at: "2024-06-20",
          },
        ])
      }
    } catch (error) {
      console.error("Error fetching courses:", error)
      toast({
        title: "Error",
        description: "Failed to load courses. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingData(false)
    }
  }

  if (loading || !user || user.role !== "instructor") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || course.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
            <p className="text-muted-foreground">Manage and track your course performance</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
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
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Courses Grid */}
        {loadingData ? (
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/4 lg:w-1/5 animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-l-lg"></div>
                  </div>
                  <div className="w-full md:w-3/4 lg:w-4/5 p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/4 lg:w-1/5">
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="h-full w-full object-cover min-h-[200px] md:min-h-[150px]"
                    />
                  </div>
                  <div className="w-full md:w-3/4 lg:w-4/5 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold">{course.title}</h3>
                          <Badge className={getStatusColor(course.status)}>
                            {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Level: {course.level}</span>
                          <span>Duration: {course.duration} min</span>
                          <span>Price: ${course.price}</span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/instructor/courses/${course.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Course
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/courses/${course.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{course.students}</p>
                          <p className="text-xs text-muted-foreground">Students</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            {course.rating > 0 ? `${course.rating}/5` : "No ratings"}
                          </p>
                          <p className="text-xs text-muted-foreground">Rating</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{course.earnings}</p>
                          <p className="text-xs text-muted-foreground">Earnings</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{course.level}</p>
                          <p className="text-xs text-muted-foreground">Level</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/instructor/courses/${course.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/instructor/courses/${course.id}/students`}>
                          <Users className="mr-2 h-4 w-4" />
                          Students
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/courses/${course.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery || statusFilter !== "all" ? "No courses found" : "No courses yet"}
              </h3>
              <p className="text-muted-foreground mb-4 text-center">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Your courses will appear here once they are created"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}


// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { useAuth } from "@/hooks/use-auth"
// import { DashboardHeader } from "@/components/dashboard/dashboard-header"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { PlusCircle, Search, MoreHorizontal, Users, Star } from "lucide-react"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// export default function InstructorCoursesPage() {
//   const { user } = useAuth()
//   const [searchQuery, setSearchQuery] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")

//   // Mock courses data
//   const courses = [
//     {
//       id: "1",
//       title: "Advanced Hair Styling Techniques",
//       status: "published",
//       students: 324,
//       rating: 4.8,
//       earnings: "$9,720",
//       image: "/placeholder.svg?height=100&width=200",
//       lastUpdated: "2 weeks ago",
//     },
//     {
//       id: "2",
//       title: "Professional Makeup Artistry",
//       status: "published",
//       students: 412,
//       rating: 4.9,
//       earnings: "$14,420",
//       image: "/placeholder.svg?height=100&width=200",
//       lastUpdated: "1 month ago",
//     },
//     {
//       id: "3",
//       title: "Bridal Hair & Makeup Masterclass",
//       status: "draft",
//       students: 0,
//       rating: 0,
//       earnings: "$0",
//       image: "/placeholder.svg?height=100&width=200",
//       lastUpdated: "3 days ago",
//     },
//   ]

//   // Filter courses based on search query and status
//   const filteredCourses = courses.filter((course) => {
//     const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
//     const matchesStatus = statusFilter === "all" || course.status === statusFilter
//     return matchesSearch && matchesStatus
//   })

//   return (
//     <>
//       <DashboardHeader heading="My Courses" text="Manage your courses and track their performance.">
//         <Button asChild>
//           <Link href="/instructor/courses/create">
//             <PlusCircle className="mr-2 h-4 w-4" />
//             Create Course
//           </Link>
//         </Button>
//       </DashboardHeader>

//       <div className="mb-8 flex flex-col md:flex-row gap-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search courses..."
//             className="pl-8"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//         <Select value={statusFilter} onValueChange={setStatusFilter}>
//           <SelectTrigger className="w-full md:w-[180px]">
//             <SelectValue placeholder="Filter by status" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Courses</SelectItem>
//             <SelectItem value="published">Published</SelectItem>
//             <SelectItem value="draft">Draft</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="grid gap-6">
//         {filteredCourses.length > 0 ? (
//           filteredCourses.map((course) => (
//             <Card key={course.id} className="overflow-hidden">
//               <div className="flex flex-col md:flex-row">
//                 <div className="w-full md:w-1/4 lg:w-1/5">
//                   <img
//                     src={course.image || "/placeholder.svg"}
//                     alt={course.title}
//                     className="h-full w-full object-cover"
//                   />
//                 </div>
//                 <div className="w-full md:w-3/4 lg:w-4/5 p-6">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <h3 className="text-xl font-bold mb-2">{course.title}</h3>
//                       <div className="flex items-center text-sm text-muted-foreground mb-4">
//                         <span
//                           className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                             course.status === "published"
//                               ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
//                               : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
//                           } mr-2`}
//                         >
//                           {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
//                         </span>
//                         <span>Last updated {course.lastUpdated}</span>
//                       </div>
//                     </div>
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//                           <MoreHorizontal className="h-4 w-4" />
//                           <span className="sr-only">Open menu</span>
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuItem asChild>
//                           <Link href={`/instructor/courses/${course.id}`}>Edit Course</Link>
//                         </DropdownMenuItem>
//                         <DropdownMenuItem asChild>
//                           <Link href={`/instructor/courses/${course.id}/analytics`}>View Analytics</Link>
//                         </DropdownMenuItem>
//                         <DropdownMenuItem asChild>
//                           <Link href={`/instructor/courses/${course.id}/students`}>Manage Students</Link>
//                         </DropdownMenuItem>
//                         {course.status === "draft" ? (
//                           <DropdownMenuItem>Publish Course</DropdownMenuItem>
//                         ) : (
//                           <DropdownMenuItem>Unpublish Course</DropdownMenuItem>
//                         )}
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                     <div>
//                       <div className="flex items-center">
//                         <Users className="h-4 w-4 mr-2 text-muted-foreground" />
//                         <span className="text-sm font-medium">Students</span>
//                       </div>
//                       <p className="text-lg">{course.students}</p>
//                     </div>
//                     <div>
//                       <div className="flex items-center">
//                         <Star className="h-4 w-4 mr-2 text-muted-foreground" />
//                         <span className="text-sm font-medium">Rating</span>
//                       </div>
//                       <p className="text-lg">{course.rating > 0 ? `${course.rating}/5` : "No ratings"}</p>
//                     </div>
//                     <div>
//                       <div className="flex items-center">
//                         <span className="text-sm font-medium">Earnings</span>
//                       </div>
//                       <p className="text-lg">{course.earnings}</p>
//                     </div>
//                   </div>

//                   <div className="flex flex-wrap gap-2">
//                     <Button variant="outline" size="sm" asChild>
//                       <Link href={`/instructor/courses/${course.id}`}>Edit Course</Link>
//                     </Button>
//                     <Button variant="outline" size="sm" asChild>
//                       <Link href={`/instructor/courses/${course.id}/content`}>Manage Content</Link>
//                     </Button>
//                     <Button variant="outline" size="sm" asChild>
//                       <Link href={`/courses/${course.id}`}>Preview</Link>
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </Card>
//           ))
//         ) : (
//           <div className="text-center py-12">
//             <h3 className="text-lg font-medium mb-2">No courses found</h3>
//             <p className="text-muted-foreground mb-6">
//               {searchQuery || statusFilter !== "all"
//                 ? "Try adjusting your search or filter"
//                 : "You haven't created any courses yet"}
//             </p>
//             <Button asChild>
//               <Link href="/instructor/courses/create">
//                 <PlusCircle className="mr-2 h-4 w-4" />
//                 Create Your First Course
//               </Link>
//             </Button>
//           </div>
//         )}
//       </div>
//     </>
//   )
// }
