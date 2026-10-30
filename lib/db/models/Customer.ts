import mongoose, { Schema, Document, Model } from "mongoose"

export interface ICustomer extends Document {
  email: string
  fullName: string
  phone: string
  countryCode: string
  passwordHash?: string
  salt?: string
  nationality: string
  passportNumber?: string
  createdAt: Date
  updatedAt: Date
}

const CustomerSchema = new Schema<ICustomer>(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    countryCode: { type: String, default: "+880" },
    passwordHash: { type: String },
    salt: { type: String },
    nationality: { type: String, default: "Bangladeshi" },
    passportNumber: { type: String },
  },
  { timestamps: true }
)

export const Customer: Model<ICustomer> =
  mongoose.models.Customer || mongoose.model<ICustomer>("Customer", CustomerSchema)
