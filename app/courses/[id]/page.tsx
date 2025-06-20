"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Clock, Users, Star, Play, CheckCircle, BookOpen, Award } from "lucide-react"

export default function CoursePage({ params }: { params: { id: string } }) {
  const { user, error: authError } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isEnrolling, setIsEnrolling] = useState(false)

  // Mock course data
  const course = {
    id: params.id,
    title: "Advanced Hair Styling Techniques",
    description:
      "Master the latest hair styling techniques from industry experts. This comprehensive course covers everything from basic cuts to advanced styling for special occasions.",
    image: "/placeholder.svg?height=400&width=800",
    category: "Hair Styling",
    level: "Advanced",
    duration: "8 weeks",
    students: 324,
    rating: 4.8,
    reviews: 86,
    instructor: {
      name: "Sarah Johnson",
      title: "Master Hair Stylist",
      bio: "With over 15 years of experience in the beauty industry, Sarah has worked with celebrities and taught at prestigious beauty schools worldwide.",
      image: "/placeholder.svg?height=100&width=100",
    },
    price: 299,
    lessons: [
      {
        id: "1",
        title: "Introduction to Advanced Hair Styling",
        description: "Overview of the course and essential tools.",
        duration: "45 minutes",
        isPreview: true,
      },
      {
        id: "2",
        title: "Understanding Hair Types and Textures",
        description: "Learn to identify different hair types and how to work with them.",
        duration: "60 minutes",
        isPreview: false,
      },
      {
        id: "3",
        title: "Advanced Cutting Techniques",
        description: "Master precision cutting for various styles.",
        duration: "90 minutes",
        isPreview: false,
      },
      {
        id: "4",
        title: "Color Theory and Application",
        description: "Understanding color theory and advanced application techniques.",
        duration: "120 minutes",
        isPreview: false,
      },
      {
        id: "5",
        title: "Bridal and Special Occasion Styles",
        description: "Create stunning updos and styles for special events.",
        duration: "90 minutes",
        isPreview: false,
      },
      {
        id: "6",
        title: "Business Skills for Hair Stylists",
        description: "Learn how to build your clientele and manage your business.",
        duration: "60 minutes",
        isPreview: false,
      },
    ],
    whatYouWillLearn: [
      "Master advanced cutting and styling techniques",
      "Work with different hair types and textures",
      "Create stunning bridal and special occasion styles",
      "Apply color theory to achieve perfect results",
      "Build your business as a professional stylist",
    ],
    requirements: [
      "Basic knowledge of hair cutting and styling",
      "Your own professional styling tools",
      "Passion for hair styling and willingness to practice",
    ],
  }

  const handleEnroll = async () => {
    setIsEnrolling(true)

    try {
      // Check if user is logged in
      if (!user) {
        // Redirect to login page with return URL
        toast({
          title: "Login required",
          description: "Please log in or register to enroll in this course.",
        })
        router.push(`/login?returnUrl=/courses/${params.id}`)
        return
      }

      // This would be an API call in a real application
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to payment page
      router.push(`/payment?courseId=${params.id}&price=${course.price}`)
    } catch (error) {
      toast({
        title: "Enrollment failed",
        description: "There was an error processing your enrollment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsEnrolling(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Course Header */}
        <div className="bg-muted py-12">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="mb-4">{course.category}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-muted-foreground mb-6">{course.description}</p>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>
                      {course.rating} ({course.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{course.students} students</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>{course.lessons.length} lessons</span>
                  </div>
                </div>
                <div className="flex items-center mb-6">
                  <div className="mr-3">
                    <img
                      src={course.instructor.image || "/placeholder.svg"}
                      alt={course.instructor.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{course.instructor.name}</p>
                    <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
                  </div>
                </div>
              </div>
              <div>
                <Card className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button size="icon" className="rounded-full h-16 w-16">
                        <Play className="h-8 w-8" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-3xl font-bold">${course.price}</div>
                      <Badge variant="outline">{course.level}</Badge>
                    </div>
                    <Button className="w-full mb-4" size="lg" onClick={handleEnroll} disabled={isEnrolling}>
                      {isEnrolling ? "Processing..." : "Enroll Now"}
                    </Button>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Full lifetime access
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Access on mobile and desktop
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Certificate of completion
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        30-day money-back guarantee
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="container py-12">
          <Tabs defaultValue="content" className="space-y-8">
            <TabsList className="w-full justify-start border-b rounded-none p-0">
              <TabsTrigger
                value="content"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Course Content
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="instructor"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Instructor
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Course Content</h2>
                  <div className="flex items-center text-sm text-muted-foreground mb-6">
                    <span>{course.lessons.length} lessons</span>
                    <span className="mx-2">•</span>
                    <span>12 hours total length</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {course.lessons.map((lesson, index) => (
                    <Card key={lesson.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="bg-muted rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="font-medium">{lesson.title}</h3>
                              <p className="text-sm text-muted-foreground">{lesson.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                            {lesson.isPreview ? (
                              <Button variant="outline" size="sm" asChild>
                                <Link href="#">Preview</Link>
                              </Button>
                            ) : (
                              <Play className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="overview">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">What You Will Learn</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.whatYouWillLearn.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                  <ul className="space-y-2">
                    {course.requirements.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Course Description</h2>
                  <div className="prose max-w-none dark:prose-invert">
                    <p>
                      This comprehensive course is designed for hairstylists who want to take their skills to the next
                      level. Whether you're a salon professional looking to expand your service offerings or an aspiring
                      stylist wanting to master advanced techniques, this course provides the knowledge and hands-on
                      practice you need.
                    </p>
                    <p className="mt-4">
                      Throughout the 8-week program, you'll learn from industry expert Sarah Johnson, who has worked
                      with celebrities and taught at prestigious beauty schools worldwide. Sarah will guide you through
                      advanced cutting techniques, color theory, and special occasion styling that will set you apart in
                      the competitive beauty industry.
                    </p>
                    <p className="mt-4">
                      By the end of this course, you'll have the confidence and skills to create stunning hairstyles for
                      any occasion, work with all hair types and textures, and build a successful career as a
                      professional hair stylist.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Who This Course Is For</h2>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2" />
                      <span>Salon professionals looking to expand their service offerings</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2" />
                      <span>Aspiring stylists who want to master advanced techniques</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2" />
                      <span>Beauty school graduates seeking to refine their skills</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2" />
                      <span>Entrepreneurs planning to open their own salon</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="instructor">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <img
                    src={course.instructor.image || "/placeholder.svg"}
                    alt={course.instructor.name}
                    className="h-32 w-32 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{course.instructor.name}</h2>
                    <p className="text-muted-foreground mb-4">{course.instructor.title}</p>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>4.9 Instructor Rating</span>
                      </div>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        <span>15+ Years Experience</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>1,200+ Students</span>
                      </div>
                    </div>
                    <div className="prose max-w-none dark:prose-invert">
                      <p>{course.instructor.bio}</p>
                      <p className="mt-4">
                        Sarah specializes in advanced cutting techniques, color theory, and bridal styling. She has been
                        featured in numerous beauty magazines and has won multiple industry awards for her innovative
                        approaches to hair styling.
                      </p>
                      <p className="mt-4">
                        As an instructor, Sarah is known for her patient, detailed teaching style and her ability to
                        break down complex techniques into easy-to-follow steps. Her students consistently praise her
                        hands-on approach and the personal attention she gives to each learner.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Student Reviews</h2>
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="text-4xl font-bold">{course.rating}</div>
                    <div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(course.rating)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">Based on {course.reviews} reviews</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Sample reviews */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <img
                          src="/placeholder.svg?height=50&width=50"
                          alt="Reviewer"
                          className="h-10 w-10 rounded-full mr-3"
                        />
                        <div>
                          <p className="font-medium">Jennifer L.</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            ))}
                            <span className="text-xs text-muted-foreground ml-2">2 weeks ago</span>
                          </div>
                        </div>
                      </div>
                      <p>
                        This course exceeded my expectations! Sarah's teaching style is clear and engaging. I've learned
                        techniques that I'm already using with my clients, and they love the results. The section on
                        bridal styling was particularly helpful for my business.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <img
                          src="/placeholder.svg?height=50&width=50"
                          alt="Reviewer"
                          className="h-10 w-10 rounded-full mr-3"
                        />
                        <div>
                          <p className="font-medium">Marcus T.</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < 4 ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                                }`}
                              />
                            ))}
                            <span className="text-xs text-muted-foreground ml-2">1 month ago</span>
                          </div>
                        </div>
                      </div>
                      <p>
                        As someone transitioning from a different career into hair styling, I found this course
                        incredibly valuable. The color theory section was challenging but Sarah explained everything so
                        well. I would have liked more practice exercises, but overall it was excellent.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <img
                          src="/placeholder.svg?height=50&width=50"
                          alt="Reviewer"
                          className="h-10 w-10 rounded-full mr-3"
                        />
                        <div>
                          <p className="font-medium">Sophia R.</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < 5 ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                                }`}
                              />
                            ))}
                            <span className="text-xs text-muted-foreground ml-2">2 months ago</span>
                          </div>
                        </div>
                      </div>
                      <p>
                        Worth every penny! I've taken several online styling courses, and this is by far the most
                        comprehensive. Sarah doesn't just show you what to do; she explains why certain techniques work
                        for different hair types. The business section at the end was an unexpected bonus that's already
                        helping me grow my client base.
                      </p>
                    </CardContent>
                  </Card>

                  <div className="text-center">
                    <Button variant="outline">Load More Reviews</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Courses */}
        <div className="bg-muted py-12">
          <div className="container">
            <h2 className="text-2xl font-bold mb-6">Related Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((id) => (
                <Card key={id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={`/placeholder.svg?height=200&width=400`}
                      alt="Course thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <Badge className="mb-2">Hair Styling</Badge>
                    <h3 className="font-bold mb-2">Professional Color Techniques</h3>
                    <div className="flex justify-between items-center text-sm mb-2">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>6 weeks</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>4.7</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="font-bold">$249</span>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/courses/${id}`}>View Course</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
