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
      // 1. Check Firebase verification status
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (!userCredential.user.emailVerified) {
        setNeedsVerification(true);
        setLoading(false);
        return;
      }

      // 2. Login via Supabase (your existing auth)
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // 3. Mark as verified in Supabase if not already
      await fetch("/api/auth/verify", { method: "POST" });

      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err: unknown) {
      const firebaseError = err as { code?: string };
      if (firebaseError.code === "auth/invalid-credential" || firebaseError.code === "auth/user-not-found") {
        // User might not exist in Firebase (old users) — try normal login
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
      <main className="mesh-gradient dot-grid flex-1 flex items-center justify-center px-4 pt-28 pb-20">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-2">Welcome back</h1>
          <p className="text-[#999999] text-center mb-8">Sign in to your account to continue</p>
          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
            )}

            {needsVerification && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-amber-400 text-sm font-medium mb-2">Email not verified</p>
                <p className="text-[#999999] text-xs mb-3">Please check your email and click the verification link before logging in.</p>
                <button type="button" onClick={handleResendVerification}
                  className="text-xs text-[#3B82F6] hover:text-[#2563EB] transition-colors">
                  {resent ? "Verification email sent!" : "Resend verification email"}
                </button>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#CCCCCC] mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"
                className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#CCCCCC] mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password"
                className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50">
              {loading ? "Logging in..." : "Login"}
            </button>
            <div className="flex items-center justify-between text-sm">
              <Link href="/forgot-password" className="text-[#3B82F6] hover:text-[#2563EB] transition-colors">
                Forgot password?
              </Link>
              <Link href="/register" className="text-[#999999] hover:text-white transition-colors">
                Sign up
              </Link>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex-1 h-px bg-[#2A2A2A]" />
              <span className="text-[#555555] text-xs">or</span>
              <div className="flex-1 h-px bg-[#2A2A2A]" />
            </div>
            <GoogleSignIn />
          </form>
        </div>
      </main>
    </>
  );
}
