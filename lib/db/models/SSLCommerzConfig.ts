import mongoose, { Schema, Document, Model } from "mongoose"

export interface ISSLCommerzConfig extends Document {
  gatewayTitle: string
  gatewayStatus: string
  gatewayCurrency: string
  chargeCurrency: string
  notificationEmail?: string
  endpointBaseUrl: string
  storeId: string
  storePassword: string
  isMfs: boolean
  minAcceptAmount: number
  maxAcceptAmount: number
  fixedCharge: number
  chargeRatio: number
  instructionNotes?: string
  updatedAt: Date
}

const SSLCommerzConfigSchema = new Schema<ISSLCommerzConfig>(
  {
    gatewayTitle: { type: String, default: "SSLCommerz" },
    gatewayStatus: { type: String, default: "Active" },
    gatewayCurrency: { type: String, default: "BDT" },
    chargeCurrency: { type: String, default: "BDT" },
    notificationEmail: { type: String, default: "" },
    endpointBaseUrl: { type: String, default: "https://sandbox.sslcommerz.com" },
    storeId: { type: String, default: "innov6ac34e4b539ff" },
    storePassword: { type: String, default: "Fly@1234#" },
    isMfs: { type: Boolean, default: false },
    minAcceptAmount: { type: Number, default: 1.0 },
    maxAcceptAmount: { type: Number, default: 99999999.0 },
    fixedCharge: { type: Number, default: 0.0 },
    chargeRatio: { type: Number, default: 0.0 },
    instructionNotes: { type: String, default: "" },
  },
  { timestamps: true }
)

export const SSLCommerzConfig: Model<ISSLCommerzConfig> =
  mongoose.models.SSLCommerzConfig ||
  mongoose.model<ISSLCommerzConfig>("SSLCommerzConfig", SSLCommerzConfigSchema)
