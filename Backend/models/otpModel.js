import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

export const otpModel = mongoose.model("OTP", otpSchema);
