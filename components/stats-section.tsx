import { Award, Calendar, Users, BookOpen } from "lucide-react"

export function StatsSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Glamour Academy</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're committed to providing the highest quality beauty education and training.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-background p-6 rounded-lg shadow-sm text-center">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold mb-2">5,000+</h3>
            <p className="text-muted-foreground">Graduates</p>
          </div>

          <div className="bg-background p-6 rounded-lg shadow-sm text-center">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 mb-4">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold mb-2">25+</h3>
            <p className="text-muted-foreground">Specialized Courses</p>
          </div>

          <div className="bg-background p-6 rounded-lg shadow-sm text-center">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mb-4">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold mb-2">15+</h3>
            <p className="text-muted-foreground">Industry Awards</p>
          </div>

          <div className="bg-background p-6 rounded-lg shadow-sm text-center">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 mb-4">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold mb-2">10+</h3>
            <p className="text-muted-foreground">Years of Excellence</p>
          </div>
        </div>
      </div>
    </section>
  )
}
