"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  UserCog,
  FolderOpen,
  BookOpen,
  GraduationCap,
  PlayCircle,
  UserCheck,
  UserX,
  Settings,
  Home,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const sidebarItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Role Management",
    href: "/admin/roles",
    icon: UserCog,
  },
  {
    title: "User Accounts",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Project Creation",
    href: "/admin/projects",
    icon: FolderOpen,
  },
  {
    title: "Training Categories",
    href: "/admin/categories",
    icon: BookOpen,
  },
  {
    title: "Trainings",
    href: "/admin/trainings",
    icon: GraduationCap,
  },
  {
    title: "Modules",
    href: "/admin/modules",
    icon: PlayCircle,
  },
  {
    title: "Students",
    href: "/admin/students",
    icon: UserCheck,
  },
  {
    title: "Instructors",
    href: "/admin/instructors",
    icon: UserX,
  },
  {
    title: "Profile",
    href: "/admin/profile",
    icon: Settings,
  },
]

interface AdminSidebarProps {
  className?: string
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <TooltipProvider>
      <div className={cn("pb-12 min-h-screen bg-charcoal border-r border-mustard/20 w-16", className)}>
        <div className="space-y-4 py-4">
          <div className="px-2 py-2">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-center rounded-lg p-3 text-sm font-medium hover:bg-mustard/20 hover:text-mustard transition-colors",
                        pathname === item.href ? "bg-mustard/20 text-mustard" : "text-ivory/80",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-charcoal text-ivory border-mustard/20">
                    <p>{item.title}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
