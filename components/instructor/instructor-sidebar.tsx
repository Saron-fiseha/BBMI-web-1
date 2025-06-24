"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, BookOpen, Users, Star, MessageSquare, Settings, Home, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/instructor/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Courses",
    href: "/instructor/courses",
    icon: BookOpen,
  },
  {
    title: "Schedule Sessions",
    href: "/instructor/sessions",
    icon: Video,
  },
  {
    title: "Students",
    href: "/instructor/students",
    icon: Users,
  },
  {
    title: "Reviews",
    href: "/instructor/reviews",
    icon: Star,
  },
  {
    title: "Messages",
    href: "/instructor/messages",
    icon: MessageSquare,
  },
  {
    title: "Profile",
    href: "/instructor/profile",
    icon: Settings,
  },
]

interface InstructorSidebarProps {
  className?: string
}

export function InstructorSidebar({ className }: InstructorSidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <div className={cn("pb-12 min-h-screen bg-background border-r", className)}>
      <div className="space-y-4 py-4">
        {/* Logo and Brand */}
        <div className="px-3 py-2">
          <Link href="/" className="flex items-center space-x-2 mb-6">
            <Image src="/logo.png" alt="Brushed by Betty" width={32} height={32} className="h-8 w-8" />
            <div className="flex flex-col">
              <span className="font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Brushed by Betty
              </span>
              <span className="text-xs text-muted-foreground">Instructor Portal</span>
            </div>
          </Link>
        </div>

        {/* User Info */}
        <div className="px-3 py-2 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center text-white font-semibold">
              {(user?.full_name?.charAt(0) || "I")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.full_name || "Instructor"}</p>
              <p className="text-xs text-muted-foreground">Instructor</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-3 py-2">
          <div className="space-y-1">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>

        <div className="px-3 py-2">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Button
                key={item.href}
                asChild
                variant={pathname === item.href ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start",
                  pathname === item.href
                    ? "bg-amber-100 text-amber-900 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-100"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
