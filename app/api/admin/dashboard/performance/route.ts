import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Monthly Performance Table Data
    const monthlyTableData = [
      {
        month: "January",
        newStudents: 40,
        revenue: "$24,000",
        completionRate: "94%",
        growth: "+12%",
        completionBadge: "green",
      },
      {
        month: "February",
        newStudents: 30,
        revenue: "$18,000",
        completionRate: "89%",
        growth: "-5%",
        completionBadge: "yellow",
      },
      {
        month: "March",
        newStudents: 45,
        revenue: "$27,000",
        completionRate: "96%",
        growth: "+18%",
        completionBadge: "green",
      },
      {
        month: "April",
        newStudents: 38,
        revenue: "$22,800",
        completionRate: "92%",
        growth: "+8%",
        completionBadge: "green",
      },
      {
        month: "May",
        newStudents: 42,
        revenue: "$25,200",
        completionRate: "95%",
        growth: "+15%",
        completionBadge: "green",
      },
      {
        month: "June",
        newStudents: 35,
        revenue: "$21,000",
        completionRate: "88%",
        growth: "-3%",
        completionBadge: "yellow",
      },
      {
        month: "July",
        newStudents: 48,
        revenue: "$28,800",
        completionRate: "97%",
        growth: "+22%",
        completionBadge: "green",
      },
    ]

    return NextResponse.json({
      monthlyTableData,
    })
  } catch (error) {
    console.error("Dashboard performance error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard performance data" }, { status: 500 })
  }
}
