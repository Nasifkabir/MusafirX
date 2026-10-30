import fs from "fs"
import path from "path"
import type { SabreCredentials } from "./types"

const CONFIG_PATH = path.join(process.cwd(), "data", "sabre-credentials.json")

const DEFAULT_CONFIG: SabreCredentials = {
  pcc: "HE9L",
  clientId: "V1:832405:HE9L:AA",
  clientSecret: "emquest2",
  domain: "AA",
  environment: "sandbox",
  conversationId: "MusafirX-Sandbox-Session",
  enabled: true,
  status: "connected",
  lastTested: new Date().toISOString(),
  lastError: null,
  tokenExpiresAt: null,
}


export function getSabreCredentials(): SabreCredentials {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, "utf-8")
      return { ...DEFAULT_CONFIG, ...JSON.parse(data) }
    }
  } catch (error) {
    console.error("Error reading Sabre config:", error)
  }
  return DEFAULT_CONFIG
}

export function saveSabreCredentials(creds: Partial<SabreCredentials>): SabreCredentials {
  try {
    const current = getSabreCredentials()
    const updated: SabreCredentials = {
      ...current,
      ...creds,
    }

    const dir = path.dirname(CONFIG_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFileSync(CONFIG_PATH, JSON.stringify(updated, null, 2), "utf-8")
    return updated
  } catch (error) {
    console.error("Error saving Sabre config:", error)
    throw error
  }
}
