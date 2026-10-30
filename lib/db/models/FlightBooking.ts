import mongoose, { Schema, Document, Model } from "mongoose"

export interface IPassenger {
  passengerType: "adult" | "child" | "infant"
  title: "Mr" | "Mrs" | "Ms" | "Mstr"
  firstName: string
  lastName: string
  gender: "Male" | "Female" | "Other"
  dateOfBirth: Date
  nationality: string
  passportNumber?: string
  passportExpiry?: Date
  nidNumber?: string
}

export interface IPaymentTransaction {
  gateway: "SSLCommerz"
  transactionId: string
  valId?: string
  bankTranId?: string
  cardType?: string
  amount: number
  currency: string
  status: "INITIATED" | "VALIDATED" | "FAILED" | "CANCELLED"
  validatedAt?: Date
  rawGatewayResponse?: any
}

export interface IFlightBooking extends Document {
  bookingReference: string
  pnr?: string
  customerId?: mongoose.Types.ObjectId
  
  contactEmail: string
  contactPhone: string
  contactName: string

  tripType: "one-way" | "round-trip" | "multi-city"
  originCode: string
  originCity: string
  destinationCode: string
  destinationCity: string
  departureDate: Date
  returnDate?: Date
  airlineName: string
  airlineCode: string
  flightNumber: string
  cabinClass: string
  flightSnapshot: any

  baseFare: number
  taxesAndFees: number
  totalAmount: number
  currency: string

  status: "PENDING" | "HELD" | "TICKETED" | "EXPIRED" | "CANCELLED"
  bookingType: "HOLD_PAY_LATER" | "INSTANT_PAY"
  
  holdExpiresAt?: Date
  eTicketNumbers?: string[]
  issuedAt?: Date

  paymentTransaction?: IPaymentTransaction
  passengers: IPassenger[]
  createdAt: Date
  updatedAt: Date
}

const FlightBookingSchema = new Schema<IFlightBooking>(
  {
    bookingReference: { type: String, required: true, unique: true, index: true },
    pnr: { type: String, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", index: true },
    contactEmail: { type: String, required: true, index: true },
    contactPhone: { type: String, required: true },
    contactName: { type: String, required: true },

    tripType: { type: String, enum: ["one-way", "round-trip", "multi-city"], required: true },
    originCode: { type: String, required: true },
    originCity: { type: String, required: true },
    destinationCode: { type: String, required: true },
    destinationCity: { type: String, required: true },
    departureDate: { type: Date, required: true },
    returnDate: { type: Date },
    airlineName: { type: String, required: true },
    airlineCode: { type: String, required: true },
    flightNumber: { type: String, required: true },
    cabinClass: { type: String, default: "Economy" },
    flightSnapshot: { type: Schema.Types.Mixed, required: true },

    baseFare: { type: Number, required: true },
    taxesAndFees: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: "BDT" },

    status: {
      type: String,
      enum: ["PENDING", "HELD", "TICKETED", "EXPIRED", "CANCELLED"],
      default: "PENDING",
      index: true,
    },
    bookingType: { type: String, enum: ["HOLD_PAY_LATER", "INSTANT_PAY"], required: true },

    holdExpiresAt: { type: Date, index: true },
    eTicketNumbers: [{ type: String }],
    issuedAt: { type: Date },

    paymentTransaction: {
      gateway: { type: String, default: "SSLCommerz" },
      transactionId: { type: String, index: true },
      valId: { type: String },
      bankTranId: { type: String },
      cardType: { type: String },
      amount: { type: Number },
      currency: { type: String, default: "BDT" },
      status: { type: String, default: "INITIATED" },
      validatedAt: { type: Date },
      rawGatewayResponse: { type: Schema.Types.Mixed },
    },

    passengers: [
      {
        passengerType: { type: String, enum: ["adult", "child", "infant"], required: true },
        title: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        gender: { type: String, required: true },
        dateOfBirth: { type: Date, required: true },
        nationality: { type: String, default: "Bangladeshi" },
        passportNumber: { type: String },
        passportExpiry: { type: Date },
        nidNumber: { type: String },
      },
    ],
  },
  { timestamps: true }
)

FlightBookingSchema.index({ status: 1, holdExpiresAt: 1 })
FlightBookingSchema.index({ createdAt: -1 })

export const FlightBooking: Model<IFlightBooking> =
  mongoose.models.FlightBooking || mongoose.model<IFlightBooking>("FlightBooking", FlightBookingSchema)
