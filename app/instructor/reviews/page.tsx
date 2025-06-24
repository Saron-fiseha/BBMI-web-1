"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { InstructorLayout } from "@/components/instructor/instructor-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Search, MessageSquare, ThumbsUp } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Review {
  id: string
  student_name: string
  student_avatar?: string
  course_title: string
  course_id: string
  rating: number
  comment: string
  created_at: string
  helpful_count: number
  instructor_reply?: string
  replied_at?: string
}

interface ReviewStats {
  total_reviews: number
  average_rating: number
  rating_distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export default function InstructorReviews() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [courseFilter, setCourseFilter] = useState("all")

  useEffect(() => {
    if (!loading && (!user || user.role !== "instructor")) {
      router.push(user ? "/dashboard" : "/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && user.role === "instructor") {
      fetchReviews()
    }
  }, [user])

  const fetchReviews = async () => {
    try {
      setLoadingData(true)
      const response = await fetch("/api/instructor/reviews", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews)
        setStats(data.stats)
      } else {
        // Mock data fallback
        setStats({
          total_reviews: 127,
          average_rating: 4.8,
          rating_distribution: {
            5: 89,
            4: 28,
            3: 7,
            2: 2,
            1: 1,
          },
        })
        setReviews([
          {
            id: "1",
            student_name: "Sarah Johnson",
            student_avatar: "/placeholder.svg?height=40&width=40",
            course_title: "Advanced Hair Styling Techniques",
            course_id: "1",
            rating: 5,
            comment:
              "Absolutely amazing course! Betty's techniques are professional and easy to follow. I've already started implementing what I learned in my salon.",
            created_at: "2024-06-15T10:30:00Z",
            helpful_count: 12,
          },
          {
            id: "2",
            student_name: "Emily Chen",
            student_avatar: "/placeholder.svg?height=40&width=40",
            course_title: "Professional Makeup Artistry",
            course_id: "2",
            rating: 5,
            comment:
              "This course exceeded my expectations. The step-by-step tutorials are incredibly detailed and Betty's expertise really shows.",
            created_at: "2024-06-10T14:20:00Z",
            helpful_count: 8,
            instructor_reply:
              "Thank you so much, Emily! I'm thrilled to hear you found the course helpful. Keep practicing and feel free to reach out if you have any questions!",
            replied_at: "2024-06-11T09:15:00Z",
          },
          {
            id: "3",
            student_name: "Jessica Martinez",
            student_avatar: "/placeholder.svg?height=40&width=40",
            course_title: "Advanced Hair Styling Techniques",
            course_id: "1",
            rating: 4,
            comment:
              "Great course with lots of practical tips. Would love to see more content on color techniques in future updates.",
            created_at: "2024-06-08T16:45:00Z",
            helpful_count: 5,
          },
          {
            id: "4",
            student_name: "Amanda Wilson",
            student_avatar: "/placeholder.svg?height=40&width=40",
            course_title: "Professional Makeup Artistry",
            course_id: "2",
            rating: 5,
            comment:
              "Betty is an incredible instructor. Her passion for makeup artistry is contagious and her teaching style is perfect for beginners like me.",
            created_at: "2024-06-05T11:30:00Z",
            helpful_count: 15,
          },
        ])
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
      toast({
        title: "Error",
        description: "Failed to load reviews. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingData(false)
    }
  }

  if (loading || !user || user.role !== "instructor") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  // Filter reviews
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.course_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRating = ratingFilter === "all" || review.rating.toString() === ratingFilter
    return matchesSearch && matchesRating
  })

  const renderStars = (rating: number, size: "sm" | "md" = "sm") => {
    const sizeClass = size === "sm" ? "h-4 w-4" : "h-5 w-5"
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <InstructorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reviews & Feedback</h1>
            <p className="text-muted-foreground">See what your students are saying about your courses</p>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_reviews}</div>
                <p className="text-xs text-muted-foreground">From all courses</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.average_rating}</div>
                <div className="flex items-center mt-1">{renderStars(Math.round(stats.average_rating))}</div>
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Rating Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm w-2">{rating}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{
                            width: `${(stats.rating_distribution[rating as keyof typeof stats.rating_distribution] / stats.total_reviews) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground w-8 text-right">
                        {stats.rating_distribution[rating as keyof typeof stats.rating_distribution]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reviews by student, course, or content..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reviews List */}
        {loadingData ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6 animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredReviews.length > 0 ? (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <Card key={review.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.student_avatar || "/placeholder.svg"} alt={review.student_name} />
                      <AvatarFallback className="bg-gradient-to-r from-amber-400 to-amber-600 text-white">
                        {review.student_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{review.student_name}</h4>
                          <p className="text-sm text-muted-foreground">{review.course_title}</p>
                        </div>
                        <div className="text-right">
                          {renderStars(review.rating)}
                          <p className="text-xs text-muted-foreground mt-1">{formatDate(review.created_at)}</p>
                        </div>
                      </div>
                      <p className="text-sm mb-3">{review.comment}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{review.helpful_count} found this helpful</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Reply
                        </Button>
                      </div>
                      {review.instructor_reply && (
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">Instructor Reply</Badge>
                            <span className="text-xs text-muted-foreground">
                              {review.replied_at && formatDate(review.replied_at)}
                            </span>
                          </div>
                          <p className="text-sm">{review.instructor_reply}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Star className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery || ratingFilter !== "all" ? "No reviews found" : "No reviews yet"}
              </h3>
              <p className="text-muted-foreground mb-4 text-center">
                {searchQuery || ratingFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Student reviews will appear here once they complete your courses"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </InstructorLayout>
  )
}
