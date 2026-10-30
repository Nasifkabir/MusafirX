import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "B2B partner distribution system has been retired in favor of direct B2C OTA operations.",
    partners: [],
    stats: { total: 0, superMasters: 0, masters: 0, agents: 0, totalCredit: 0, totalBalance: 0 },
  })
}
