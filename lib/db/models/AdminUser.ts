import mongoose, { Schema, Document, Model } from "mongoose"

export interface IAdminUser extends Document {
  email: string
  fullName: string
  passwordHash: string
  salt: string
  role: string
  status: string
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fullName: { type: String, required: true },
    passwordHash: { type: String, required: true },
    salt: { type: String, required: true },
    role: { type: String, default: "super_admin" },
    status: { type: String, default: "active" },
    lastLogin: { type: Date },
  },
  { timestamps: true }
)

export const AdminUser: Model<IAdminUser> =
  mongoose.models.AdminUser || mongoose.model<IAdminUser>("AdminUser", AdminUserSchema)
