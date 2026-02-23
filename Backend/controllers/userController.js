import { userModel } from "../models/usermodels.js";
import { otpModel } from "../models/otpModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import "dotenv/config";

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await argon2.hash(password);
    const user = await userModel.create({ name, email, password: hashedPassword });
    const token = generateToken(user);

    res.status(201).json({
      message: "Account created successfully",
      accessToken: token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await argon2.verify(user.password, password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      accessToken: token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Signin error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await otpModel.deleteMany({ email });
    await otpModel.create({ email, otp, expiresAt });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "TravelBudget - Password Reset OTP",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Reset</h2>
          <p>Your OTP code is:</p>
          <h1 style="letter-spacing: 8px; color: #1e40af;">${otp}</h1>
          <p>This code expires in 10 minutes.</p>
          <p style="color: #6b7280; font-size: 12px;">If you didn't request this, ignore this email.</p>
        </div>
      `,
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error.message);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const resetpassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const record = await otpModel.findOne({ email, otp });
    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await argon2.hash(newPassword);
    await userModel.updateOne({ email }, { password: hashedPassword });
    await otpModel.deleteMany({ email });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
