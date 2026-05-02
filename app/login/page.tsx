"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
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

      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="mesh-gradient dot-grid flex-1 flex items-center justify-center px-4 pt-28 pb-20">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-2">Welcome back</h1>
          <p className="text-[#999999] text-center mb-8">Sign in to your account to continue</p>
          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-[#CCCCCC] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#CCCCCC] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#3B82F6]/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="text-center text-[#999999] text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#3B82F6] hover:text-[#2563EB] transition-colors">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </main>
    </>
  );
}
