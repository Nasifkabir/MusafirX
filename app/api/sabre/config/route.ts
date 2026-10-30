import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { SabreConfig } from "@/lib/db/models/SabreConfig"
import { getSabreCredentials, saveSabreCredentials } from "@/lib/sabre/sabre-store"

export async function GET() {
  try {
    try {
      const db = await connectToDatabase()
      if (db) {
        const config = await SabreConfig.findOne().lean()
        if (config) {
          return NextResponse.json({
            success: true,
            credentials: {
              pcc: config.pcc || "HE9L",
              clientId: config.username || "832405",
              clientSecret: config.password ? "••••••••••••" : "",
              hasSecret: Boolean(config.password && config.password.length > 0),
              domain: config.domain || "AA",
              environment: config.baseUrl?.includes("cert") ? "sandbox" : "production",
              conversationId: "MusafirX-Sandbox-Session",
              enabled: config.moduleStatus === "Active" || config.status === "Active",
              status: "connected",
              queueIdNumber: config.queueIdNumber || "110",
              queueInstructionCode: config.queueInstructionCode || "7",
              ticketType: config.ticketType || "7TAW",
            },
          })
        }
      }
    } catch {}

    const creds = getSabreCredentials()
    return NextResponse.json({
      success: true,
      credentials: {
        pcc: creds.pcc,
        clientId: creds.clientId,
        clientSecret: creds.clientSecret ? "••••••••••••" : "",
        hasSecret: Boolean(creds.clientSecret && creds.clientSecret.length > 0),
        domain: creds.domain,
        environment: creds.environment,
        conversationId: creds.conversationId,
        enabled: creds.enabled,
        status: creds.status,
        lastTested: creds.lastTested,
        lastError: creds.lastError,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const current = getSabreCredentials()

    // If clientSecret is masked or not provided, preserve existing
    const secretToSave =
      body.clientSecret && !body.clientSecret.includes("•••")
        ? body.clientSecret
        : (body.password || current.clientSecret)

    const updated = saveSabreCredentials({
      pcc: body.pcc || current.pcc,
      clientId: body.clientId || body.username || current.clientId,
      clientSecret: secretToSave,
      domain: body.domain || current.domain,
      environment: body.environment || current.environment,
      conversationId: body.conversationId || current.conversationId,
      enabled: body.enabled !== undefined ? body.enabled : current.enabled,
    })

    try {
      const db = await connectToDatabase()
      if (db) {
        await SabreConfig.findOneAndUpdate(
          {},
          {
            $set: {
              pcc: body.pcc || "HE9L",
              username: body.clientId || body.username || "832405",
              password: secretToSave,
              domain: body.domain || "AA",
              status: body.enabled ? "Active" : "Inactive",
              updatedAt: new Date(),
            },
          },
          { upsert: true }
        )
      }
    } catch {}

    return NextResponse.json({
      success: true,
      message: "Sabre credentials successfully saved.",
      credentials: {
        ...updated,
        clientSecret: updated.clientSecret ? "••••••••••••" : "",
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

