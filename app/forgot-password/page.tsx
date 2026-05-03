"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { auth, sendPasswordResetEmail } from "@/lib/firebase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch {
      setError("Could not send reset email. Please check your email address.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar variant="auth" />
      <main className="mesh-gradient dot-grid flex-1 flex items-center justify-center px-4 pt-28 pb-20">
        <div className="w-full max-w-md">
          {sent ? (
            <div className="glass-card p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#3B82F6]/10 flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-3">Check your email</h1>
              <p className="text-[#999999] text-sm mb-6">We&apos;ve sent a password reset link to <span className="text-white font-medium">{email}</span></p>
              <Link href="/login" className="inline-flex items-center justify-center w-full py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-xl transition-all">
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-center mb-2">Reset password</h1>
              <p className="text-[#999999] text-center mb-8">Enter your email and we&apos;ll send a reset link</p>
              <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
                )}
                <div>
                  <label className="block text-sm font-medium text-[#CCCCCC] mb-2">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50">
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
                <p className="text-center text-[#999999] text-sm">
                  <Link href="/login" className="text-[#3B82F6] hover:text-[#2563EB] transition-colors">Back to Login</Link>
                </p>
              </form>
            </>
          )}
        </div>
      </main>
    </>
  );
}
