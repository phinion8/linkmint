"use client";

import { useState } from "react";

export default function ShortenForm() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [result, setResult] = useState<{ shortCode: string; shortUrl: string } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, title: title || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
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
            onChange={(e) => setUrl(e.target.value)}
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
