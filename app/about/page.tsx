import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Clock, Users, BookOpen, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  // Mock team members
  const teamMembers = [
    {
      name: "Jennifer Wilson",
      role: "Founder & CEO",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Marcus Thompson",
      role: "Education Director",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Sophia Chen",
      role: "Head of Curriculum",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Daniel Jackson",
      role: "Student Success Manager",
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted py-16 md:py-24">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">About Glamour Academy</h1>
                <p className="text-xl text-muted-foreground mb-8">
                  We're dedicated to providing world-class beauty education that transforms passion into successful
                  careers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link href="/courses">Explore Courses</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-300 dark:from-pink-900 dark:to-purple-900 opacity-20 rounded-lg"></div>
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Glamour Academy campus"
                  className="rounded-lg w-full h-auto relative z-10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground">
                Founded in 2015, Glamour Academy began with a simple mission: to provide accessible, high-quality
                education for aspiring beauty professionals.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="mb-4">
                  What started as a small training center with just two instructors has grown into a comprehensive
                  beauty education platform with over 25 specialized courses and more than 5,000 graduates worldwide.
                </p>
                <p className="mb-4">
                  Our founder, Jennifer Wilson, recognized a gap in the beauty education market – most programs were
                  either prohibitively expensive or lacked the practical, hands-on training needed to succeed in the
                  industry.
                </p>
                <p>
                  Today, Glamour Academy combines the flexibility of online learning with intensive practical training,
                  ensuring our students graduate with both the knowledge and skills needed to excel in their beauty
                  careers.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-6 rounded-lg text-center">
                  <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary/20 text-primary mb-4">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">5,000+</h3>
                  <p className="text-muted-foreground">Graduates</p>
                </div>
                <div className="bg-muted p-6 rounded-lg text-center">
                  <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary/20 text-primary mb-4">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">25+</h3>
                  <p className="text-muted-foreground">Courses</p>
                </div>
                <div className="bg-muted p-6 rounded-lg text-center">
                  <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary/20 text-primary mb-4">
                    <Award className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">15+</h3>
                  <p className="text-muted-foreground">Industry Awards</p>
                </div>
                <div className="bg-muted p-6 rounded-lg text-center">
                  <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary/20 text-primary mb-4">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">10+</h3>
                  <p className="text-muted-foreground">Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-muted">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground">These core principles guide everything we do at Glamour Academy.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Award className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Excellence</h3>
                  <p className="text-muted-foreground">
                    We're committed to maintaining the highest standards in beauty education, constantly updating our
                    curriculum to reflect industry innovations.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Inclusivity</h3>
                  <p className="text-muted-foreground">
                    We believe beauty education should be accessible to all, regardless of background, and our courses
                    are designed to accommodate diverse learning styles.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-primary/20 text-primary">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Integrity</h3>
                  <p className="text-muted-foreground">
                    We operate with transparency and honesty, ensuring our students receive the education and support
                    they've been promised.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Leadership Team</h2>
              <p className="text-muted-foreground">
                Meet the dedicated professionals who make Glamour Academy a leader in beauty education.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="mb-4 aspect-square relative overflow-hidden rounded-full">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold">Ready to Start Your Beauty Career?</h2>
              <p className="text-lg opacity-90">
                Join Glamour Academy today and transform your passion into a successful career in the beauty industry.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/courses">Browse Courses</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white hover:bg-white hover:text-primary"
                  asChild
                >
                  <Link href="/register">Register Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
