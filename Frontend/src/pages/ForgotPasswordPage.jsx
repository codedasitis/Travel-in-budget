import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, KeyRound, Lock, ArrowLeft } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import api from "../utils/api";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1=email, 2=otp+new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await api.post("/forgot-password", { email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true); setError("");
    try {
      await api.post("/reset-password", { email, otp, newPassword });
      setSuccess("Password reset! You can now sign in.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset password" subtitle="We'll send a one-time code to your email">
      {success ? (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRound size={28} className="text-green-600" />
          </div>
          <p className="text-green-700 font-medium mb-2">{success}</p>
          <Link to="/login" className="text-ocean-600 hover:underline font-medium">Back to sign in →</Link>
        </div>
      ) : step === 1 ? (
        <form onSubmit={sendOtp} className="space-y-5">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 border border-sand-200 rounded-xl bg-white text-sm focus:border-ocean-400 transition-colors" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-ocean-600 text-white py-3 rounded-xl font-medium hover:bg-ocean-700 disabled:opacity-60 transition-colors">
            {loading ? "Sending..." : "Send OTP"}
          </button>
          <Link to="/login" className="flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft size={14} /> Back to sign in
          </Link>
        </form>
      ) : (
        <form onSubmit={resetPassword} className="space-y-5">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
          <div className="bg-ocean-50 border border-ocean-100 text-ocean-700 text-sm rounded-lg px-4 py-3">
            OTP sent to <strong>{email}</strong>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">OTP Code</label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit code" maxLength={6}
                className="w-full pl-10 pr-4 py-3 border border-sand-200 rounded-xl bg-white text-sm font-mono tracking-widest focus:border-ocean-400 transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 8 characters"
                className="w-full pl-10 pr-4 py-3 border border-sand-200 rounded-xl bg-white text-sm focus:border-ocean-400 transition-colors" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-ocean-600 text-white py-3 rounded-xl font-medium hover:bg-ocean-700 disabled:opacity-60 transition-colors">
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
