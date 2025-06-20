"use client"

import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Award } from "lucide-react"

export default function InstructorsPage() {
  // Mock instructors data
  const instructors = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Master Hair Stylist",
      bio: "With over 15 years of experience in the beauty industry, Sarah has worked with celebrities and taught at prestigious beauty schools worldwide.",
      image: "/placeholder.svg?height=300&width=300",
      specialties: ["Hair Styling", "Hair Coloring", "Bridal Styling"],
      experience: "15+ years",
      students: 1200,
      courses: 8,
      rating: 4.9,
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Professional Makeup Artist",
      bio: "Michael is a renowned makeup artist with expertise in editorial, bridal, and special effects makeup. He has worked on major film productions and fashion shows.",
      image: "/placeholder.svg?height=300&width=300",
      specialties: ["Makeup Artistry", "Special Effects", "Editorial Makeup"],
      experience: "12+ years",
      students: 950,
      courses: 6,
      rating: 4.8,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      title: "Nail Art Specialist",
      bio: "Emily is a creative nail artist known for her innovative designs and techniques. She has won multiple nail art competitions and teaches advanced nail technology.",
      image: "/placeholder.svg?height=300&width=300",
      specialties: ["Nail Art", "Nail Extensions", "Nail Technology"],
      experience: "8+ years",
      students: 650,
      courses: 4,
      rating: 4.7,
    },
    {
      id: 4,
      name: "David Kim",
      title: "Skincare Expert",
      bio: "David is a licensed esthetician with extensive knowledge in skincare analysis and facial treatments. He specializes in anti-aging and acne treatments.",
      image: "/placeholder.svg?height=300&width=300",
      specialties: ["Skincare", "Facial Treatments", "Anti-aging"],
      experience: "10+ years",
      students: 800,
      courses: 5,
      rating: 4.6,
    },
    {
      id: 5,
      name: "Jessica Williams",
      title: "Color Specialist",
      bio: "Jessica is an expert in hair coloring techniques, from traditional highlights to creative color transformations. She stays current with the latest color trends.",
      image: "/placeholder.svg?height=300&width=300",
      specialties: ["Hair Coloring", "Balayage", "Creative Color"],
      experience: "11+ years",
      students: 750,
      courses: 7,
      rating: 4.8,
    },
    {
      id: 6,
      name: "Robert Martinez",
      title: "Barbering Expert",
      bio: "Robert is a master barber with expertise in classic and modern men's grooming. He teaches precision cutting and traditional barbering techniques.",
      image: "/placeholder.svg?height=300&width=300",
      specialties: ["Men's Grooming", "Barbering", "Precision Cutting"],
      experience: "18+ years",
      students: 600,
      courses: 3,
      rating: 4.9,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-muted py-12">
          <div className="container">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Meet Our Expert Instructors</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Learn from industry professionals with years of experience and proven track records in the beauty
                industry.
              </p>
            </div>
          </div>
        </div>

        {/* Instructors Grid */}
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor) => (
              <Card key={instructor.id} className="overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={instructor.image || "/placeholder.svg"}
                    alt={instructor.name}
                    className="object-cover w-full h-full transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{instructor.name}</CardTitle>
                  <CardDescription>{instructor.title}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">{instructor.bio}</p>

                  <div className="flex flex-wrap gap-1">
                    {instructor.specialties.slice(0, 2).map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {instructor.specialties.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{instructor.specialties.length - 2} more
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        <Award className="h-4 w-4" />
                      </div>
                      <div className="font-medium">{instructor.experience}</div>
                      <div className="text-muted-foreground">Experience</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        <Users className="h-4 w-4" />
                      </div>
                      <div className="font-medium">{instructor.students}+</div>
                      <div className="text-muted-foreground">Students</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                      </div>
                      <div className="font-medium">{instructor.rating}</div>
                      <div className="text-muted-foreground">Rating</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/instructors/${instructor.id}`}>View Profile</Link>
                    </Button>
                    <Button size="sm" className="flex-1" asChild>
                      <Link href="/courses">View Courses</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-muted py-12">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Learn from the Best?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of students who have transformed their careers with our expert-led courses.
            </p>
            <Button size="lg" asChild>
              <Link href="/courses">Browse All Courses</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
