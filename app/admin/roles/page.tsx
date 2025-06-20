"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
}

interface Permission {
  id: string
  name: string
  description: string
  category: string
}

export default function RoleManagementPage() {
  const { toast } = useToast()
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)

  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  })

  // Comprehensive LMS permissions
  const allPermissions: Permission[] = [
    // User Management
    {
      id: "users.create",
      name: "Create Users",
      description: "Add new users to the system",
      category: "User Management",
    },
    {
      id: "users.read",
      name: "View Users",
      description: "View user profiles and information",
      category: "User Management",
    },
    {
      id: "users.update",
      name: "Update Users",
      description: "Edit user profiles and settings",
      category: "User Management",
    },
    {
      id: "users.delete",
      name: "Delete Users",
      description: "Remove users from the system",
      category: "User Management",
    },

    // Course Management
    {
      id: "courses.create",
      name: "Create Courses",
      description: "Add new courses and programs",
      category: "Course Management",
    },
    {
      id: "courses.read",
      name: "View Courses",
      description: "Access course content and information",
      category: "Course Management",
    },
    {
      id: "courses.update",
      name: "Update Courses",
      description: "Edit course content and settings",
      category: "Course Management",
    },
    {
      id: "courses.delete",
      name: "Delete Courses",
      description: "Remove courses from the system",
      category: "Course Management",
    },
    {
      id: "courses.publish",
      name: "Publish Courses",
      description: "Make courses available to students",
      category: "Course Management",
    },

    // Content Management
    {
      id: "content.create",
      name: "Create Content",
      description: "Add lessons, modules, and materials",
      category: "Content Management",
    },
    {
      id: "content.update",
      name: "Update Content",
      description: "Edit existing course content",
      category: "Content Management",
    },
    {
      id: "content.delete",
      name: "Delete Content",
      description: "Remove course content",
      category: "Content Management",
    },

    // Assessment & Grading
    {
      id: "assessments.create",
      name: "Create Assessments",
      description: "Create quizzes and assignments",
      category: "Assessment & Grading",
    },
    {
      id: "assessments.grade",
      name: "Grade Assessments",
      description: "Grade student submissions",
      category: "Assessment & Grading",
    },
    {
      id: "certificates.issue",
      name: "Issue Certificates",
      description: "Generate and issue certificates",
      category: "Assessment & Grading",
    },

    // Student Management
    {
      id: "students.enroll",
      name: "Enroll Students",
      description: "Enroll students in courses",
      category: "Student Management",
    },
    {
      id: "students.progress",
      name: "View Progress",
      description: "Monitor student progress",
      category: "Student Management",
    },
    {
      id: "students.communicate",
      name: "Communicate",
      description: "Send messages to students",
      category: "Student Management",
    },

    // Financial Management
    {
      id: "payments.view",
      name: "View Payments",
      description: "Access payment information",
      category: "Financial Management",
    },
    {
      id: "payments.process",
      name: "Process Payments",
      description: "Handle payment transactions",
      category: "Financial Management",
    },
    {
      id: "reports.financial",
      name: "Financial Reports",
      description: "Generate financial reports",
      category: "Financial Management",
    },

    // System Administration
    {
      id: "system.settings",
      name: "System Settings",
      description: "Configure system settings",
      category: "System Administration",
    },
    {
      id: "system.backup",
      name: "System Backup",
      description: "Perform system backups",
      category: "System Administration",
    },
    {
      id: "roles.manage",
      name: "Manage Roles",
      description: "Create and edit user roles",
      category: "System Administration",
    },

    // Analytics & Reporting
    {
      id: "analytics.view",
      name: "View Analytics",
      description: "Access system analytics",
      category: "Analytics & Reporting",
    },
    {
      id: "reports.generate",
      name: "Generate Reports",
      description: "Create custom reports",
      category: "Analytics & Reporting",
    },

    // Communication
    { id: "messages.send", name: "Send Messages", description: "Send messages to users", category: "Communication" },
    {
      id: "announcements.create",
      name: "Create Announcements",
      description: "Post system announcements",
      category: "Communication",
    },

    // Profile Management
    {
      id: "profile.update",
      name: "Update Profile",
      description: "Edit own profile information",
      category: "Profile Management",
    },
  ]

  useEffect(() => {
    setPermissions(allPermissions)
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/admin/roles")
      if (response.ok) {
        const data = await response.json()
        setRoles(data.roles || [])
      }
    } catch (error) {
      console.error("Error fetching roles:", error)
      toast({
        title: "Error",
        description: "Failed to fetch roles",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRole = async () => {
    try {
      const response = await fetch("/api/admin/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRole),
      })

      if (response.ok) {
        const result = await response.json()
        setRoles([...roles, result.role])
        setNewRole({ name: "", description: "", permissions: [] })
        setIsCreateDialogOpen(false)
        toast({
          title: "Role created",
          description: `${newRole.name} role has been created successfully.`,
        })
      } else {
        throw new Error("Failed to create role")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create role",
        variant: "destructive",
      })
    }
  }

  const handleUpdateRole = async () => {
    if (!editingRole) return

    try {
      const response = await fetch(`/api/admin/roles/${editingRole.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingRole.name,
          description: editingRole.description,
          permissions: editingRole.permissions,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setRoles(roles.map((role) => (role.id === editingRole.id ? result.role : role)))
        setEditingRole(null)
        setIsEditDialogOpen(false)
        toast({
          title: "Role updated",
          description: "Role has been updated successfully.",
        })
      } else {
        throw new Error("Failed to update role")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      })
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    try {
      const response = await fetch(`/api/admin/roles/${roleId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setRoles(roles.filter((role) => role.id !== roleId))
        toast({
          title: "Role deleted",
          description: "Role has been deleted successfully.",
        })
      } else {
        throw new Error("Failed to delete role")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive",
      })
    }
  }

  const handlePermissionChange = (permissionId: string, checked: boolean, isEditing = false) => {
    if (isEditing && editingRole) {
      const updatedPermissions = checked
        ? [...editingRole.permissions, permissionId]
        : editingRole.permissions.filter((p) => p !== permissionId)
      setEditingRole({ ...editingRole, permissions: updatedPermissions })
    } else {
      const updatedPermissions = checked
        ? [...newRole.permissions, permissionId]
        : newRole.permissions.filter((p) => p !== permissionId)
      setNewRole({ ...newRole, permissions: updatedPermissions })
    }
  }

  const groupedPermissions = permissions.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = []
      }
      acc[permission.category].push(permission)
      return acc
    },
    {} as Record<string, Permission[]>,
  )

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-charcoal">Role Management</h1>
          <p className="text-deep-purple">Manage user roles and permissions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-mustard hover:bg-mustard/90 text-ivory">
              <Plus className="h-4 w-4 mr-2" />
              Add New Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-ivory border-mustard/20">
            <DialogHeader>
              <DialogTitle className="text-charcoal">Create New Role</DialogTitle>
              <DialogDescription className="text-deep-purple">
                Define a new role with specific permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-charcoal">Role Name</label>
                <Input
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  placeholder="Enter role name"
                  className="border-mustard/20 focus:border-mustard"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal">Description</label>
                <Input
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  placeholder="Enter role description"
                  className="border-mustard/20 focus:border-mustard"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-charcoal">Permissions</label>
                <div className="space-y-4 max-h-96 overflow-y-auto border border-mustard/20 rounded-lg p-4">
                  {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="font-medium text-charcoal border-b border-mustard/20 pb-1">{category}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {categoryPermissions.map((permission) => (
                          <div key={permission.id} className="flex items-start space-x-2">
                            <Checkbox
                              id={permission.id}
                              checked={newRole.permissions.includes(permission.id)}
                              onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                            />
                            <div className="grid gap-1.5 leading-none">
                              <label
                                htmlFor={permission.id}
                                className="text-sm font-medium text-charcoal cursor-pointer"
                              >
                                {permission.name}
                              </label>
                              <p className="text-xs text-deep-purple">{permission.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                className="border-mustard/20 text-mustard hover:bg-mustard/10"
              >
                Cancel
              </Button>
              <Button onClick={handleCreateRole} className="bg-mustard hover:bg-mustard/90 text-ivory">
                Create Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {roles.map((role, index) => (
          <Card key={role.id} className="border-mustard/20">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2 text-charcoal">
                    <span className="bg-mustard text-ivory px-2 py-1 rounded text-sm font-bold">#{index + 1}</span>
                    {role.name}
                    <Badge variant="secondary" className="bg-deep-purple/20 text-deep-purple">
                      {role.userCount} users
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-deep-purple">{role.description}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingRole(role)
                      setIsEditDialogOpen(true)
                    }}
                    className="border-mustard/20 text-mustard hover:bg-mustard hover:text-ivory"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteRole(role.id)}
                    disabled={role.name === "Admin"}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <h4 className="font-medium mb-2 text-charcoal">Permissions:</h4>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permissionId) => {
                    const permission = permissions.find((p) => p.id === permissionId)
                    return (
                      <Badge key={permissionId} variant="outline" className="border-mustard/30 text-mustard">
                        {permission?.name || permissionId}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-ivory border-mustard/20">
          <DialogHeader>
            <DialogTitle className="text-charcoal">Edit Role</DialogTitle>
            <DialogDescription className="text-deep-purple">Update role information and permissions</DialogDescription>
          </DialogHeader>
          {editingRole && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-charcoal">Role Name</label>
                <Input
                  value={editingRole.name}
                  onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                  placeholder="Enter role name"
                  className="border-mustard/20 focus:border-mustard"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal">Description</label>
                <Input
                  value={editingRole.description}
                  onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                  placeholder="Enter role description"
                  className="border-mustard/20 focus:border-mustard"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-charcoal">Permissions</label>
                <div className="space-y-4 max-h-96 overflow-y-auto border border-mustard/20 rounded-lg p-4">
                  {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="font-medium text-charcoal border-b border-mustard/20 pb-1">{category}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {categoryPermissions.map((permission) => (
                          <div key={permission.id} className="flex items-start space-x-2">
                            <Checkbox
                              id={`edit-${permission.id}`}
                              checked={editingRole.permissions.includes(permission.id)}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(permission.id, checked as boolean, true)
                              }
                            />
                            <div className="grid gap-1.5 leading-none">
                              <label
                                htmlFor={`edit-${permission.id}`}
                                className="text-sm font-medium text-charcoal cursor-pointer"
                              >
                                {permission.name}
                              </label>
                              <p className="text-xs text-deep-purple">{permission.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-mustard/20 text-mustard hover:bg-mustard/10"
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateRole} className="bg-mustard hover:bg-mustard/90 text-ivory">
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
