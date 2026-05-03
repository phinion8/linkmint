"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { auth, createUserWithEmailAndPassword, sendEmailVerification } from "@/lib/firebase";
import GoogleSignIn from "@/components/GoogleSignIn";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) { setError(data.error || "Registration failed"); return; }
      setVerificationSent(true);
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code === "auth/email-already-in-use") setError("Email already registered");
      else setError(firebaseError.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  if (verificationSent) {
    return (
      <>
        <Navbar variant="auth" />
        <main className="flex-1 flex items-center justify-center px-4 pt-28 pb-20">
          <div className="w-full max-w-sm text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#3B82F6]/10 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Check your email</h1>
            <p className="text-[#999999] text-sm mb-6">We&apos;ve sent a verification link to <span className="text-white font-medium">{email}</span></p>
            <button onClick={() => router.push("/login")} className="w-full py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-xl transition-all">
              Go to Login
            </button>
            <p className="text-[#555555] text-xs mt-4">Didn&apos;t receive it? Check your spam folder.</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar variant="auth" />
      <main className="flex-1 flex min-h-screen pt-20">
        {/* Left Panel — Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F1C] via-[#111827] to-[#0A0F1C]" />
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[#3B82F6]/[0.08] blur-[100px]" />
          <div className="absolute bottom-[-5%] left-[10%] w-[300px] h-[300px] rounded-full bg-[#3B82F6]/[0.05] blur-[80px]" />

          <div className="relative flex flex-col justify-center px-16 py-20 max-w-xl">
            <div className="flex items-center gap-2 mb-12">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-white font-bold text-lg">LinkMint</span>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
              Start earning from your very first link.
            </h2>
            <p className="text-[#999999] text-base mb-10 leading-relaxed">
              Create a free account in 10 seconds. Shorten any URL and get paid every time someone clicks it.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { value: "$1.50", label: "Per 1K views" },
                { value: "5K+", label: "Publishers" },
                { value: "1M+", label: "Clicks tracked" },
              ].map((s) => (
                <div key={s.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
                  <p className="text-white font-bold text-xl">{s.value}</p>
                  <p className="text-[#666666] text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Features list */}
            <div className="space-y-3">
              {[
                "Shorten URLs and earn per click",
                "Real-time analytics dashboard",
                "Withdraw via PayPal, bank, or crypto",
                "Telegram bot for quick shortening",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-[#3B82F6] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[#999999] text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel — Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
            <p className="text-[#999999] text-sm mb-8">Start earning from your links in seconds</p>

            {/* Google Sign In */}
            <GoogleSignIn />

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[#1A1A1A]" />
              <span className="text-[#444444] text-xs">or continue with email</span>
              <div className="flex-1 h-px bg-[#1A1A1A]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
              )}
              <div>
                <label className="block text-sm text-[#999999] mb-1.5">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name"
                  className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all" />
              </div>
              <div>
                <label className="block text-sm text-[#999999] mb-1.5">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all" />
              </div>
              <div>
                <label className="block text-sm text-[#999999] mb-1.5">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="Min 6 characters"
                  className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50">
                {loading ? "Creating account..." : "Create Account"}
              </button>

              <p className="text-[#555555] text-xs text-center">
                No credit card required. Start earning today.
              </p>
            </form>

            <p className="text-center mt-5 text-sm text-[#666666]">
              Already have an account?{" "}
              <Link href="/login" className="text-[#3B82F6] hover:text-[#2563EB] transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
