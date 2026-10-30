import { NextResponse } from "next/server"
import { getSabreCredentials, saveSabreCredentials } from "@/lib/sabre/sabre-store"
import { SabreClient } from "@/lib/sabre/sabre-client"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const current = getSabreCredentials()

    // Allow testing with either passed credentials or saved credentials
    const testCreds = {
      ...current,
      pcc: body.pcc || current.pcc,
      clientId: body.clientId || current.clientId,
      clientSecret:
        body.clientSecret && !body.clientSecret.includes("•••")
          ? body.clientSecret
          : current.clientSecret,
      environment: body.environment || current.environment,
      domain: body.domain || current.domain,
    }

    const client = new SabreClient(testCreds)
    const testResult = await client.testConnection()

    // Persist status
    saveSabreCredentials({
      status: testResult.success ? "connected" : "error",
      lastTested: new Date().toISOString(),
      lastError: testResult.success ? null : testResult.message,
    })

    return NextResponse.json({
      success: testResult.success,
      message: testResult.message,
      latencyMs: testResult.latencyMs,
      tokenExpiresIn: testResult.tokenExpiresIn,
      rawResponse: testResult.rawResponse,
      environment: testCreds.environment,
      pcc: testCreds.pcc,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: `Internal error testing Sabre: ${error.message}`,
        latencyMs: 0,
      },
      { status: 500 }
    )
  }
}
