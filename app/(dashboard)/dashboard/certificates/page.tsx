"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Download, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CertificatesPage() {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)

  // Mock certificates data
  const certificates = [
    {
      id: "cert-1",
      courseTitle: "Advanced Hair Styling Techniques",
      issueDate: "May 15, 2025",
      instructor: "Sarah Johnson",
      verificationCode: "HAIR-ADV-12345",
    },
  ]

  const handleDownload = (id: string) => {
    toast({
      title: "Certificate downloaded",
      description: "Your certificate has been downloaded successfully.",
    })
  }

  const handleShare = (id: string) => {
    navigator.clipboard.writeText(`https://glamouracademy.com/verify/${id}`)
    toast({
      title: "Verification link copied",
      description: "Certificate verification link has been copied to clipboard.",
    })
  }

  const handleGenerateCertificate = async () => {
    setIsGenerating(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast({
        title: "Certificate generated",
        description: "Your certificate has been generated successfully.",
      })
      window.location.reload()
    } catch (error) {
      toast({
        title: "Error generating certificate",
        description: "There was an error generating your certificate. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <DashboardHeader heading="My Certificates" text="View and download your earned certificates." />
      <div className="grid gap-6">
        {certificates.length > 0 ? (
          certificates.map((certificate) => (
            <Card key={certificate.id}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  {certificate.courseTitle}
                </CardTitle>
                <CardDescription>
                  Issued on {certificate.issueDate} • Instructor: {certificate.instructor}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-6 rounded-lg flex flex-col items-center justify-center">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold">Certificate of Completion</h3>
                    <p className="text-muted-foreground">This certifies that</p>
                    <p className="text-lg font-medium my-2">John Doe</p>
                    <p className="text-muted-foreground">has successfully completed</p>
                    <p className="text-lg font-medium my-2">{certificate.courseTitle}</p>
                    <p className="text-muted-foreground">on {certificate.issueDate}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">Verification Code: {certificate.verificationCode}</div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => handleShare(certificate.id)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button onClick={() => handleDownload(certificate.id)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Certificates Yet</CardTitle>
              <CardDescription>Complete a course to earn your first certificate.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Award className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-center text-muted-foreground mb-6">
                You haven't earned any certificates yet. Complete a course to receive your certificate of completion.
              </p>
              <Button onClick={handleGenerateCertificate} disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Generate Sample Certificate"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
