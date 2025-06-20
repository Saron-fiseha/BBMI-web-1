"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Users, Star } from "lucide-react"

const courses = [
  {
    id: 1,
    title: "Advanced Hair Styling Techniques",
    description: "Master the latest hair styling techniques from industry experts.",
    image: "/placeholder.svg?height=200&width=400",
    category: "Hair Styling",
    duration: "8 weeks",
    students: 324,
    rating: 4.8,
    instructor: "Sarah Johnson",
    price: 299,
  },
  {
    id: 2,
    title: "Professional Makeup Artistry",
    description: "Learn professional makeup application for all occasions and skin types.",
    image: "/placeholder.svg?height=200&width=400",
    category: "Makeup",
    duration: "6 weeks",
    students: 412,
    rating: 4.9,
    instructor: "Michael Chen",
    price: 349,
  },
  {
    id: 3,
    title: "Nail Art & Technology",
    description: "From basic manicures to advanced nail art and extensions.",
    image: "/placeholder.svg?height=200&width=400",
    category: "Nail Care",
    duration: "4 weeks",
    students: 256,
    rating: 4.7,
    instructor: "Emily Rodriguez",
    price: 249,
  },
  {
    id: 4,
    title: "Skincare & Facial Treatments",
    description: "Comprehensive training on skincare analysis and facial treatments.",
    image: "/placeholder.svg?height=200&width=400",
    category: "Skincare",
    duration: "5 weeks",
    students: 189,
    rating: 4.6,
    instructor: "David Kim",
    price: 279,
  },
]

export function FeaturedCourses() {
  const [visibleCourses, setVisibleCourses] = useState(3)

  const showMoreCourses = () => {
    setVisibleCourses(courses.length)
  }

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Courses</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our most popular beauty courses taught by industry-leading professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, visibleCourses).map((course) => (
            <Card key={course.id} className="overflow-hidden transition-all hover:shadow-lg">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="object-cover w-full h-full transition-transform hover:scale-105"
                />
                <Badge className="absolute top-4 left-4">{course.category}</Badge>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold">{course.title}</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>
                <p className="text-muted-foreground">{course.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{course.students} students</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm">Instructor: {course.instructor}</div>
                  <div className="font-bold">${course.price}</div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/courses/${course.id}`}>View Course</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {visibleCourses < courses.length && (
          <div className="mt-10 text-center">
            <Button onClick={showMoreCourses} variant="outline" size="lg">
              Show More Courses
            </Button>
          </div>
        )}

        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/courses">Browse All Courses</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
