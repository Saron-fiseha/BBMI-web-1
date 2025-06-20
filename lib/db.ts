import { neon, neonConfig } from "@neondatabase/serverless"

// Configure for HTTP-only mode (works in preview environments)
neonConfig.fetchConnectionCache = true

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.warn("DATABASE_URL is not set – running in mock-DB mode (preview without external connectivity).")
}

/**
 * Use the real Neon connection when we have a DB URL,
 * otherwise fall back to an in-memory mock that always
 * returns an empty array (or fake data where required).
 */
export const sql: any = DATABASE_URL ? neon(DATABASE_URL) : createMockSQL()

function createMockSQL() {
  return async (strings: TemplateStringsArray, ..._values: any[]) => {
    // You can expand this with richer demo data if you like.
    console.log("Mock SQL query:", strings.join("?"))
    return []
  }
}

// Database health check
export async function pingDB() {
  try {
    const result = await sql`SELECT 1 as test`
    console.log("Database connection successful:", result)
    return true
  } catch (err) {
    console.error("Database connectivity check failed:", err)
    return false
  }
}

// Helper function for queries with error handling
export async function query(text: string, params?: any[]) {
  try {
    const result = await sql(text, params || [])
    return { rows: Array.isArray(result) ? result : [result] }
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}
