import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-background">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Transform Your Passion into a
              <span className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 bg-clip-text text-transparent">
                {" "}
                Beautiful Career
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Join Brushed by Betty Makeup Institute for professional beauty training and certification. Learn from
              industry experts and launch your career in beauty.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
                asChild
              >
                <Link href="/courses">Explore Courses</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-50" asChild>
                <Link href="/register">Join Now</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-yellow-300 dark:from-amber-900 dark:to-yellow-900 opacity-20 rounded-lg"></div>
            <img
              src="/placeholder.svg?height=500&width=600"
              alt="Beauty professionals teaching students at Brushed by Betty"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  )
}
