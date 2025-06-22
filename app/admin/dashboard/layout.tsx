import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

interface Props {
  children: React.ReactNode
}

const AdminDashboardLayout = ({ children }: Props) => {
  return (
    <div className="flex h-screen bg-ivory">

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-ivory">
        <div className="container mx-auto px-6 py-8">{children}</div>
      </div>
    </div>
  )
}

export default AdminDashboardLayout
