import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, time, name, email, service } = body

    // Mock booking logic
    const booking = {
      id: Date.now().toString(),
      date,
      time,
      name,
      email,
      service,
      status: "confirmed",
    }

    return NextResponse.json({
      success: true,
      booking,
      message: "Appointment booked successfully",
    })
  } catch (error) {
    console.error("Booking error:", error)
    return NextResponse.json({ error: "Failed to book appointment" }, { status: 500 })
  }
}
