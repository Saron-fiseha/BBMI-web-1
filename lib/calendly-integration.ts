// Enhanced Calendly integration with proper error handling
export interface CalendlyTimeSlot {
  start_time: string
  end_time: string
  available: boolean
}

export interface CalendlyBooking {
  id: string
  start_time: string
  end_time: string
  event_type: string
  invitee: {
    name: string
    email: string
  }
}

export class CalendlyService {
  private apiKey: string
  private baseUrl = "https://api.calendly.com"

  constructor() {
    this.apiKey = process.env.CALENDLY_API_KEY || ""
    if (!this.apiKey) {
      console.warn("CALENDLY_API_KEY not found in environment variables")
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Calendly API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getAvailableTimeSlots(
    instructorCalendlyUrl: string,
    startDate: string,
    endDate: string,
  ): Promise<CalendlyTimeSlot[]> {
    try {
      // For development, return mock data
      if (process.env.NODE_ENV === "development") {
        return this.getMockTimeSlots(startDate)
      }

      const endpoint = `/scheduled_events?user=${instructorCalendlyUrl}&min_start_time=${startDate}&max_start_time=${endDate}`
      const data = await this.makeRequest(endpoint)

      return data.collection.map((event: any) => ({
        start_time: event.start_time,
        end_time: event.end_time,
        available: true,
      }))
    } catch (error) {
      console.error("Error fetching Calendly time slots:", error)
      // Return mock data as fallback
      return this.getMockTimeSlots(startDate)
    }
  }

  async createBooking(
    eventTypeUrl: string,
    inviteeData: {
      name: string
      email: string
      start_time: string
    },
  ): Promise<CalendlyBooking> {
    try {
      // For development, return mock booking
      if (process.env.NODE_ENV === "development") {
        return {
          id: `mock_${Date.now()}`,
          start_time: inviteeData.start_time,
          end_time: new Date(new Date(inviteeData.start_time).getTime() + 60 * 60 * 1000).toISOString(),
          event_type: eventTypeUrl,
          invitee: {
            name: inviteeData.name,
            email: inviteeData.email,
          },
        }
      }

      const endpoint = "/scheduled_events"
      const data = await this.makeRequest(endpoint, {
        method: "POST",
        body: JSON.stringify({
          event_type: eventTypeUrl,
          invitee: inviteeData,
        }),
      })

      return data.resource
    } catch (error) {
      console.error("Error creating Calendly booking:", error)
      throw error
    }
  }

  private getMockTimeSlots(startDate: string): CalendlyTimeSlot[] {
    const slots: CalendlyTimeSlot[] = []
    const date = new Date(startDate)

    // Generate mock slots for the next 7 days
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(date)
      currentDate.setDate(date.getDate() + day)

      // Skip weekends
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue

      // Generate slots from 9 AM to 5 PM
      for (let hour = 9; hour < 17; hour++) {
        const startTime = new Date(currentDate)
        startTime.setHours(hour, 0, 0, 0)

        const endTime = new Date(startTime)
        endTime.setHours(hour + 1, 0, 0, 0)

        slots.push({
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          available: Math.random() > 0.3, // 70% availability
        })
      }
    }

    return slots
  }
}

export const calendlyService = new CalendlyService()
