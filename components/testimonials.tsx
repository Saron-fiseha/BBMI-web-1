"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Jessica Miller",
    role: "Salon Owner",
    image: "/placeholder.svg?height=100&width=100",
    content:
      "The courses at Glamour Academy completely transformed my approach to hair styling. The instructors are top-notch professionals who truly care about student success. I now own my own salon and couldn't have done it without the skills I learned here.",
  },
  {
    id: 2,
    name: "Marcus Thompson",
    role: "Makeup Artist",
    image: "/placeholder.svg?height=100&width=100",
    content:
      "After completing the Professional Makeup Artistry course, I landed a job working with celebrities for major events. The hands-on training and industry connections provided by Glamour Academy were invaluable to my career.",
  },
  {
    id: 3,
    name: "Sophia Chen",
    role: "Nail Technician",
    image: "/placeholder.svg?height=100&width=100",
    content:
      "I was struggling to find quality education in nail art until I discovered Glamour Academy. Their comprehensive curriculum and supportive learning environment helped me master techniques that my clients absolutely love.",
  },
  {
    id: 4,
    name: "Daniel Jackson",
    role: "Esthetician",
    image: "/placeholder.svg?height=100&width=100",
    content:
      "The skincare knowledge I gained at Glamour Academy is unmatched. The instructors stay current with industry trends and teach practical skills that I use daily in my practice. My clients have noticed the difference in my expertise.",
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeTestimonial, setActiveTestimonial] = useState(testimonials[0])

  const handlePrevious = () => {
    const newIndex = (currentIndex - 1 + testimonials.length) % testimonials.length
    setCurrentIndex(newIndex)
    setActiveTestimonial(testimonials[newIndex])
  }

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % testimonials.length
    setCurrentIndex(newIndex)
    setActiveTestimonial(testimonials[newIndex])
  }

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
    setActiveTestimonial(testimonials[index])
  }

  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Students Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from our graduates who have transformed their passion into successful careers.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <Card className="border-none shadow-lg bg-background">
            <CardContent className="p-8 md:p-12">
              <div className="absolute top-8 left-8 text-pink-500 opacity-20">
                <Quote size={60} />
              </div>
              <div className="relative z-10">
                <p className="text-lg md:text-xl italic mb-8">{activeTestimonial.content}</p>
                <div className="flex items-center">
                  <div className="mr-4">
                    <img
                      src={activeTestimonial.image || "/placeholder.svg"}
                      alt={activeTestimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold">{activeTestimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{activeTestimonial.role}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              className="rounded-full"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="rounded-full"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
