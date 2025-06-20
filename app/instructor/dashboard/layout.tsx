import type React from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function InstructorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
