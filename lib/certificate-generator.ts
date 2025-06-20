import { jsPDF } from "jspdf"

export async function generateCertificate(
  userName: string,
  courseName: string,
  completionDate: string,
  verificationCode: string,
) {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  })

  // Set background color
  doc.setFillColor(245, 245, 245)
  doc.rect(0, 0, 297, 210, "F")

  // Add border
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(5)
  doc.rect(10, 10, 277, 190)

  // Add header
  doc.setFont("helvetica", "bold")
  doc.setFontSize(30)
  doc.setTextColor(50, 50, 50)
  doc.text("Certificate of Completion", 148.5, 40, { align: "center" })

  // Add decorative line
  doc.setDrawColor(200, 100, 150)
  doc.setLineWidth(1)
  doc.line(74, 45, 223, 45)

  // Add content
  doc.setFont("helvetica", "normal")
  doc.setFontSize(14)
  doc.setTextColor(80, 80, 80)
  doc.text("This certifies that", 148.5, 70, { align: "center" })

  // Add name
  doc.setFont("helvetica", "bold")
  doc.setFontSize(24)
  doc.setTextColor(50, 50, 50)
  doc.text(userName, 148.5, 85, { align: "center" })

  // Add course completion text
  doc.setFont("helvetica", "normal")
  doc.setFontSize(14)
  doc.setTextColor(80, 80, 80)
  doc.text("has successfully completed", 148.5, 100, { align: "center" })

  // Add course name
  doc.setFont("helvetica", "bold")
  doc.setFontSize(20)
  doc.setTextColor(50, 50, 50)
  doc.text(courseName, 148.5, 115, { align: "center" })

  // Add completion date
  doc.setFont("helvetica", "normal")
  doc.setFontSize(14)
  doc.setTextColor(80, 80, 80)
  doc.text(`on ${completionDate}`, 148.5, 130, { align: "center" })

  // Add signature line
  doc.setDrawColor(100, 100, 100)
  doc.setLineWidth(0.5)
  doc.line(74, 155, 148, 155)

  doc.setDrawColor(100, 100, 100)
  doc.setLineWidth(0.5)
  doc.line(149, 155, 223, 155)

  // Add signature labels
  doc.setFont("helvetica", "normal")
  doc.setFontSize(12)
  doc.text("Instructor Signature", 111, 165, { align: "center" })
  doc.text("Director Signature", 186, 165, { align: "center" })

  // Add verification code
  doc.setFontSize(10)
  doc.setTextColor(120, 120, 120)
  doc.text(`Verification Code: ${verificationCode}`, 148.5, 180, { align: "center" })
  doc.text("Verify at glamouracademy.com/verify", 148.5, 185, { align: "center" })

  // Return the PDF as a blob
  return doc.output("blob")
}
