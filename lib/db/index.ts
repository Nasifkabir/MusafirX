import fs from "fs"
import path from "path"
import crypto from "crypto"

export interface UserRecord {
  id: string
  email: string
  name: string
  role: "super_admin" | "admin" | "agent"
  passwordHash: string
  salt: string
  status: "active" | "suspended"
  createdAt: string
  lastLogin?: string
}

export interface SessionRecord {
  token: string
  userId: string
  userEmail: string
  userName: string
  role: string
  expiresAt: string
}

const DATA_DIR = path.join(process.cwd(), "data")
const USERS_FILE = path.join(DATA_DIR, "users.json")
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json")

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Password hashing with salt
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString("hex")
  const hash = crypto.pbkdf2Sync(password, generatedSalt, 1000, 64, "sha512").toString("hex")
  return { hash, salt: generatedSalt }
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const check = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")
  return check === hash
}

// Seed default Super Admin if not present
function initUsers(): UserRecord[] {
  ensureDir()
  if (fs.existsSync(USERS_FILE)) {
    try {
      const data = fs.readFileSync(USERS_FILE, "utf-8")
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    } catch (e) {
      console.error("Error reading users file:", e)
    }
  }

  // Create Super Admin using environment variables or fallback
  const adminEmail = process.env.ADMIN_EMAIL || "admin@musafirx.com"
  const adminPass = process.env.ADMIN_PASSWORD || "Admin@MusafirX2026"
  const { hash, salt } = hashPassword(adminPass)
  const defaultAdmin: UserRecord = {
    id: "usr-super-admin-01",
    email: adminEmail.toLowerCase(),
    name: "MusafirX Super Admin",
    role: "super_admin",
    passwordHash: hash,
    salt,
    status: "active",
    createdAt: new Date().toISOString(),
  }

  const initial = [defaultAdmin]
  fs.writeFileSync(USERS_FILE, JSON.stringify(initial, null, 2), "utf-8")
  return initial
}


export function getUsers(): UserRecord[] {
  return initUsers()
}

export function getUserByEmail(email: string): UserRecord | null {
  const users = getUsers()
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
}

export function getUserById(id: string): UserRecord | null {
  const users = getUsers()
  return users.find((u) => u.id === id) || null
}

export function updateUser(id: string, updates: Partial<UserRecord>): UserRecord | null {
  const users = getUsers()
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) return null

  users[idx] = { ...users[idx], ...updates }
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8")
  return users[idx]
}

// Session Management
export function createSession(user: UserRecord): SessionRecord {
  ensureDir()
  const token = crypto.randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days

  const session: SessionRecord = {
    token,
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    role: user.role,
    expiresAt,
  }

  let sessions: SessionRecord[] = []
  if (fs.existsSync(SESSIONS_FILE)) {
    try {
      sessions = JSON.parse(fs.readFileSync(SESSIONS_FILE, "utf-8"))
    } catch {}
  }

  // Filter expired sessions
  sessions = sessions.filter((s) => new Date(s.expiresAt) > new Date())
  sessions.push(session)
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), "utf-8")

  // Update user last login
  updateUser(user.id, { lastLogin: new Date().toISOString() })

  return session
}

export function validateSession(token: string): SessionRecord | null {
  if (!token) return null
  ensureDir()
  if (!fs.existsSync(SESSIONS_FILE)) return null

  try {
    const sessions: SessionRecord[] = JSON.parse(fs.readFileSync(SESSIONS_FILE, "utf-8"))
    const found = sessions.find((s) => s.token === token)
    if (!found) return null

    if (new Date(found.expiresAt) <= new Date()) {
      return null
    }

    return found
  } catch {
    return null
  }
}

export function destroySession(token: string): void {
  ensureDir()
  if (!fs.existsSync(SESSIONS_FILE)) return
  try {
    let sessions: SessionRecord[] = JSON.parse(fs.readFileSync(SESSIONS_FILE, "utf-8"))
    sessions = sessions.filter((s) => s.token !== token)
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), "utf-8")
  } catch {}
}
