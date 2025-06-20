"use client"

import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Facebook, Instagram, Twitter, Linkedin, Award, Users, Star, Calendar } from "lucide-react"

export default function InstructorProfilePage({ params }: { params: { id: string } }) {
  // Mock instructors database
  const instructorsData = {
    "1": {
      id: "1",
      name: "Sarah Johnson",
      title: "Master Hair Stylist",
      bio: "With over 15 years of experience in the beauty industry, Sarah has worked with celebrities and taught at prestigious beauty schools worldwide.",
      image: "/placeholder.svg?height=400&width=400",
      coverImage: "/placeholder.svg?height=400&width=1200",
      specialties: ["Hair Styling", "Hair Coloring", "Bridal Styling"],
      experience: "15+ years",
      students: 1200,
      courses: 8,
      rating: 4.9,
      reviews: 156,
    },
    "2": {
      id: "2",
      name: "Michael Chen",
      title: "Professional Makeup Artist",
      bio: "Michael is a renowned makeup artist with expertise in editorial, bridal, and special effects makeup. He has worked on major film productions and fashion shows.",
      image: "/placeholder.svg?height=400&width=400",
      coverImage: "/placeholder.svg?height=400&width=1200",
      specialties: ["Makeup Artistry", "Special Effects", "Editorial Makeup"],
      experience: "12+ years",
      students: 950,
      courses: 6,
      rating: 4.8,
      reviews: 124,
    },
    "3": {
      id: "3",
      name: "Emily Rodriguez",
      title: "Nail Art Specialist",
      bio: "Emily is a creative nail artist known for her innovative designs and techniques. She has won multiple nail art competitions and teaches advanced nail technology.",
      image: "/placeholder.svg?height=400&width=400",
      coverImage: "/placeholder.svg?height=400&width=1200",
      specialties: ["Nail Art", "Nail Extensions", "Nail Technology"],
      experience: "8+ years",
      students: 650,
      courses: 4,
      rating: 4.7,
      reviews: 89,
    },
    "4": {
      id: "4",
      name: "David Kim",
      title: "Skincare Expert",
      bio: "David is a licensed esthetician with extensive knowledge in skincare analysis and facial treatments. He specializes in anti-aging and acne treatments.",
      image: "/placeholder.svg?height=400&width=400",
      coverImage: "/placeholder.svg?height=400&width=1200",
      specialties: ["Skincare", "Facial Treatments", "Anti-aging"],
      experience: "10+ years",
      students: 800,
      courses: 5,
      rating: 4.6,
      reviews: 102,
    },
    "5": {
      id: "5",
      name: "Jessica Williams",
      title: "Color Specialist",
      bio: "Jessica is an expert in hair coloring techniques, from traditional highlights to creative color transformations. She stays current with the latest color trends.",
      image: "/placeholder.svg?height=400&width=400",
      coverImage: "/placeholder.svg?height=400&width=1200",
      specialties: ["Hair Coloring", "Balayage", "Creative Color"],
      experience: "11+ years",
      students: 750,
      courses: 7,
      rating: 4.8,
      reviews: 134,
    },
    "6": {
      id: "6",
      name: "Robert Martinez",
      title: "Barbering Expert",
      bio: "Robert is a master barber with expertise in classic and modern men's grooming. He teaches precision cutting and traditional barbering techniques.",
      image: "/placeholder.svg?height=400&width=400",
      coverImage: "/placeholder.svg?height=400&width=1200",
      specialties: ["Men's Grooming", "Barbering", "Precision Cutting"],
      experience: "18+ years",
      students: 600,
      courses: 3,
      rating: 4.9,
      reviews: 78,
    },
  }

  const instructor = instructorsData[params.id as keyof typeof instructorsData]

  if (!instructor) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Instructor Not Found</h1>
            <p className="text-muted-foreground mb-4">The instructor you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/instructors">Back to Instructors</Link>
            </Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const certifications = [
    "Master Stylist Certification - International Beauty Academy",
    "Advanced Color Specialist - L'Oréal Professional",
    "Bridal Hair Design - Wedding Style Institute",
    "Salon Business Management - Beauty Business School",
  ]

  const achievements = [
    "Featured in Vogue Magazine's 'Top Stylists to Watch' (2019)",
    "Winner, National Hair Styling Competition (2018)",
    "Judge, International Beauty Awards (2020-Present)",
  ]

  const social = {
    instagram: "#",
    facebook: "#",
    twitter: "#",
    linkedin: "#",
  }

  const coursesData = [
    {
      id: 1,
      title: "Advanced Hair Styling Techniques",
      description: "Master the latest hair styling techniques from industry experts.",
      image: "/placeholder.svg?height=200&width=400",
      category: "Hair Styling",
      level: "Advanced",
      duration: "8 weeks",
      students: 324,
      rating: 4.8,
      price: 299,
    },
    {
      id: 5,
      title: "Bridal Hair & Makeup",
      description: "Specialized techniques for wedding day beauty services.",
      image: "/placeholder.svg?height=200&width=400",
      category: "Bridal",
      level: "Advanced",
      duration: "6 weeks",
      students: 215,
      rating: 4.9,
      price: 399,
    },
    {
      id: 7,
      title: "Hair Styling for Photoshoots",
      description: "Create stunning hair styles for professional photography.",
      image: "/placeholder.svg?height=200&width=400",
      category: "Hair Styling",
      level: "Intermediate",
      duration: "4 weeks",
      students: 178,
      rating: 4.7,
      price: 249,
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Live Q&A Session: Advanced Color Techniques",
      date: "June 15, 2023",
      time: "2:00 PM - 3:30 PM EST",
      type: "Online",
    },
    {
      id: 2,
      title: "Hands-on Workshop: Bridal Styling",
      date: "July 8, 2023",
      time: "10:00 AM - 4:00 PM EST",
      type: "In-Person",
      location: "New York Beauty Academy",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Cover Image and Profile */}
        <div className="relative">
          <div className="h-64 md:h-80 w-full overflow-hidden">
            <img src={instructor.coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
          </div>
          <div className="container relative -mt-20 md:-mt-24">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-8">
              <div className="h-32 w-32 md:h-48 md:w-48 rounded-full border-4 border-background overflow-hidden bg-background">
                <img
                  src={instructor.image || "/placeholder.svg"}
                  alt={instructor.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 bg-background p-4 rounded-t-lg">
                <h1 className="text-3xl font-bold">{instructor.name}</h1>
                <p className="text-muted-foreground">{instructor.title}</p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    <span>{instructor.experience} Experience</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{instructor.students}+ Students</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>{instructor.rating} Instructor Rating</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 mt-4 md:mt-0">
                <Link href={social.instagram} className="text-muted-foreground hover:text-foreground">
                  <Instagram size={20} />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href={social.facebook} className="text-muted-foreground hover:text-foreground">
                  <Facebook size={20} />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href={social.twitter} className="text-muted-foreground hover:text-foreground">
                  <Twitter size={20} />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href={social.linkedin} className="text-muted-foreground hover:text-foreground">
                  <Linkedin size={20} />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Instructor Content */}
        <div className="container py-8">
          <Tabs defaultValue="about" className="space-y-8">
            <TabsList className="w-full justify-start border-b rounded-none p-0">
              <TabsTrigger
                value="about"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                About
              </TabsTrigger>
              <TabsTrigger
                value="courses"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Courses
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Upcoming Events
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Biography</h2>
                    <div className="prose max-w-none dark:prose-invert">
                      <p>{instructor.bio}</p>
                      <p className="mt-4">
                        {instructor.name} specializes in advanced techniques and has been featured in numerous beauty
                        magazines. They have won multiple industry awards for their innovative approaches.
                      </p>
                      <p className="mt-4">
                        As an instructor, {instructor.name} is known for their patient, detailed teaching style and
                        ability to break down complex techniques into easy-to-follow steps. Students consistently praise
                        their hands-on approach and personal attention.
                      </p>
                      <p className="mt-4">
                        When not teaching or working with clients, {instructor.name} travels internationally to attend
                        and speak at beauty conferences, always bringing back the latest trends and techniques.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">Achievements</h2>
                    <ul className="space-y-2">
                      {achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold mb-4">Specialties</h2>
                    <div className="flex flex-wrap gap-2">
                      {instructor.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold mb-4">Certifications</h2>
                    <ul className="space-y-2">
                      {certifications.map((certification, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2" />
                          <span className="text-sm">{certification}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold mb-4">Contact</h2>
                    <Button className="w-full">Contact Instructor</Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="courses">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Courses by {instructor.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coursesData.map((course) => (
                    <Card key={course.id} className="overflow-hidden transition-all hover:shadow-lg">
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          className="object-cover w-full h-full transition-transform hover:scale-105"
                        />
                        <Badge className="absolute top-4 left-4">{course.category}</Badge>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
                        <div className="flex justify-between text-sm text-muted-foreground mb-4">
                          <div className="flex items-center">
                            <Badge variant="outline">{course.level}</Badge>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span>{course.rating}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="font-bold">${course.price}</div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/courses/${course.id}`}>View Course</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="events">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Upcoming Events with {instructor.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {upcomingEvents.map((event) => (
                    <Card key={event.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-muted rounded-md p-3">
                            <Calendar className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{event.title}</h3>
                            <p className="text-muted-foreground mb-2">
                              {event.date} • {event.time}
                            </p>
                            <Badge variant="outline">{event.type}</Badge>
                            {event.location && <p className="mt-2 text-sm">{event.location}</p>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Student Reviews</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((review) => (
                    <Card key={review}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                            <img
                              src={`/placeholder.svg?height=40&width=40`}
                              alt="Student"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">Student Name</h4>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className="h-4 w-4 text-yellow-500 fill-current" />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted-foreground">
                              Amazing instructor! {instructor.name}'s teaching style is so clear and easy to follow. I
                              learned more in their course than in years of practice.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
