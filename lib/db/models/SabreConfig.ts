import mongoose, { Schema, Document, Model } from "mongoose"

export interface ISabreConfig extends Document {
  title: string
  titleCode: string
  currency: string
  baseUrl: string
  soapXmlEndpoint: string
  username: string
  password: string
  domain: string
  tokenVersion: string
  pcc: string
  itins: number
  ticketType: string
  queueIdNumber: string
  queueInstructionCode: string
  enableLcc: boolean
  
  agencyAddress: string
  agencyCity: string
  agencyCountryCode: string
  agencyPostalCode: string
  agencyStateCode: string
  agencyStreetNumber: string

  status: string
  postBookingStatus: string
  cronJobsStatus: string
  moduleStatus: string
  canBook: boolean
  passportRequired: boolean
  passportExpireLimitMonth: number
  domesticPassportReq: boolean
  holdShowTimeLimit: boolean
  holdTimeLimitMinutes: number

  updatedAt: Date
}

const SabreConfigSchema = new Schema<ISabreConfig>(
  {
    title: { type: String, default: "Sabre ITT Sandbox" },
    titleCode: { type: String, default: "Sabre" },
    currency: { type: String, default: "AED" },
    baseUrl: { type: String, default: "https://api.cert.platform.sabre.com" },
    soapXmlEndpoint: { type: String, default: "https://webservices.platform.sabre.com" },
    username: { type: String, default: "832405" },
    password: { type: String, default: "emquest2" },
    domain: { type: String, default: "AA" },
    tokenVersion: { type: String, default: "Version 2" },
    pcc: { type: String, default: "HE9L" },
    itins: { type: Number, default: 50 },
    ticketType: { type: String, default: "7TAW" },
    queueIdNumber: { type: String, default: "110" },
    queueInstructionCode: { type: String, default: "7" },
    enableLcc: { type: Boolean, default: false },

    agencyAddress: { type: String, default: "19-08 Prudential Tower" },
    agencyCity: { type: String, default: "Singapore" },
    agencyCountryCode: { type: String, default: "SG" },
    agencyPostalCode: { type: String, default: "49712" },
    agencyStateCode: { type: String, default: "SG" },
    agencyStreetNumber: { type: String, default: "30 Cecil Street" },

    status: { type: String, default: "Active" },
    postBookingStatus: { type: String, default: "Active" },
    cronJobsStatus: { type: String, default: "Active" },
    moduleStatus: { type: String, default: "Active" },
    canBook: { type: Boolean, default: true },
    passportRequired: { type: Boolean, default: true },
    passportExpireLimitMonth: { type: Number, default: 6 },
    domesticPassportReq: { type: Boolean, default: false },
    holdShowTimeLimit: { type: Boolean, default: true },
    holdTimeLimitMinutes: { type: Number, default: 60 },
  },
  { timestamps: true }
)

export const SabreConfig: Model<ISabreConfig> =
  mongoose.models.SabreConfig || mongoose.model<ISabreConfig>("SabreConfig", SabreConfigSchema)
