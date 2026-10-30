import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/musafirx"

interface GlobalMongoose {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
  isConnected: boolean
  lastFailedAt: number
}

let cached: GlobalMongoose = (global as any).mongooseCache || {
  conn: null,
  promise: null,
  isConnected: false,
  lastFailedAt: 0,
}

if (!(global as any).mongooseCache) {
  ;(global as any).mongooseCache = cached
}

function sanitizeMongoUri(rawUri: string): string {
  if (!rawUri) return ""
  try {
    // If it's already a valid URI, return as-is
    new URL(rawUri)
    return rawUri
  } catch {
    // Auto-encode special characters (like #, @, %, ?) in the password field
    const m = rawUri.match(/^(mongodb(?:\+srv)?:\/\/)([^:]+):(.+)@([^@]+)$/)
    if (m) {
      const proto = m[1]
      const user = m[2]
      const pass = m[3]
      const hostAndRest = m[4]
      return `${proto}${user}:${encodeURIComponent(pass)}@${hostAndRest}`
    }
    return rawUri
  }
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (cached.conn && cached.isConnected) {
    return cached.conn
  }

  const rawUri = process.env.MONGODB_URI || "mongodb://localhost:27017/musafirx"
  const sanitizedUri = sanitizeMongoUri(rawUri)

  // Check if user is using an unconfigured placeholder URI
  if (sanitizedUri.includes(".xxxxx.") || sanitizedUri.includes("<password>") || sanitizedUri.includes("<username>")) {
    const now = Date.now()
    if (!cached.lastFailedAt || now - cached.lastFailedAt > 60000) {
      console.warn(
        `[MongoDB] Notice: Your .env.local contains a placeholder ('xxxxx' or '<password>'). Please replace it with your real cluster address from MongoDB Atlas. Running in local fallback mode.`
      )
      cached.lastFailedAt = now
    }
    return null
  }

  // If a connection failed recently (within 30s), use instant fallback to avoid stalling requests
  const now = Date.now()
  if (cached.lastFailedAt && now - cached.lastFailedAt < 30000) {
    return null
  }

  if (!cached.promise) {
    const isLocal = sanitizedUri.includes("localhost") || sanitizedUri.includes("127.0.0.1")
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: isLocal ? 1200 : 5000,
      connectTimeoutMS: isLocal ? 1200 : 5000,
    }

    cached.promise = mongoose
      .connect(sanitizedUri, opts)
      .then((m) => {
        cached.isConnected = true
        cached.lastFailedAt = 0
        console.log("[MongoDB] Connected successfully to:", sanitizedUri.replace(/:([^:@]+)@/, ":****@"))
        return m
      })
      .catch((err) => {
        cached.lastFailedAt = Date.now()
        cached.promise = null
        cached.isConnected = false
        console.warn(
          `[MongoDB] Warning: Could not connect to MongoDB (${err.message}). MusafirX is running on resilient local JSON fallback storage.`
        )
        return null as any
      })
  }


  try {
    cached.conn = await cached.promise
    if (cached.conn) {
      cached.isConnected = true
    }
  } catch (e) {
    cached.promise = null
    cached.isConnected = false
    cached.lastFailedAt = Date.now()
  }

  return cached.conn
}

export function isDbConnected(): boolean {
  return cached.isConnected && mongoose.connection.readyState === 1
}

