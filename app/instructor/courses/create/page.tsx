"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, Trash2, Upload } from "lucide-react"

export default function CreateCoursePage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    level: "",
    price: "",
    duration: "",
    image: null,
    lessons: [{ title: "", description: "", videoUrl: "", duration: "" }],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCourseData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setCourseData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLessonChange = (index: number, field: string, value: string) => {
    const updatedLessons = [...courseData.lessons]
    updatedLessons[index] = { ...updatedLessons[index], [field]: value }
    setCourseData((prev) => ({ ...prev, lessons: updatedLessons }))
  }

  const addLesson = () => {
    setCourseData((prev) => ({
      ...prev,
      lessons: [...prev.lessons, { title: "", description: "", videoUrl: "", duration: "" }],
    }))
  }

  const removeLesson = (index: number) => {
    const updatedLessons = courseData.lessons.filter((_, i) => i !== index)
    setCourseData((prev) => ({ ...prev, lessons: updatedLessons }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // This would be an API call in a real application
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Course created successfully",
        description: "Your course has been created and is pending review.",
      })

      router.push("/instructor/courses")
    } catch (error) {
      toast({
        title: "Error creating course",
        description: "There was an error creating your course. Please try again.",
        variant: "destructive",
      })
      console.error("Error creating course:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextTab = () => {
    if (activeTab === "basic") setActiveTab("content")
    else if (activeTab === "content") setActiveTab("pricing")
  }

  const prevTab = () => {
    if (activeTab === "pricing") setActiveTab("content")
    else if (activeTab === "content") setActiveTab("basic")
  }

  return (
    <DashboardLayout>
      <DashboardHeader heading="Create New Course" text="Create and publish a new beauty training course." />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="content">Course Content</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardContent className="pt-6">
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Advanced Hair Styling Techniques"
                    value={courseData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Course Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Provide a detailed description of your course..."
                    value={courseData.description}
                    onChange={handleInputChange}
                    rows={5}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={courseData.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hair-styling">Hair Styling</SelectItem>
                        <SelectItem value="makeup">Makeup</SelectItem>
                        <SelectItem value="nail-care">Nail Care</SelectItem>
                        <SelectItem value="skincare">Skincare</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Select value={courseData.level} onValueChange={(value) => handleSelectChange("level", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Course Thumbnail</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">
                      Drag and drop your image here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">Recommended size: 1280x720px. Max file size: 5MB</p>
                    <Input type="file" className="hidden" accept="image/*" id="course-image" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => document.getElementById("course-image")?.click()}
                    >
                      Upload Image
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={nextTab}>
                    Next: Course Content
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Course Lessons</h3>
                  <Button type="button" onClick={addLesson} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Add Lesson
                  </Button>
                </div>

                {courseData.lessons.map((lesson, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Lesson {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLesson(index)}
                        disabled={courseData.lessons.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`lesson-title-${index}`}>Lesson Title</Label>
                      <Input
                        id={`lesson-title-${index}`}
                        value={lesson.title}
                        onChange={(e) => handleLessonChange(index, "title", e.target.value)}
                        placeholder="e.g., Introduction to Hair Styling"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`lesson-description-${index}`}>Description</Label>
                      <Textarea
                        id={`lesson-description-${index}`}
                        value={lesson.description}
                        onChange={(e) => handleLessonChange(index, "description", e.target.value)}
                        placeholder="Brief description of this lesson..."
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`lesson-video-${index}`}>Video URL</Label>
                        <Input
                          id={`lesson-video-${index}`}
                          value={lesson.videoUrl}
                          onChange={(e) => handleLessonChange(index, "videoUrl", e.target.value)}
                          placeholder="e.g., https://example.com/video.mp4"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`lesson-duration-${index}`}>Duration (minutes)</Label>
                        <Input
                          id={`lesson-duration-${index}`}
                          value={lesson.duration}
                          onChange={(e) => handleLessonChange(index, "duration", e.target.value)}
                          placeholder="e.g., 15"
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevTab}>
                    Back: Basic Information
                  </Button>
                  <Button type="button" onClick={nextTab}>
                    Next: Pricing & Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Course Price ($)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="e.g., 299"
                      value={courseData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Course Duration (weeks)</Label>
                    <Input
                      id="duration"
                      name="duration"
                      placeholder="e.g., 8"
                      value={courseData.duration}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Course Settings</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="certificate" className="rounded" />
                      <Label htmlFor="certificate">Enable certificate upon completion</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="drip" className="rounded" />
                      <Label htmlFor="drip">Enable drip content (release lessons gradually)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="reviews" className="rounded" />
                      <Label htmlFor="reviews">Allow student reviews</Label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevTab}>
                    Back: Course Content
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Course...
                      </>
                    ) : (
                      "Create Course"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
