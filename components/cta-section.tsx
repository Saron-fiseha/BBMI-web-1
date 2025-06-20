import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
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
  )
}
