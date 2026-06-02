import mongoose from "mongoose";

const adminOtpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    purpose: { type: String, required: true, enum: ["cms-update", "admin-password", "admin-login"] },
    otp: { type: String, required: true },
    matchNumber: { type: String, required: true },
    isVerifiedMatch: { type: Boolean, default: false },
    otpExpire: { type: Date, required: true },
  },
  { timestamps: true }
);

const AdminOtp = mongoose.models.AdminOtp || mongoose.model("AdminOtp", adminOtpSchema);

export default AdminOtp;
