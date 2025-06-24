"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { InstructorLayout } from "@/components/instructor/instructor-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, MapPin, Calendar, Camera, Save, Edit } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface InstructorProfile {
  id: string
  name: string
  email: string
  phone?: string
  bio?: string
  location?: string
  profile_picture?: string
  specialties: string[]
  experience_years: number
  certifications: string[]
  social_links: {
    website?: string
    instagram?: string
    linkedin?: string
  }
  joined_date: string
  total_students: number
  total_courses: number
  average_rating: number
}

export default function InstructorProfile() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<InstructorProfile | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    specialties: "",
    experience_years: 0,
    certifications: "",
    website: "",
    instagram: "",
    linkedin: "",
  })

  useEffect(() => {
    if (!loading && (!user || user.role !== "instructor")) {
      router.push(user ? "/dashboard" : "/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && user.role === "instructor") {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      setLoadingData(true)
      const response = await fetch("/api/instructor/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
          location: data.location || "",
          specialties: data.specialties?.join(", ") || "",
          experience_years: data.experience_years || 0,
          certifications: data.certifications?.join(", ") || "",
          website: data.social_links?.website || "",
          instagram: data.social_links?.instagram || "",
          linkedin: data.social_links?.linkedin || "",
        })
      } else {
        // Mock data fallback
        const mockProfile = {
          id: String(user?.id || "1"),
          name: user?.full_name || "Betty Smith",
          email: user?.email || "betty@brushedbybetty.com",
          phone: "+1 (555) 123-4567",
          bio: "Professional makeup artist and hair stylist with over 10 years of experience. Passionate about teaching and helping others discover their beauty potential.",
          location: "Los Angeles, CA",
          profile_picture: "/placeholder.svg?height=120&width=120",
          specialties: ["Hair Styling", "Makeup Artistry", "Bridal Beauty", "Color Theory"],
          experience_years: 10,
          certifications: ["Certified Makeup Artist", "Advanced Hair Styling Certificate", "Bridal Beauty Specialist"],
          social_links: {
            website: "https://brushedbybetty.com",
            instagram: "@brushedbybetty",
            linkedin: "betty-smith-mua",
          },
          joined_date: "2023-01-15",
          total_students: 1247,
          total_courses: 5,
          average_rating: 4.9,
        }
        setProfile(mockProfile)
        setFormData({
          name: mockProfile.name,
          email: mockProfile.email,
          phone: mockProfile.phone || "",
          bio: mockProfile.bio || "",
          location: mockProfile.location || "",
          specialties: mockProfile.specialties.join(", "),
          experience_years: mockProfile.experience_years,
          certifications: mockProfile.certifications.join(", "),
          website: mockProfile.social_links.website || "",
          instagram: mockProfile.social_links.instagram || "",
          linkedin: mockProfile.social_links.linkedin || "",
        })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingData(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/instructor/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
          specialties: formData.specialties
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          certifications: formData.certifications
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          social_links: {
            website: formData.website,
            instagram: formData.instagram,
            linkedin: formData.linkedin,
          },
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        })
        setIsEditing(false)
        fetchProfile()
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading || !user || user.role !== "instructor") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (loadingData) {
    return (
      <InstructorLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <Card>
            <CardContent className="p-6 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </InstructorLayout>
    )
  }

  return (
    <InstructorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your instructor profile and preferences</p>
          </div>
          <Button
            onClick={() => {
              if (isEditing) {
                handleSave()
              } else {
                setIsEditing(true)
              }
            }}
            disabled={saving}
          >
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Overview */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile?.profile_picture || "/placeholder.svg"} alt={profile?.name} />
                    <AvatarFallback className="bg-gradient-to-r from-amber-400 to-amber-600 text-white text-2xl">
                      {profile?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{profile?.name}</h3>
                  <p className="text-muted-foreground">{profile?.email}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Students</span>
                  <Badge variant="secondary">{profile?.total_students}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Courses</span>
                  <Badge variant="secondary">{profile?.total_courses}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average Rating</span>
                  <Badge variant="secondary">{profile?.average_rating}/5</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Experience</span>
                  <Badge variant="secondary">{profile?.experience_years} years</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                {isEditing ? "Update your profile information" : "Your current profile information"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{profile?.name}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{profile?.email}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{profile?.phone || "Not provided"}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profile?.location || "Not provided"}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell students about yourself..."
                    className="min-h-[100px]"
                  />
                ) : (
                  <p className="text-sm">{profile?.bio || "No bio provided"}</p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="specialties">Specialties</Label>
                  {isEditing ? (
                    <Input
                      id="specialties"
                      value={formData.specialties}
                      onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                      placeholder="Hair Styling, Makeup, etc. (comma separated)"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {profile?.specialties?.map((specialty, index) => (
                        <Badge key={index} variant="outline">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  {isEditing ? (
                    <Input
                      id="experience"
                      type="number"
                      value={formData.experience_years}
                      onChange={(e) => setFormData({ ...formData, experience_years: Number.parseInt(e.target.value) })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{profile?.experience_years} years</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications</Label>
                {isEditing ? (
                  <Input
                    id="certifications"
                    value={formData.certifications}
                    onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                    placeholder="Certification 1, Certification 2, etc. (comma separated)"
                  />
                ) : (
                  <div className="space-y-1">
                    {profile?.certifications?.map((cert, index) => (
                      <div key={index} className="text-sm">
                        • {cert}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Social Links</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    {isEditing ? (
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://yourwebsite.com"
                      />
                    ) : (
                      <span className="text-sm">{profile?.social_links?.website || "Not provided"}</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    {isEditing ? (
                      <Input
                        id="instagram"
                        value={formData.instagram}
                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        placeholder="@username"
                      />
                    ) : (
                      <span className="text-sm">{profile?.social_links?.instagram || "Not provided"}</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    {isEditing ? (
                      <Input
                        id="linkedin"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        placeholder="username"
                      />
                    ) : (
                      <span className="text-sm">{profile?.social_links?.linkedin || "Not provided"}</span>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </InstructorLayout>
  )
}
