"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Search, Download, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface Training {
  id: string
  name: string
  description: string
  image_url: string
  course_code: string
  category_id: string
  category_name: string
  price: number
  discount: number
  max_trainees: number
  current_trainees: number
  modules_count: number
  status: "active" | "inactive" | "draft"
  created_at: string
}

interface Category {
  id: string
  name: string
}

export default function TrainingsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [trainings, setTrainings] = useState<Training[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingTraining, setEditingTraining] = useState<Training | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const [newTraining, setNewTraining] = useState({
    name: "",
    description: "",
    image_url: "",
    course_code: "",
    category_id: "",
    price: 0,
    discount: 0,
    max_trainees: 0,
    status: "draft" as "active" | "inactive" | "draft",
  })

  // Fetch trainings and categories on component mount
  useEffect(() => {
    fetchTrainings()
    fetchCategories()
  }, [])

  const fetchTrainings = async () => {
    try {
      console.log("🔍 Fetching trainings...")
      const response = await fetch("/api/admin/trainings")

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Trainings fetched successfully:", data.trainings?.length || 0)
        setTrainings(data.trainings || [])
      } else {
        const errorData = await response.json()
        console.error("❌ Failed to fetch trainings:", errorData)
        toast({
          title: "Error",
          description: errorData.error || "Failed to fetch trainings",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("❌ Error fetching trainings:", error)
      toast({
        title: "Error",
        description: "Failed to fetch trainings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      console.log("🔍 Fetching categories...")
      const response = await fetch("/api/admin/categories")

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Categories fetched successfully:", data.categories?.length || 0)
        setCategories(data.categories || [])
      } else {
        console.error("❌ Failed to fetch categories")
      }
    } catch (error) {
      console.error("❌ Error fetching categories:", error)
    }
  }

  const filteredTrainings = trainings.filter((training) => {
    const matchesSearch =
      training.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      training.course_code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || training.category_id === filterCategory
    const matchesStatus = filterStatus === "all" || training.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleDeleteTraining = async (trainingId: string) => {
    if (!confirm("Are you sure you want to delete this training? This action cannot be undone.")) return

    try {
      console.log("🗑️ Deleting training:", trainingId)

      const response = await fetch(`/api/admin/trainings?id=${trainingId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTrainings((prev) => prev.filter((training) => training.id !== trainingId))
        toast({
          title: "Success",
          description: "Training deleted successfully",
        })
        console.log("✅ Training deleted successfully")
      } else {
        const errorData = await response.json()
        console.error("❌ Delete failed:", errorData)
        toast({
          title: "Error",
          description: errorData.error || "Failed to delete training",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("❌ Error deleting training:", error)
      toast({
        title: "Error",
        description: "Failed to delete training",
        variant: "destructive",
      })
    }
  }

  const handleEditTraining = (training: Training) => {
    console.log("✏️ Editing training:", training.name)
    setEditingTraining(training)
    setNewTraining({
      name: training.name,
      description: training.description,
      image_url: training.image_url || "",
      course_code: training.course_code,
      category_id: training.category_id,
      price: training.price,
      discount: training.discount,
      max_trainees: training.max_trainees,
      status: training.status,
    })
    setIsEditing(true)
    setShowForm(true)
  }

  const handleSubmitTraining = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("🚀 Starting training submission...")
    console.log("📝 Form data:", newTraining)
    console.log("🔄 Is editing:", isEditing)

    // Validation
    if (!newTraining.name || !newTraining.description || !newTraining.course_code || !newTraining.category_id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const url = "/api/admin/trainings"
      const method = isEditing ? "PUT" : "POST"
      const body = isEditing ? JSON.stringify({ ...newTraining, id: editingTraining?.id }) : JSON.stringify(newTraining)

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body,
      })

      console.log("📡 Response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("🎉 Training saved successfully:", data.training)

        const categoryName = categories.find((c) => c.id === newTraining.category_id)?.name || "Unknown"

        const trainingWithCategory = {
          ...data.training,
          category_name: categoryName,
          current_trainees: 0,
          modules_count: 0,
        }

        if (isEditing) {
          // Update existing training in the list
          setTrainings((prev) =>
            prev.map((training) => (training.id === editingTraining?.id ? trainingWithCategory : training)),
          )
          toast({
            title: "Success",
            description: "Training updated successfully",
          })
        } else {
          // Add new training to the list
          setTrainings((prev) => [trainingWithCategory, ...prev])
          toast({
            title: "Success",
            description: "Training created successfully",
          })
        }

        // Reset form
        setNewTraining({
          name: "",
          description: "",
          image_url: "",
          course_code: "",
          category_id: "",
          price: 0,
          discount: 0,
          max_trainees: 0,
          status: "draft",
        })
        setEditingTraining(null)
        setIsEditing(false)
        setShowForm(false)
      } else {
        const errorData = await response.json()
        console.error("❌ Error saving training:", errorData)
        toast({
          title: "Error",
          description: errorData.error || `Failed to ${isEditing ? "update" : "create"} training`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("❌ Error saving training:", error)
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} training`,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const exportTrainings = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Code,Category,Price,Discount,Trainees,Modules,Status\n" +
      filteredTrainings
        .map(
          (t) =>
            `"${t.name}","${t.course_code}","${t.category_name}",${t.price},${t.discount},${t.current_trainees}/${t.max_trainees},${t.modules_count},"${t.status}"`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "trainings.csv")
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

  const handleAddTraining = () => {
    console.log("➕ Adding new training")
    setEditingTraining(null)
    setIsEditing(false)
    setNewTraining({
      name: "",
      description: "",
      image_url: "",
      course_code: "",
      category_id: "",
      price: 0,
      discount: 0,
      max_trainees: 0,
      status: "draft",
    })
    setShowForm(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trainings Management</h1>
          <p className="text-gray-600">Manage specific training courses and modules</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportTrainings}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={handleAddTraining}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Training
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trainings..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
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

      {/* Trainings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Trainings ({trainings.length})</CardTitle>
          <CardDescription>Complete list of training courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">#</th>
                  <th className="text-left p-4">Training</th>
                  <th className="text-left p-4">Code</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Trainees</th>
                  <th className="text-left p-4">Modules</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrainings.map((training, index) => (
                  <tr key={training.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-500">{index + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative h-12 w-12">
                          <Image
                            src={training.image_url || "/placeholder.svg?height=48&width=48"}
                            alt={training.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{training.name}</div>
                          <div className="text-sm text-gray-500">{training.description.substring(0, 50)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-sm">{training.course_code}</td>
                    <td className="p-4">{training.category_name}</td>
                    <td className="p-4">
                      <div>
                        ${training.price}
                        {training.discount > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            -{training.discount}%
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {training.current_trainees}/{training.max_trainees}
                    </td>
                    <td className="p-4">{training.modules_count}</td>
                    <td className="p-4">
                      <Badge className={getStatusColor(training.status)}>{training.status}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditTraining(training)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteTraining(training.id)}
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
            {filteredTrainings.length === 0 && <div className="text-center py-8 text-gray-500">No trainings found</div>}
          </div>
        </CardContent>
      </Card>

      {/* Add Training Form Overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">{isEditing ? "Edit Training" : "Create New Training"}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowForm(false)
                  setIsEditing(false)
                  setEditingTraining(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmitTraining} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Training Name *</label>
                  <Input
                    value={newTraining.name}
                    onChange={(e) => setNewTraining({ ...newTraining, name: e.target.value })}
                    placeholder="Enter training name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Code *</label>
                  <Input
                    value={newTraining.course_code}
                    onChange={(e) => setNewTraining({ ...newTraining, course_code: e.target.value })}
                    placeholder="e.g., MKP-ADV-001"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <Textarea
                  value={newTraining.description}
                  onChange={(e) => setNewTraining({ ...newTraining, description: e.target.value })}
                  placeholder="Enter training description"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <Input
                  value={newTraining.image_url}
                  onChange={(e) => setNewTraining({ ...newTraining, image_url: e.target.value })}
                  placeholder="Enter image URL"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <Select
                    value={newTraining.category_id}
                    onValueChange={(value) => setNewTraining({ ...newTraining, category_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <Select
                    value={newTraining.status}
                    onValueChange={(value: "active" | "inactive" | "draft") =>
                      setNewTraining({ ...newTraining, status: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          <span>Draft</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="active">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span>Active</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="inactive">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                          <span>Inactive</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <Input
                    type="number"
                    value={newTraining.price}
                    onChange={(e) => setNewTraining({ ...newTraining, price: Number(e.target.value) })}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                  <Input
                    type="number"
                    value={newTraining.discount}
                    onChange={(e) => setNewTraining({ ...newTraining, discount: Number(e.target.value) })}
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Trainees</label>
                  <Input
                    type="number"
                    value={newTraining.max_trainees}
                    onChange={(e) => setNewTraining({ ...newTraining, max_trainees: Number(e.target.value) })}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setIsEditing(false)
                    setEditingTraining(null)
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : isEditing ? (
                    "Update Training"
                  ) : (
                    "Create Training"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
