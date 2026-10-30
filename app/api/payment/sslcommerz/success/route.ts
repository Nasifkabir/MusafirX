import { NextRequest, NextResponse } from "next/server"
import { validateSSLCommerzTransaction } from "@/lib/payment/sslcommerz"
import { updateBookingStatus, getBookingByReference } from "@/lib/db/booking-manager"

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const ref = url.searchParams.get("ref")

    // Form data from SSLCommerz POST callback
    const formData = await req.formData()
    const valId = formData.get("val_id") as string
    const tranId = formData.get("tran_id") as string
    const amount = formData.get("amount") as string
    const cardType = formData.get("card_type") as string
    const bankTranId = formData.get("bank_tran_id") as string

    const bookingRef = ref || tranId

    let isValid = false
    let verificationDetails: any = null

    if (valId) {
      verificationDetails = await validateSSLCommerzTransaction(valId)
      isValid = verificationDetails.isValid
    } else {
      // In sandbox mode without val_id, check status
      const status = formData.get("status") as string
      isValid = status === "VALID" || status === "SUCCESS"
    }

    if (isValid || process.env.NODE_ENV === "development") {
      // Generate Sabre 13-digit E-Ticket Number
      const eTicketNumber = `077-${Math.floor(1000000000 + Math.random() * 9000000000)}`
      
      await updateBookingStatus(bookingRef, "TICKETED", {
        eTicketNumbers: [eTicketNumber],
        issuedAt: new Date(),
        paymentTransaction: {
          gateway: "SSLCommerz",
          transactionId: tranId || "TXN-DIRECT",
          valId: valId || "VAL-SANDBOX",
          bankTranId: bankTranId || "BNK-SANDBOX",
          cardType: cardType || "VISA-CityBank",
          amount: parseFloat(amount || "0"),
          currency: "BDT",
          status: "VALIDATED",
          validatedAt: new Date(),
          rawGatewayResponse: verificationDetails?.rawResponse || {},
        },
      })

      const targetUrl = new URL(`/flight/booking/confirmation`, req.url)
      targetUrl.searchParams.set("ref", bookingRef)
      targetUrl.searchParams.set("status", "success")
      return NextResponse.redirect(targetUrl, 303)
    } else {
      const targetUrl = new URL(`/flight/booking/confirmation`, req.url)
      targetUrl.searchParams.set("ref", bookingRef)
      targetUrl.searchParams.set("status", "failed")
      return NextResponse.redirect(targetUrl, 303)
    }
  } catch (err: any) {
    console.error("SSLCommerz success handler error:", err)
    return NextResponse.redirect(new URL("/?payment_error=true", req.url), 303)
  }
}
