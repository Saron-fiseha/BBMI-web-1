"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Search, Download, Loader2, X, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

interface Category {
  id: string
  name: string
  description: string
  image_url: string
  level: "beginner" | "intermediate" | "advanced"
  trainings_count: number
  status: "active" | "inactive"
  created_at: string
}

export default function CategoriesPage() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterLevel, setFilterLevel] = useState("all")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    image_url: "",
    level: "beginner" as "beginner" | "intermediate" | "advanced",
  })

  // Fetch categories from database
  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("🔍 Fetching categories...")

      const params = new URLSearchParams()
      if (searchQuery) params.append("search", searchQuery)
      if (filterLevel !== "all") params.append("level", filterLevel)

      const url = `/api/admin/categories?${params}`
      console.log("🔍 Fetching from URL:", url)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      console.log("📡 Response status:", response.status)
      console.log("📡 Response ok:", response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Response not ok:", errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("📊 Received data:", data)

      if (data.success === false) {
        throw new Error(data.error || "Failed to fetch categories")
      }

      const categoriesData = data.categories || []
      console.log("✅ Categories loaded:", categoriesData.length)

      setCategories(categoriesData)
    } catch (error) {
      console.error("❌ Error fetching categories:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch categories"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch categories on component mount
  useEffect(() => {
    console.log("🚀 Component mounted, fetching categories...")
    fetchCategories()
  }, [])

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!loading) {
        console.log("🔍 Search/filter changed, refetching...")
        fetchCategories()
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, filterLevel])

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("🚀 Starting category creation...")

    // Validation
    if (!newCategory.name.trim() || !newCategory.description.trim()) {
      const errorMsg = "Please fill in all required fields"
      console.log("❌ Validation failed:", errorMsg)
      toast({
        title: "Validation Error",
        description: errorMsg,
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      console.log("📝 Creating category with data:", newCategory)

      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      })

      console.log("📡 Create response status:", response.status)
      console.log("📡 Create response ok:", response.ok)

      const responseText = await response.text()
      console.log("📡 Raw response:", responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("❌ Failed to parse response:", parseError)
        throw new Error(`Invalid response format: ${responseText}`)
      }

      console.log("📊 Parsed response data:", data)

      if (!response.ok) {
        throw new Error(data.error || data.details || `HTTP ${response.status}`)
      }

      if (data.success === false) {
        throw new Error(data.error || "Failed to create category")
      }

      if (!data.category) {
        throw new Error("No category data returned from server")
      }

      console.log("🎉 Category created successfully:", data.category)

      // Add new category to the beginning of the list for immediate feedback
      const newCategoryWithDefaults = {
        ...data.category,
        trainings_count: 0,
        status: "active" as const,
      }

      setCategories((prev) => {
        console.log("📊 Adding category to list, current count:", prev.length)
        const updated = [newCategoryWithDefaults, ...prev]
        console.log("📊 New list count:", updated.length)
        return updated
      })

      // Reset form
      setNewCategory({
        name: "",
        description: "",
        image_url: "",
        level: "beginner",
      })

      // Close form
      setShowCreateForm(false)

      toast({
        title: "Success",
        description: "Category created successfully and is now available on courses pages",
      })

      // Refresh data to ensure consistency
      setTimeout(() => {
        console.log("🔄 Refreshing categories list...")
        fetchCategories()
      }, 1000)
    } catch (error) {
      console.error("❌ Error creating category:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to create category"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return

    try {
      setSubmitting(true)
      const response = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCategory),
      })

      const data = await response.json()

      if (!response.ok || data.success === false) {
        throw new Error(data.error || data.details || "Failed to update category")
      }

      setCategories(categories.map((c) => (c.id === editingCategory.id ? data.category : c)))
      setShowEditForm(false)
      setEditingCategory(null)

      toast({
        title: "Success",
        description: "Category updated successfully",
      })
    } catch (error) {
      console.error("Error updating category:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to update category"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    try {
      const response = await fetch(`/api/admin/categories?id=${categoryId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok || data.success === false) {
        throw new Error(data.error || "Failed to delete category")
      }

      setCategories(categories.filter((c) => c.id !== categoryId))
      toast({
        title: "Success",
        description: "Category deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting category:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to delete category"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const exportCategories = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "No,Name,Description,Level,Trainings,Status,Created\n" +
      categories
        .map(
          (c, index) =>
            `${index + 1},"${c.name}","${c.description}","${c.level}",${c.trainings_count},"${c.status}","${new Date(c.created_at).toLocaleDateString()}"`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "categories.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200"
      case "intermediate":
        return "bg-mustard/20 text-mustard border-mustard/30"
      case "advanced":
        return "bg-deep-purple/20 text-deep-purple border-deep-purple/30"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const openEditForm = (category: Category) => {
    setEditingCategory({ ...category })
    setShowEditForm(true)
  }

  return (
    <div className="relative space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-charcoal">Training Categories</h1>
          <p className="text-deep-purple">Manage beauty salon training categories</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={exportCategories}
            disabled={loading || categories.length === 0}
            className="border-mustard text-mustard hover:bg-mustard hover:text-ivory"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-mustard hover:bg-mustard/90 text-ivory transition-all duration-200 hover:scale-105 active:scale-95"
            disabled={submitting}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={() => {
                setError(null)
                fetchCategories()
              }}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-deep-purple" />
          <Input
            placeholder="Search categories..."
            className="pl-8 border-mustard/20 focus:border-mustard"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterLevel} onValueChange={setFilterLevel}>
          <SelectTrigger className="w-[180px] border-mustard/20 focus:border-mustard">
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent className="bg-ivory border-mustard/20">
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-mustard mx-auto mb-2" />
            <p className="text-deep-purple">Loading categories...</p>
          </div>
        </div>
      )}

      {/* Categories Table */}
      {!loading && (
        <div className="bg-ivory border border-mustard/20 rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="border-mustard/20">
                <TableHead className="text-charcoal font-semibold">No.</TableHead>
                <TableHead className="text-charcoal font-semibold">Image</TableHead>
                <TableHead className="text-charcoal font-semibold">Name</TableHead>
                <TableHead className="text-charcoal font-semibold">Description</TableHead>
                <TableHead className="text-charcoal font-semibold">Level</TableHead>
                <TableHead className="text-charcoal font-semibold">Trainings</TableHead>
                <TableHead className="text-charcoal font-semibold">Status</TableHead>
                <TableHead className="text-charcoal font-semibold">Created</TableHead>
                <TableHead className="text-charcoal font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-deep-purple">
                    {error
                      ? "Error loading categories. Please try again."
                      : "No categories found. Click 'Add Category' to create your first category."}
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category, index) => (
                  <TableRow
                    key={category.id}
                    className="border-mustard/10 hover:bg-mustard/5 transition-colors duration-200"
                  >
                    <TableCell className="font-medium text-charcoal">{index + 1}</TableCell>
                    <TableCell>
                      <div className="relative h-12 w-12">
                        <Image
                          src={category.image_url || "/placeholder.svg?height=48&width=48"}
                          alt={category.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-charcoal">{category.name}</TableCell>
                    <TableCell className="text-deep-purple max-w-xs truncate">{category.description}</TableCell>
                    <TableCell>
                      <Badge className={getLevelColor(category.level)}>{category.level}</Badge>
                    </TableCell>
                    <TableCell className="text-charcoal">{category.trainings_count || 0}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-mustard text-mustard">
                        {category.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-deep-purple">
                      {new Date(category.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditForm(category)}
                          className="border-mustard/20 text-mustard hover:bg-mustard hover:text-ivory"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create Category Form Overlay */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-ivory border border-mustard/20 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-charcoal">Create New Category</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateForm(false)}
                className="text-charcoal hover:bg-mustard/10"
                disabled={submitting}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Category Name *</label>
                <Input
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Enter category name"
                  className="border-mustard/20 focus:border-mustard"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Description *</label>
                <Textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Enter category description"
                  className="border-mustard/20 focus:border-mustard"
                  rows={3}
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Image URL</label>
                <Input
                  value={newCategory.image_url}
                  onChange={(e) => setNewCategory({ ...newCategory, image_url: e.target.value })}
                  placeholder="Enter image URL (optional)"
                  className="border-mustard/20 focus:border-mustard"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Difficulty Level</label>
                <Select
                  value={newCategory.level}
                  onValueChange={(value: "beginner" | "intermediate" | "advanced") =>
                    setNewCategory({ ...newCategory, level: value })
                  }
                  disabled={submitting}
                >
                  <SelectTrigger className="border-mustard/20 focus:border-mustard">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-ivory border-mustard/20">
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="border-mustard/20 text-charcoal hover:bg-mustard/10"
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-mustard hover:bg-mustard/90 text-ivory">
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Category"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Form Overlay */}
      {showEditForm && editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-ivory border border-mustard/20 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-charcoal">Edit Category</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditForm(false)}
                className="text-charcoal hover:bg-mustard/10"
                disabled={submitting}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleEditCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Category Name *</label>
                <Input
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="Enter category name"
                  className="border-mustard/20 focus:border-mustard"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Description *</label>
                <Textarea
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  placeholder="Enter category description"
                  className="border-mustard/20 focus:border-mustard"
                  rows={3}
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Image URL</label>
                <Input
                  value={editingCategory.image_url}
                  onChange={(e) => setEditingCategory({ ...editingCategory, image_url: e.target.value })}
                  placeholder="Enter image URL (optional)"
                  className="border-mustard/20 focus:border-mustard"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Difficulty Level</label>
                <Select
                  value={editingCategory.level}
                  onValueChange={(value: "beginner" | "intermediate" | "advanced") =>
                    setEditingCategory({ ...editingCategory, level: value })
                  }
                  disabled={submitting}
                >
                  <SelectTrigger className="border-mustard/20 focus:border-mustard">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-ivory border-mustard/20">
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Status</label>
                <Select
                  value={editingCategory.status}
                  onValueChange={(value: "active" | "inactive") =>
                    setEditingCategory({ ...editingCategory, status: value })
                  }
                  disabled={submitting}
                >
                  <SelectTrigger className="border-mustard/20 focus:border-mustard">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-ivory border-mustard/20">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditForm(false)}
                  className="border-mustard/20 text-charcoal hover:bg-mustard/10"
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-mustard hover:bg-mustard/90 text-ivory">
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    "Update Category"
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
