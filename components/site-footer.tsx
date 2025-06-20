import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-gradient-to-r from-amber-900 to-amber-800 text-white border-t mt-auto">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              Brushed by Betty Makeup Institute
            </h3>
            <p className="text-sm text-amber-100">
              Professional beauty makeup training and certification. Transform your passion into a successful career.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-amber-200 hover:text-amber-300 transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-amber-200 hover:text-amber-300 transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-amber-200 hover:text-amber-300 transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-amber-200 hover:text-amber-300 transition-colors">
                <Youtube size={20} />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 text-amber-300">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/courses" className="text-amber-100 hover:text-amber-300 transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/instructors" className="text-amber-100 hover:text-amber-300 transition-colors">
                  Instructors
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-amber-100 hover:text-amber-300 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-amber-100 hover:text-amber-300 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 text-amber-300">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-amber-100 hover:text-amber-300 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-amber-100 hover:text-amber-300 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-amber-100 hover:text-amber-300 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-amber-100 hover:text-amber-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 text-amber-300">Contact</h3>
            <address className="not-italic text-sm text-amber-100 space-y-2">
              <p>123 Beauty Street</p>
              <p>New York, NY 10001</p>
              <p>Email: info@brushedbybetty.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-amber-700 text-center text-sm text-amber-200">
          <p>&copy; {new Date().getFullYear()} Brushed by Betty Makeup Institute. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
