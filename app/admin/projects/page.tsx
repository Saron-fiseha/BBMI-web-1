"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Search, Download, Loader2, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Project {
  id: string
  name: string
  description: string
  image_url: string
  type: "free" | "paid"
  mentor_name: string
  mentor_address: string
  trainings_count: number
  students_count: number
  status: "active" | "inactive"
  created_at: string
}

export default function ProjectsPage() {
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    image_url: "",
    type: "free" as "free" | "paid",
    mentor_name: "",
    mentor_address: "",
  })

  // Debounced fetch function for real-time search
  const debouncedFetchProjects = useCallback(
    debounce(async (search: string, type: string, status: string) => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (search.trim()) params.append("search", search.trim())
        if (type !== "all") params.append("type", type)
        if (status !== "all") params.append("status", status)

        const response = await fetch(`/api/admin/projects?${params}`)
        if (!response.ok) throw new Error("Failed to fetch projects")

        const data = await response.json()
        setProjects(data.projects || [])
      } catch (error) {
        console.error("Error fetching projects:", error)
        toast({
          title: "Error",
          description: "Failed to fetch projects",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }, 300),
    [toast],
  )

  // Simple debounce function
  function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // Trigger search immediately when filters change
  useEffect(() => {
    debouncedFetchProjects(searchQuery, filterType, filterStatus)
  }, [searchQuery, filterType, filterStatus, debouncedFetchProjects])

  // Initial load
  useEffect(() => {
    debouncedFetchProjects("", "all", "all")
  }, [debouncedFetchProjects])

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newProject.name || !newProject.description || !newProject.mentor_name) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      })

      if (!response.ok) throw new Error("Failed to create project")

      const data = await response.json()
      setProjects([data.project, ...projects])
      setNewProject({
        name: "",
        description: "",
        image_url: "",
        type: "free",
        mentor_name: "",
        mentor_address: "",
      })
      setShowCreateForm(false)

      toast({
        title: "Success",
        description: "Project created successfully",
      })
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditProject = async () => {
    if (!editingProject) return

    try {
      setSubmitting(true)
      const response = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProject),
      })

      if (!response.ok) throw new Error("Failed to update project")

      const data = await response.json()
      setProjects(projects.map((p) => (p.id === editingProject.id ? data.project : p)))
      setIsEditDialogOpen(false)
      setEditingProject(null)

      toast({
        title: "Success",
        description: "Project updated successfully",
      })
    } catch (error) {
      console.error("Error updating project:", error)
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const response = await fetch(`/api/admin/projects?id=${projectId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete project")

      setProjects(projects.filter((p) => p.id !== projectId))
      toast({
        title: "Success",
        description: "Project deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      })
    }
  }

  const exportProjects = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "No,Name,Description,Type,Mentor,Students,Trainings,Status,Created\n" +
      projects
        .map(
          (p, index) =>
            `${index + 1},"${p.name}","${p.description}","${p.type}","${p.mentor_name}",${p.students_count},${p.trainings_count},"${p.status}","${p.created_at}"`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "projects.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const openEditDialog = (project: Project) => {
    setEditingProject({
      ...project,
      // Ensure all fields have string values to prevent null input errors
      name: project.name || "",
      description: project.description || "",
      image_url: project.image_url || "",
      mentor_name: project.mentor_name || "",
      mentor_address: project.mentor_address || "",
      type: project.type || "free",
      status: project.status || "active",
    })
    setIsEditDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600">Manage training projects and programs</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={exportProjects}
            className="border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowCreateForm(true)} className="bg-yellow-600 hover:bg-yellow-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search projects by name, mentor, or description..."
            className="pl-8 border-yellow-200 focus:border-yellow-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px] border-yellow-200 focus:border-yellow-600">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="bg-white border-yellow-200">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px] border-yellow-200 focus:border-yellow-600">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white border-yellow-200">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Table */}
      <div className="bg-white border border-yellow-200 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-yellow-200">
              <TableHead className="text-gray-900 font-semibold">No.</TableHead>
              <TableHead className="text-gray-900 font-semibold">Name</TableHead>
              <TableHead className="text-gray-900 font-semibold">Description</TableHead>
              <TableHead className="text-gray-900 font-semibold">Type</TableHead>
              <TableHead className="text-gray-900 font-semibold">Mentor</TableHead>
              <TableHead className="text-gray-900 font-semibold">Students</TableHead>
              <TableHead className="text-gray-900 font-semibold">Trainings</TableHead>
              <TableHead className="text-gray-900 font-semibold">Status</TableHead>
              <TableHead className="text-gray-900 font-semibold">Created</TableHead>
              <TableHead className="text-gray-900 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project, index) => (
              <TableRow key={project.id} className="border-yellow-100 hover:bg-yellow-50">
                <TableCell className="font-medium text-gray-900">{index + 1}</TableCell>
                <TableCell className="font-medium text-gray-900">{project.name}</TableCell>
                <TableCell className="text-gray-600 max-w-xs truncate">{project.description}</TableCell>
                <TableCell>
                  <Badge
                    variant={project.type === "paid" ? "default" : "secondary"}
                    className={project.type === "paid" ? "bg-yellow-600 text-white" : "bg-gray-600 text-white"}
                  >
                    {project.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">{project.mentor_name}</TableCell>
                <TableCell className="text-gray-900">{project.students_count}</TableCell>
                <TableCell className="text-gray-900">{project.trainings_count}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-yellow-600 text-yellow-600">
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">{new Date(project.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(project)}
                      className="border-yellow-200 text-yellow-600 hover:bg-yellow-600 hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteProject(project.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create Project Form Overlay */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border border-yellow-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
                  <p className="text-gray-600">Set up a new training project</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-600 hover:bg-yellow-100"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-900">Project Name *</label>
                  <Input
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    placeholder="Enter project name"
                    className="border-yellow-200 focus:border-yellow-600"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">Description *</label>
                  <Textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Enter project description"
                    className="border-yellow-200 focus:border-yellow-600"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">Image URL</label>
                  <Input
                    value={newProject.image_url}
                    onChange={(e) => setNewProject({ ...newProject, image_url: e.target.value })}
                    placeholder="Enter image URL (optional)"
                    className="border-yellow-200 focus:border-yellow-600"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">Project Type</label>
                  <Select
                    value={newProject.type}
                    onValueChange={(value: "free" | "paid") => setNewProject({ ...newProject, type: value })}
                  >
                    <SelectTrigger className="border-yellow-200 focus:border-yellow-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-yellow-200">
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">Mentor Name *</label>
                  <Input
                    value={newProject.mentor_name}
                    onChange={(e) => setNewProject({ ...newProject, mentor_name: e.target.value })}
                    placeholder="Enter mentor name"
                    className="border-yellow-200 focus:border-yellow-600"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">Mentor Address</label>
                  <Textarea
                    value={newProject.mentor_address}
                    onChange={(e) => setNewProject({ ...newProject, mentor_address: e.target.value })}
                    placeholder="Enter mentor address (optional)"
                    className="border-yellow-200 focus:border-yellow-600"
                    rows={2}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                    className="border-yellow-200 text-gray-600 hover:bg-yellow-100"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Create Project
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Form Overlay */}
      {isEditDialogOpen && editingProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border border-yellow-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Edit Project</h2>
                  <p className="text-gray-600">Update project information</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="text-gray-600 hover:bg-yellow-100"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-900">Project Name *</label>
                  <Input
                    value={editingProject.name}
                    onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                    placeholder="Enter project name"
                    className="border-yellow-200 focus:border-yellow-600"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">Description *</label>
                  <Textarea
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    placeholder="Enter project description"
                    className="border-yellow-200 focus:border-yellow-600"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">Image URL</label>
                  <Input
                    value={editingProject.image_url}
                    onChange={(e) => setEditingProject({ ...editingProject, image_url: e.target.value })}
                    placeholder="Enter image URL (optional)"
                    className="border-yellow-200 focus:border-yellow-600"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">Project Type</label>
                  <Select
                    value={editingProject.type}
                    onValueChange={(value: "free" | "paid") => setEditingProject({ ...editingProject, type: value })}
                  >
                    <SelectTrigger className="border-yellow-200 focus:border-yellow-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-yellow-200">
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">Status</label>
                  <Select
                    value={editingProject.status}
                    onValueChange={(value: "active" | "inactive") =>
                      setEditingProject({ ...editingProject, status: value })
                    }
                  >
                    <SelectTrigger className="border-yellow-200 focus:border-yellow-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-yellow-200">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">Mentor Name *</label>
                  <Input
                    value={editingProject.mentor_name}
                    onChange={(e) => setEditingProject({ ...editingProject, mentor_name: e.target.value })}
                    placeholder="Enter mentor name"
                    className="border-yellow-200 focus:border-yellow-600"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">Mentor Address</label>
                  <Textarea
                    value={editingProject.mentor_address}
                    onChange={(e) => setEditingProject({ ...editingProject, mentor_address: e.target.value })}
                    placeholder="Enter mentor address (optional)"
                    className="border-yellow-200 focus:border-yellow-600"
                    rows={2}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                    className="border-yellow-200 text-gray-600 hover:bg-yellow-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEditProject}
                    disabled={submitting}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Update Project
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
