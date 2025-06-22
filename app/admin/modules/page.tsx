"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Search, Download, Play, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Module {
  id: string
  name: string
  description: string
  moduleCode: string
  programId: string
  programName: string
  videoId: string
  duration: number
  order: number
  status: "active" | "inactive" | "draft"
  createdAt: string
}

interface Program {
  id: string
  name: string
}

export default function ModulesPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterProgram, setFilterProgram] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingModule, setEditingModule] = useState<Module | null>(null)

  const [modules, setModules] = useState<Module[]>([])
  const [programs, setPrograms] = useState<Program[]>([])

  const [newModule, setNewModule] = useState({
    name: "",
    description: "",
    moduleCode: "",
    programId: "",
    videoId: "",
    duration: 0,
    order: 1,
    status: "draft" as "active" | "inactive" | "draft",
  })

  // Fetch modules and programs from database
  useEffect(() => {
    fetchModules()
    fetchPrograms()
  }, [])

  const fetchModules = async () => {
    console.log("🔍 Fetching modules...")
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/modules")
      console.log("📡 Modules response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Modules fetched successfully:", data.length)
        setModules(data)
      } else {
        const errorText = await response.text()
        console.error("❌ Failed to fetch modules:", errorText)
        throw new Error(`Failed to fetch modules: ${response.status}`)
      }
    } catch (error) {
      console.error("❌ Modules fetch error:", error)
      toast({
        title: "Error",
        description: "Failed to fetch modules",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPrograms = async () => {
    try {
      const response = await fetch("/api/admin/trainings")
      if (response.ok) {
        const data = await response.json()
        // Handle the correct response structure - data.trainings contains the array
        if (data.trainings && Array.isArray(data.trainings)) {
          setPrograms(data.trainings.map((training: any) => ({ id: training.id, name: training.name })))
        } else {
          console.error("Trainings data structure is incorrect:", data)
          // Fallback to sample data
          setPrograms([
            { id: "1", name: "Advanced Makeup Techniques" },
            { id: "2", name: "Hair Styling Fundamentals" },
            { id: "3", name: "Skincare Specialist Certification" },
          ])
        }
      }
    } catch (error) {
      console.error("Error fetching programs:", error)
      // Fallback to sample data
      setPrograms([
        { id: "1", name: "Advanced Makeup Techniques" },
        { id: "2", name: "Hair Styling Fundamentals" },
        { id: "3", name: "Skincare Specialist Certification" },
      ])
    }
  }

  const filteredModules = modules.filter((module) => {
    const matchesSearch =
      module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.moduleCode.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProgram = filterProgram === "all" || module.programId === filterProgram
    const matchesStatus = filterStatus === "all" || module.status === filterStatus
    return matchesSearch && matchesProgram && matchesStatus
  })

  const handleCreateModule = async () => {
    console.log("🚀 Starting module creation...")

    // Validation
    if (
      !newModule.name ||
      !newModule.description ||
      !newModule.moduleCode ||
      !newModule.programId ||
      !newModule.videoId ||
      !newModule.status
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields marked with *",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const programName = programs.find((p) => p.id === newModule.programId)?.name || ""
      console.log("📝 Creating module with data:", { ...newModule, programName })

      const response = await fetch("/api/admin/modules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newModule,
          programName,
        }),
      })

      console.log("📡 Create response status:", response.status)

      if (response.ok) {
        const savedModule = await response.json()
        console.log("🎉 Module created successfully:", savedModule)

        setModules([savedModule, ...modules])

        // Reset form
        setNewModule({
          name: "",
          description: "",
          moduleCode: "",
          programId: "",
          videoId: "",
          duration: 0,
          order: 1,
          status: "draft",
        })

        setShowForm(false)

        toast({
          title: "Module created successfully!",
          description: `${newModule.name} has been added to the system.`,
        })
      } else {
        const errorText = await response.text()
        console.error("❌ Create failed:", errorText)
        throw new Error("Failed to create module")
      }
    } catch (error) {
      console.error("❌ Error creating module:", error)
      toast({
        title: "Error",
        description: "Failed to create module. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditModule = async () => {
    console.log("🔄 Starting module update...")

    if (!editingModule) return

    // Validation
    if (
      !newModule.name ||
      !newModule.description ||
      !newModule.moduleCode ||
      !newModule.programId ||
      !newModule.videoId ||
      !newModule.status
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields marked with *",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const programName = programs.find((p) => p.id === newModule.programId)?.name || ""
      console.log("📝 Updating module with data:", { ...newModule, programName })

      const response = await fetch("/api/admin/modules", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingModule.id,
          ...newModule,
          programName,
        }),
      })

      console.log("📡 Update response status:", response.status)

      if (response.ok) {
        const updatedModule = await response.json()
        console.log("🎉 Module updated successfully:", updatedModule)

        setModules(modules.map((module) => (module.id === editingModule.id ? updatedModule : module)))

        // Reset form
        setNewModule({
          name: "",
          description: "",
          moduleCode: "",
          programId: "",
          videoId: "",
          duration: 0,
          order: 1,
          status: "draft",
        })

        setEditingModule(null)
        setShowForm(false)

        toast({
          title: "Module updated successfully!",
          description: `${newModule.name} has been updated.`,
        })
      } else {
        const errorText = await response.text()
        console.error("❌ Update failed:", errorText)
        throw new Error("Failed to update module")
      }
    } catch (error) {
      console.error("❌ Error updating module:", error)
      toast({
        title: "Error",
        description: "Failed to update module. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteModule = async (moduleId: string) => {
    console.log("🗑️ Deleting module:", moduleId)

    if (!confirm("Are you sure you want to delete this module? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/modules/${moduleId}`, {
        method: "DELETE",
      })

      console.log("📡 Delete response status:", response.status)

      if (response.ok) {
        console.log("🎉 Module deleted successfully")
        setModules(modules.filter((module) => module.id !== moduleId))
        toast({
          title: "Module deleted",
          description: "Module has been deleted successfully.",
        })
      } else {
        const errorText = await response.text()
        console.error("❌ Delete failed:", errorText)
        throw new Error("Failed to delete module")
      }
    } catch (error) {
      console.error("❌ Error deleting module:", error)
      toast({
        title: "Error",
        description: "Failed to delete module.",
        variant: "destructive",
      })
    }
  }

  const handleEditClick = (module: Module) => {
    console.log("✏️ Editing module:", module.name)
    setEditingModule(module)
    setNewModule({
      name: module.name,
      description: module.description,
      moduleCode: module.moduleCode,
      programId: module.programId,
      videoId: module.videoId,
      duration: module.duration,
      order: module.order,
      status: module.status,
    })
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingModule(null)
    setNewModule({
      name: "",
      description: "",
      moduleCode: "",
      programId: "",
      videoId: "",
      duration: 0,
      order: 1,
      status: "draft",
    })
  }

  const exportModules = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "#,Name,Code,Program,Duration,Order,Status,VideoID\n" +
      filteredModules
        .map(
          (m, index) =>
            `${index + 1},"${m.name}","${m.moduleCode}","${m.programName}",${m.duration},${m.order},"${m.status}","${m.videoId}"`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "modules.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusDot = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "inactive":
        return "bg-gray-500"
      case "draft":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    const match = url.match(regex)
    return match ? match[1] : url
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modules Management</h1>
          <p className="text-gray-600">Manage learning modules with YouTube video integration</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportModules}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white transform hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Module
          </Button>
        </div>
      </div>

      {/* Form Overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">{editingModule ? "Edit Module" : "Create New Module"}</h2>
              <Button variant="ghost" size="sm" onClick={handleFormClose} className="text-gray-500 hover:text-gray-700">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Module Name *</label>
                  <Input
                    value={newModule.name}
                    onChange={(e) => setNewModule({ ...newModule, name: e.target.value })}
                    placeholder="Enter module name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Module Code *</label>
                  <Input
                    value={newModule.moduleCode}
                    onChange={(e) => setNewModule({ ...newModule, moduleCode: e.target.value })}
                    placeholder="e.g., MKP-001-01"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <Textarea
                  value={newModule.description}
                  onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                  placeholder="Enter module description"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Training Program *</label>
                  <Select
                    value={newModule.programId}
                    onValueChange={(value) => setNewModule({ ...newModule, programId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <Select
                    value={newModule.status}
                    onValueChange={(value: "active" | "inactive" | "draft") =>
                      setNewModule({ ...newModule, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusDot("draft")}`}></div>
                          <span>Draft</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="active">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusDot("active")}`}></div>
                          <span>Active</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="inactive">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusDot("inactive")}`}></div>
                          <span>Inactive</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Video URL/ID *</label>
                <Input
                  value={newModule.videoId}
                  onChange={(e) => setNewModule({ ...newModule, videoId: extractVideoId(e.target.value) })}
                  placeholder="Enter YouTube URL or Video ID"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes) *</label>
                  <Input
                    type="number"
                    value={newModule.duration}
                    onChange={(e) => setNewModule({ ...newModule, duration: Number(e.target.value) })}
                    placeholder="0"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <Input
                    type="number"
                    value={newModule.order}
                    onChange={(e) => setNewModule({ ...newModule, order: Number(e.target.value) })}
                    placeholder="1"
                    min="1"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={handleFormClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                onClick={editingModule ? handleEditModule : handleCreateModule}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editingModule ? "Updating..." : "Creating..."}
                  </>
                ) : editingModule ? (
                  "Update Module"
                ) : (
                  "Create Module"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search modules..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterProgram} onValueChange={setFilterProgram}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by program" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Programs</SelectItem>
            {programs.map((program) => (
              <SelectItem key={program.id} value={program.id}>
                {program.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Modules Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Modules ({filteredModules.length})</CardTitle>
          <CardDescription>Complete list of learning modules</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
              <span className="ml-2 text-gray-600">Loading modules...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">#</th>
                    <th className="text-left p-4">Module</th>
                    <th className="text-left p-4">Code</th>
                    <th className="text-left p-4">Program</th>
                    <th className="text-left p-4">Duration</th>
                    <th className="text-left p-4">Order</th>
                    <th className="text-left p-4">Video</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredModules.map((module, index) => (
                    <tr key={module.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-gray-500 font-medium">{index + 1}</td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{module.name}</div>
                          <div className="text-sm text-gray-500">{module.description.substring(0, 50)}...</div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-sm">{module.moduleCode}</td>
                      <td className="p-4">{module.programName}</td>
                      <td className="p-4">{formatDuration(module.duration)}</td>
                      <td className="p-4">#{module.order}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Play className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-mono">{module.videoId}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(module.status)}>{module.status}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditClick(module)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteModule(module.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}