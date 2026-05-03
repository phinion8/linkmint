"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ShortenForm() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [result, setResult] = useState<{ shortCode: string; shortUrl: string } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => setIsLoggedIn(r.ok))
      .catch(() => setIsLoggedIn(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);

    // If not logged in, show signup prompt
    if (isLoggedIn === false) {
      setShowSignupPrompt(true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, title: title || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          setShowSignupPrompt(true);
          return;
        }
        setError(data.error || "Something went wrong");
        return;
      }
      setResult({
        shortCode: data.link.short_code,
        shortUrl: `${window.location.origin}/${data.link.short_code}`,
      });
      setUrl("");
      setTitle("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (result) {
      navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setShowSignupPrompt(false); }}
            placeholder="Paste your long URL here..."
            required
            className="flex-1 px-5 py-4 bg-[#111111] border border-[#2A2A2A] rounded-2xl text-white text-[15px] placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white font-semibold text-[15px] rounded-2xl hover:shadow-lg hover:shadow-[#3B82F6]/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? "Shortening..." : "Shorten URL"}
          </button>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="px-5 py-3 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white text-sm placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/20 transition-all"
        />
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Sign up prompt for non-logged-in users */}
      {showSignupPrompt && (
        <div className="mt-5 bg-[#111111] border border-[#3B82F6]/20 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">Create a free account to shorten links</h3>
          <p className="text-[#999999] text-sm mb-5">
            Sign up in 10 seconds to start shortening URLs and earning money from every click.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/register?redirect=${encodeURIComponent(url || "/dashboard")}`}
              className="inline-flex items-center justify-center bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 text-sm"
            >
              Sign Up Free
            </Link>
            <Link
              href={`/login?redirect=${encodeURIComponent(url ? "/dashboard" : "/")}`}
              className="inline-flex items-center justify-center bg-[#111111] hover:bg-[#1A1A1A] border border-[#2A2A2A] text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 text-sm"
            >
              I have an account
            </Link>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-5 glass-card-mint p-5">
          <p className="text-[#999999] text-sm mb-3">Your shortened URL is ready:</p>
          <div className="flex items-center gap-3">
            <code className="flex-1 text-[#3B82F6] font-mono text-lg break-all">
              {result.shortUrl}
            </code>
            <button
              onClick={handleCopy}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                copied
                  ? "bg-[#3B82F6]/20 text-[#3B82F6]"
                  : "border border-[#2A2A2A] bg-[#111111] text-[#CCCCCC] hover:bg-[#1A1A1A]"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
