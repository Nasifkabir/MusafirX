import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { SabreConfig } from "@/lib/db/models/SabreConfig"
import fs from "fs"
import path from "path"

const FALLBACK_FILE = path.join(process.cwd(), "data", "sabre-config.json")

const DEFAULT_CONFIG = {
  title: "Sabre ITT Sandbox",
  titleCode: "Sabre",
  currency: "BDT",
  baseUrl: "https://api.cert.platform.sabre.com",
  soapXmlEndpoint: "https://webservices.platform.sabre.com",
  username: "832405",
  password: "emquest2",
  domain: "AA",
  tokenVersion: "Version 2",
  pcc: "HE9L",
  itins: 50,
  ticketType: "7TAW",
  queueIdNumber: "110",
  queueInstructionCode: "7",
  enableLcc: false,
  agencyAddress: "19-08 Prudential Tower",
  agencyCity: "Singapore",
  agencyCountryCode: "SG",
  agencyPostalCode: "49712",
  agencyStateCode: "SG",
  agencyStreetNumber: "30 Cecil Street",
  status: "Active",
  postBookingStatus: "Active",
  cronJobsStatus: "Active",
  moduleStatus: "Active",
  canBook: true,
  passportRequired: true,
  passportExpireLimitMonth: 6,
  domesticPassportReq: false,
  holdShowTimeLimit: true,
  holdTimeLimitMinutes: 60,
}

export async function GET() {
  try {
    const db = await connectToDatabase()
    if (db) {
      const config = await SabreConfig.findOne().lean()
      if (config) {
        return NextResponse.json({ success: true, config })
      }
    }
  } catch (err) {
    console.warn("[MongoDB] Fallback for SabreConfig:", err)
  }

  try {
    if (fs.existsSync(FALLBACK_FILE)) {
      const data = JSON.parse(fs.readFileSync(FALLBACK_FILE, "utf-8"))
      return NextResponse.json({ success: true, config: data })
    }
  } catch {}

  return NextResponse.json({ success: true, config: DEFAULT_CONFIG })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const configData = {
      ...DEFAULT_CONFIG,
      ...body,
      itins: Number(body.itins) || 50,
      passportExpireLimitMonth: Number(body.passportExpireLimitMonth) || 6,
      holdTimeLimitMinutes: Number(body.holdTimeLimitMinutes) || 60,
      updatedAt: new Date(),
    }

    try {
      const db = await connectToDatabase()
      if (db) {
        await SabreConfig.findOneAndUpdate(
          {},
          { $set: configData },
          { upsert: true, new: true }
        )
      }
    } catch (err) {
      console.warn("[MongoDB] Failed to write SabreConfig to DB, using JSON fallback:", err)
    }

    try {
      const dir = path.dirname(FALLBACK_FILE)
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(FALLBACK_FILE, JSON.stringify(configData, null, 2), "utf-8")
    } catch {}

    return NextResponse.json({
      success: true,
      message: "Sabre GDS Configuration successfully saved.",
      config: configData,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Failed to save Sabre config: ${error.message}` },
      { status: 500 }
    )
  }
}
