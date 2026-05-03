"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { auth, signInWithEmailAndPassword, sendEmailVerification } from "@/lib/firebase";
import GoogleSignIn from "@/components/GoogleSignIn";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resent, setResent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setNeedsVerification(false);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        setNeedsVerification(true);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed"); return; }

      await fetch("/api/auth/verify", { method: "POST" });
      if (data.user.role === "admin") router.push("/admin");
      else router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const firebaseError = err as { code?: string };
      if (firebaseError.code === "auth/invalid-credential" || firebaseError.code === "auth/user-not-found") {
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (!res.ok) { setError(data.error || "Login failed"); return; }
          if (data.user.role === "admin") router.push("/admin");
          else router.push("/dashboard");
          router.refresh();
        } catch { setError("Network error"); }
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResendVerification() {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch { setError("Failed to resend verification email"); }
  }

  return (
    <>
      <Navbar variant="auth" />
      <main className="flex-1 flex min-h-screen pt-20">
        {/* Left Panel — Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden border-r border-[#1A1A1A]">
          <div className="absolute inset-0 bg-[#0A0A0A]" />

          <div className="relative flex flex-col justify-center px-16 py-20 max-w-xl">
            <div className="flex items-center gap-2 mb-12">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-white font-bold text-lg">LinkMint</span>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
              Earn money every time someone clicks your link.
            </h2>
            <p className="text-[#999999] text-base mb-10 leading-relaxed">
              Join thousands of publishers turning their links into a revenue stream. Free to use, instant payouts.
            </p>

            {/* Testimonial */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 mb-10">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}
              </div>
              <p className="text-[#CCCCCC] text-sm leading-relaxed mb-4">
                &ldquo;I made $340 last month just sharing links from my YouTube videos. The dashboard is clean and payouts are fast.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6] font-bold text-sm">M</div>
                <div>
                  <p className="text-white text-sm font-medium">Mike L.</p>
                  <p className="text-[#666666] text-xs">YouTuber · $340/mo</p>
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 text-xs text-[#666666]">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Fast growing
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Payouts in 24 hours
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Free forever
              </span>
            </div>
          </div>
        </div>

        {/* Right Panel — Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-end px-6 lg:px-20 py-16">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-[#999999] text-sm mb-8">Sign in to your account to continue</p>

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
              {needsVerification && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <p className="text-amber-400 text-sm font-medium mb-2">Email not verified</p>
                  <p className="text-[#999999] text-xs mb-3">Check your email and click the verification link.</p>
                  <button type="button" onClick={handleResendVerification} className="text-xs text-[#3B82F6] hover:text-[#2563EB]">
                    {resent ? "Sent!" : "Resend verification email"}
                  </button>
                </div>
              )}

              <div>
                <label className="block text-sm text-[#999999] mb-1.5">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all" />
              </div>
              <div>
                <label className="block text-sm text-[#999999] mb-1.5">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50">
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="flex items-center justify-between mt-5 text-sm">
              <Link href="/forgot-password" className="text-[#3B82F6] hover:text-[#2563EB] transition-colors">Forgot password?</Link>
              <Link href="/register" className="text-[#666666] hover:text-white transition-colors">Create account</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
