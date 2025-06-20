const { neon } = require("@neondatabase/serverless")
const fs = require("fs")
const path = require("path")

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL environment variable is required")
    process.exit(1)
  }

  const sql = neon(process.env.DATABASE_URL)

  try {
    console.log("Running database migrations...")

    // Read and execute init-db.sql
    const initSql = fs.readFileSync(path.join(__dirname, "init-db.sql"), "utf8")
    await sql(initSql)
    console.log("✓ Initial database schema created")

    // Read and execute add-booking-tables.sql
    const bookingSql = fs.readFileSync(path.join(__dirname, "add-booking-tables.sql"), "utf8")
    await sql(bookingSql)
    console.log("✓ Booking tables created")

    console.log("All migrations completed successfully!")
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }
}

runMigrations()
