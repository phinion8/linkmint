"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from "@/lib/firebase";
import GoogleSignIn from "@/components/GoogleSignIn";

type AuthState = "sign_in" | "forgot_password";

export default function LoginPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resent, setResent] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (authState === "forgot_password") {
      try {
        await sendPasswordResetEmail(auth, email);
        setResetSent(true);
      } catch { setError("Could not send reset email."); }
      setLoading(false);
      return;
    }

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
      router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const fbErr = err as { code?: string };
      if (fbErr.code === "auth/invalid-credential" || fbErr.code === "auth/user-not-found") {
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (!res.ok) { setError(data.error || "Login failed"); return; }
          router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
          router.refresh();
        } catch { setError("Network error"); }
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    try {
      const uc = await signInWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(uc.user);
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch { setError("Failed to resend"); }
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left: Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#3B82F6]/[0.06] to-[#2563EB]/[0.06] border-r border-[#1A1A1A] flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute top-20 -left-20 w-80 h-80 bg-[#3B82F6]/[0.08] rounded-full blur-3xl" />
        <div className="text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl">
            L
          </div>
          <h1 className="text-3xl font-bold mb-3">Welcome to <span className="text-[#3B82F6]">LinkPearl.</span></h1>
          <p className="text-[#666666] max-w-sm">
            Shorten URLs, earn money on every click, and grow your revenue with the modern link monetization platform.
          </p>
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
            <span className="text-white font-bold text-lg">LinkPearl</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">
            {authState === "sign_in" && "Sign in"}
            {authState === "forgot_password" && "Reset password"}
          </h2>
          <p className="text-[#666666] text-sm mb-6">
            {authState === "sign_in" && "Welcome back to LinkPearl."}
            {authState === "forgot_password" && "We'll send you a reset link"}
          </p>

          {authState === "sign_in" && !resetSent && (
            <>
              <GoogleSignIn />
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-[#1A1A1A]" />
                <span className="text-[#444444] text-xs">or</span>
                <div className="flex-1 h-px bg-[#1A1A1A]" />
              </div>
            </>
          )}

          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm mb-4">{error}</div>}

          {needsVerification && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg mb-4">
              <p className="text-amber-400 text-sm font-medium mb-2">Email not verified</p>
              <p className="text-[#999999] text-xs mb-3">Check your email and click the verification link.</p>
              <button type="button" onClick={handleResend} className="text-xs text-[#3B82F6] hover:underline">
                {resent ? "Sent!" : "Resend verification email"}
              </button>
            </div>
          )}

          {resetSent ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <p className="text-white font-medium mb-1">Check your email</p>
              <p className="text-[#666666] text-sm mb-4">Reset link sent to {email}</p>
              <button onClick={() => { setAuthState("sign_in"); setResetSent(false); }} className="text-[#3B82F6] text-sm hover:underline">← Back to sign in</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[#666666] text-sm mb-1.5 block">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-[#111111] border border-[#2A2A2A] text-white text-sm placeholder:text-[#444444] focus:border-[#3B82F6] focus:outline-none transition-colors" />
              </div>

              {authState === "sign_in" && (
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-[#666666] text-sm">Password</label>
                    <button type="button" onClick={() => setAuthState("forgot_password")} className="text-[#3B82F6] text-xs font-medium hover:underline">
                      Forgot password?
                    </button>
                  </div>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg bg-[#111111] border border-[#2A2A2A] text-white text-sm placeholder:text-[#444444] focus:border-[#3B82F6] focus:outline-none transition-colors" />
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-lg bg-[#3B82F6] text-white font-semibold text-sm hover:bg-[#2563EB] transition-colors disabled:opacity-50 mt-2">
                {loading ? <div className="w-5 h-5 border-2 border-white/40 border-t-transparent rounded-full animate-spin mx-auto" />
                  : authState === "forgot_password" ? "Send Reset Link" : "Sign In"}
              </button>
            </form>
          )}

          {!resetSent && (
            <p className="text-[#666666] text-sm text-center mt-6">
              {authState === "sign_in" ? (
                <>Don&apos;t have an account?{" "}<Link href="/register" className="text-[#3B82F6] font-medium hover:underline">Sign up</Link></>
              ) : (
                <button onClick={() => setAuthState("sign_in")} className="text-[#3B82F6] font-medium hover:underline">← Back to sign in</button>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
