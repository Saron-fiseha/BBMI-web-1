import type React from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { InstructorLayout } from "@/components/instructor/instructor-layout"


export default function InstructorCoursesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // return <DashboardLayout>{children}</DashboardLayout>
  return <InstructorLayout>{children}</InstructorLayout>
}
