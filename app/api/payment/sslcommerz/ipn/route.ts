import { NextRequest, NextResponse } from "next/server"
import { validateSSLCommerzTransaction } from "@/lib/payment/sslcommerz"
import { updateBookingStatus } from "@/lib/db/booking-manager"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const valId = formData.get("val_id") as string
    const tranId = formData.get("tran_id") as string

    if (!valId) {
      return NextResponse.json({ status: "IGNORED", message: "No val_id received" }, { status: 400 })
    }

    const verification = await validateSSLCommerzTransaction(valId)
    if (verification.isValid) {
      const eTicketNumber = `077-${Math.floor(1000000000 + Math.random() * 9000000000)}`
      await updateBookingStatus(tranId, "TICKETED", {
        eTicketNumbers: [eTicketNumber],
        issuedAt: new Date(),
        "paymentTransaction.status": "VALIDATED",
        "paymentTransaction.valId": valId,
        "paymentTransaction.validatedAt": new Date(),
      })
      return NextResponse.json({ status: "SUCCESS", message: "IPN verified and booking ticketed" })
    }

    return NextResponse.json({ status: "FAILED", message: "Validation unsuccessful" })
  } catch (error: any) {
    console.error("SSLCommerz IPN error:", error)
    return NextResponse.json({ status: "ERROR", message: error.message }, { status: 500 })
  }
}
