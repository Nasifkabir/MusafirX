import { connectToDatabase } from "@/lib/db/mongodb"
import { SSLCommerzConfig } from "@/lib/db/models/SSLCommerzConfig"

export interface SSLCommerzInitParams {
  totalAmount: number
  currency: string
  tranId: string
  successUrl: string
  failUrl: string
  cancelUrl: string
  ipnUrl: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress?: string
  customerCity?: string
  productName: string
  productCategory?: string
}

export interface SSLCommerzInitResponse {
  success: boolean
  gatewayUrl?: string
  sessionKey?: string
  message?: string
  rawResponse?: any
}

// Default config from user's uploaded screenshot
const DEFAULT_STORE_CONFIG = {
  storeId: "innov6ac34e4b539ff",
  storePassword: "Fly@1234#",
  endpointBaseUrl: "https://sandbox.sslcommerz.com",
  currency: "BDT",
}

export async function getSSLCommerzConfig() {
  try {
    const db = await connectToDatabase()
    if (db) {
      const config = await SSLCommerzConfig.findOne().lean()
      if (config) {
        return {
          storeId: config.storeId || DEFAULT_STORE_CONFIG.storeId,
          storePassword: config.storePassword || DEFAULT_STORE_CONFIG.storePassword,
          endpointBaseUrl: config.endpointBaseUrl || DEFAULT_STORE_CONFIG.endpointBaseUrl,
          currency: config.gatewayCurrency || DEFAULT_STORE_CONFIG.currency,
        }
      }
    }
  } catch (e) {
    console.warn("Could not read SSLCommerz config from DB, using defaults:", e)
  }
  return DEFAULT_STORE_CONFIG
}

/**
 * Initializes a live payment session with SSLCommerz gateway
 */
export async function initSSLCommerzPayment(
  params: SSLCommerzInitParams
): Promise<SSLCommerzInitResponse> {
  const config = await getSSLCommerzConfig()
  const endpoint = `${config.endpointBaseUrl}/gwprocess/v4/api.php`

  const formData = new URLSearchParams()
  formData.append("store_id", config.storeId)
  formData.append("store_passwd", config.storePassword)
  formData.append("total_amount", params.totalAmount.toFixed(2))
  formData.append("currency", params.currency || config.currency)
  formData.append("tran_id", params.tranId)
  formData.append("success_url", params.successUrl)
  formData.append("fail_url", params.failUrl)
  formData.append("cancel_url", params.cancelUrl)
  formData.append("ipn_url", params.ipnUrl)

  // Customer Details
  formData.append("cus_name", params.customerName || "Customer")
  formData.append("cus_email", params.customerEmail || "customer@example.com")
  formData.append("cus_phone", params.customerPhone || "+8801700000000")
  formData.append("cus_add1", params.customerAddress || "Dhaka, Bangladesh")
  formData.append("cus_city", params.customerCity || "Dhaka")
  formData.append("cus_country", "Bangladesh")

  // Product Details
  formData.append("shipping_method", "NO")
  formData.append("product_name", params.productName || "MusafirX Flight Ticket")
  formData.append("product_category", params.productCategory || "Aviation")
  formData.append("product_profile", "airline-tickets")

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    const data = await response.json().catch(() => ({}))

    if (data.status === "SUCCESS" && data.GatewayPageURL) {
      return {
        success: true,
        gatewayUrl: data.GatewayPageURL,
        sessionKey: data.sessionkey,
        rawResponse: data,
      }
    } else {
      return {
        success: false,
        message: data.failedreason || "Failed to initialize SSLCommerz payment gateway.",
        rawResponse: data,
      }
    }
  } catch (error: any) {
    console.error("SSLCommerz Init Error:", error)
    return {
      success: false,
      message: `Network error connecting to SSLCommerz: ${error.message}`,
    }
  }
}

/**
 * Validates transaction via SSLCommerz Server-to-Server Validation API
 */
export async function validateSSLCommerzTransaction(valId: string) {
  const config = await getSSLCommerzConfig()
  const validateUrl = `${config.endpointBaseUrl}/validator/api/validationserverAPI.php?val_id=${encodeURIComponent(
    valId
  )}&store_id=${encodeURIComponent(config.storeId)}&store_passwd=${encodeURIComponent(
    config.storePassword
  )}&v=1&format=json`

  try {
    const response = await fetch(validateUrl, { method: "GET" })
    const data = await response.json()

    const isValid = data.status === "VALID" || data.status === "VALIDATED"
    return {
      isValid,
      status: data.status,
      tranId: data.tran_id,
      amount: parseFloat(data.amount || "0"),
      cardType: data.card_type,
      cardBrand: data.card_brand,
      bankTranId: data.bank_tran_id,
      valId: data.val_id,
      rawResponse: data,
    }
  } catch (error: any) {
    console.error("SSLCommerz Validation Error:", error)
    return {
      isValid: false,
      status: "ERROR",
      message: error.message,
    }
  }
}
