"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

  // Fetch projects from database
  const fetchProjects = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append("search", searchQuery)
      if (filterType !== "all") params.append("type", filterType)

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
  }

  useEffect(() => {
    fetchProjects()
  }, [searchQuery, filterType])

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
    setEditingProject({ ...project })
    setIsEditDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-mustard" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-charcoal">Project Management</h1>
          <p className="text-deep-purple">Manage training projects and programs</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={exportProjects}
            className="border-mustard text-mustard hover:bg-mustard hover:text-ivory"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowCreateForm(true)} className="bg-mustard hover:bg-mustard/90 text-ivory">
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-deep-purple" />
          <Input
            placeholder="Search projects..."
            className="pl-8 border-mustard/20 focus:border-mustard"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px] border-mustard/20 focus:border-mustard">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="bg-ivory border-mustard/20">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Table */}
      <div className="bg-ivory border border-mustard/20 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-mustard/20">
              <TableHead className="text-charcoal font-semibold">No.</TableHead>
              <TableHead className="text-charcoal font-semibold">Name</TableHead>
              <TableHead className="text-charcoal font-semibold">Description</TableHead>
              <TableHead className="text-charcoal font-semibold">Type</TableHead>
              <TableHead className="text-charcoal font-semibold">Mentor</TableHead>
              <TableHead className="text-charcoal font-semibold">Students</TableHead>
              <TableHead className="text-charcoal font-semibold">Trainings</TableHead>
              <TableHead className="text-charcoal font-semibold">Status</TableHead>
              <TableHead className="text-charcoal font-semibold">Created</TableHead>
              <TableHead className="text-charcoal font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project, index) => (
              <TableRow key={project.id} className="border-mustard/10 hover:bg-mustard/5">
                <TableCell className="font-medium text-charcoal">{index + 1}</TableCell>
                <TableCell className="font-medium text-charcoal">{project.name}</TableCell>
                <TableCell className="text-deep-purple max-w-xs truncate">{project.description}</TableCell>
                <TableCell>
                  <Badge
                    variant={project.type === "paid" ? "default" : "secondary"}
                    className={project.type === "paid" ? "bg-mustard text-ivory" : "bg-deep-purple text-ivory"}
                  >
                    {project.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-deep-purple">{project.mentor_name}</TableCell>
                <TableCell className="text-charcoal">{project.students_count}</TableCell>
                <TableCell className="text-charcoal">{project.trainings_count}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-mustard text-mustard">
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-deep-purple">{new Date(project.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(project)}
                      className="border-mustard/20 text-mustard hover:bg-mustard hover:text-ivory"
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
          <div className="bg-ivory rounded-lg border border-mustard/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-charcoal">Create New Project</h2>
                  <p className="text-deep-purple">Set up a new training project</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateForm(false)}
                  className="text-deep-purple hover:bg-mustard/10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-charcoal">Project Name *</label>
                  <Input
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    placeholder="Enter project name"
                    className="border-mustard/20 focus:border-mustard"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-charcoal">Description *</label>
                  <Textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Enter project description"
                    className="border-mustard/20 focus:border-mustard"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-charcoal">Image URL</label>
                  <Input
                    value={newProject.image_url}
                    onChange={(e) => setNewProject({ ...newProject, image_url: e.target.value })}
                    placeholder="Enter image URL (optional)"
                    className="border-mustard/20 focus:border-mustard"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-charcoal">Project Type</label>
                  <Select
                    value={newProject.type}
                    onValueChange={(value: "free" | "paid") => setNewProject({ ...newProject, type: value })}
                  >
                    <SelectTrigger className="border-mustard/20 focus:border-mustard">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-ivory border-mustard/20">
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-charcoal">Mentor Name *</label>
                  <Input
                    value={newProject.mentor_name}
                    onChange={(e) => setNewProject({ ...newProject, mentor_name: e.target.value })}
                    placeholder="Enter mentor name"
                    className="border-mustard/20 focus:border-mustard"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-charcoal">Mentor Address</label>
                  <Textarea
                    value={newProject.mentor_address}
                    onChange={(e) => setNewProject({ ...newProject, mentor_address: e.target.value })}
                    placeholder="Enter mentor address (optional)"
                    className="border-mustard/20 focus:border-mustard"
                    rows={2}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                    className="border-mustard/20 text-deep-purple hover:bg-mustard/10"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting} className="bg-mustard hover:bg-mustard/90 text-ivory">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Create Project
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
