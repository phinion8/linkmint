"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
      const fbErr = err as { code?: string; message?: string };
      if (fbErr.code === "auth/email-already-in-use") setError("Email already registered");
      else setError(fbErr.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  if (verificationSent) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="w-full max-w-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#3B82F6]/10 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
          <p className="text-[#666666] text-sm mb-6">Verification link sent to <span className="text-white">{email}</span></p>
          <button onClick={() => router.push("/login")} className="w-full py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-lg transition-colors text-sm">
            Go to Sign In
          </button>
          <p className="text-[#444444] text-xs mt-4">Check your spam folder if you don&apos;t see it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left: Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#3B82F6]/[0.06] to-[#2563EB]/[0.06] border-r border-[#1A1A1A] flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute bottom-20 -right-20 w-80 h-80 bg-[#3B82F6]/[0.08] rounded-full blur-3xl" />
        <div className="text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl">
            L
          </div>
          <h1 className="text-3xl font-bold mb-3">Start earning with <span className="text-[#3B82F6]">LinkMint.</span></h1>
          <p className="text-[#666666] max-w-sm mb-8">
            Create short links and earn revenue every time someone clicks. Free forever, payouts in 24 hours.
          </p>
          <div className="flex justify-center gap-8 text-xs text-[#555555]">
            <div className="text-center">
              <p className="text-white font-bold text-lg">$1.50</p>
              <p>Per 1K views</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">24hr</p>
              <p>Payouts</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">Free</p>
              <p>Forever</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[#666666] text-sm mb-8 hover:text-white transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            Home
          </Link>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-white font-bold text-lg">LinkMint</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Create account</h2>
          <p className="text-[#666666] text-sm mb-6">Start earning from your links today</p>

          <GoogleSignIn />

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#1A1A1A]" />
            <span className="text-[#444444] text-xs">or</span>
            <div className="flex-1 h-px bg-[#1A1A1A]" />
          </div>

          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[#666666] text-sm mb-1.5 block">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name"
                className="w-full px-4 py-3 rounded-lg bg-[#111111] border border-[#2A2A2A] text-white text-sm placeholder:text-[#444444] focus:border-[#3B82F6] focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="text-[#666666] text-sm mb-1.5 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-[#111111] border border-[#2A2A2A] text-white text-sm placeholder:text-[#444444] focus:border-[#3B82F6] focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="text-[#666666] text-sm mb-1.5 block">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="Min 6 characters"
                className="w-full px-4 py-3 rounded-lg bg-[#111111] border border-[#2A2A2A] text-white text-sm placeholder:text-[#444444] focus:border-[#3B82F6] focus:outline-none transition-colors" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg bg-[#3B82F6] text-white font-semibold text-sm hover:bg-[#2563EB] transition-colors disabled:opacity-50 mt-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/40 border-t-transparent rounded-full animate-spin mx-auto" /> : "Create Account"}
            </button>
          </form>

          <p className="text-[#666666] text-sm text-center mt-6">
            Already have an account?{" "}<Link href="/login" className="text-[#3B82F6] font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
