import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { SSLCommerzConfig } from "@/lib/db/models/SSLCommerzConfig"

export async function GET() {
  try {
    const db = await connectToDatabase()
    if (db) {
      const config = await SSLCommerzConfig.findOne().lean()
      if (config) {
        return NextResponse.json({ success: true, config })
      }
    }
  } catch {}

  return NextResponse.json({
    success: true,
    config: {
      gatewayTitle: "SSLCommerz",
      gatewayStatus: "Active",
      gatewayCurrency: "BDT",
      chargeCurrency: "BDT",
      endpointBaseUrl: "https://sandbox.sslcommerz.com",
      storeId: "innov6ac34e4b539ff",
      storePassword: "Fly@1234#",
      minAcceptAmount: 1.0,
      maxAcceptAmount: 99999999.0,
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const db = await connectToDatabase()

    if (db) {
      await SSLCommerzConfig.findOneAndUpdate(
        {},
        {
          $set: {
            ...body,
            minAcceptAmount: parseFloat(body.minAcceptAmount || "1"),
            maxAcceptAmount: parseFloat(body.maxAcceptAmount || "99999999"),
            fixedCharge: parseFloat(body.fixedCharge || "0"),
            chargeRatio: parseFloat(body.chargeRatio || "0"),
            updatedAt: new Date(),
          },
        },
        { upsert: true, new: true }
      )
    }

    return NextResponse.json({
      success: true,
      message: "SSLCommerz gateway configuration saved successfully.",
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Failed to save SSLCommerz config: ${error.message}` },
      { status: 500 }
    )
  }
}
