"use client";

import { useState, useEffect } from "react";

export default function AdBlockDetector({ children }: { children: React.ReactNode }) {
  const [adBlocked, setAdBlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function detect() {
      // Try to fetch a known ad script — ad blockers will block this
      try {
        await fetch("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", {
          method: "HEAD",
          mode: "no-cors",
          cache: "no-store",
        });
        // If fetch succeeds (even with opaque response), ads are likely allowed
        setAdBlocked(false);
      } catch {
        // Fetch blocked = ad blocker active
        setAdBlocked(true);
      }
      setChecking(false);
    }

    // Small delay to let the page render first
    setTimeout(detect, 500);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#666666] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (adBlocked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#111111] border border-[#2A2A2A] flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-white mb-3">Ad Blocker Detected</h1>

          <p className="text-[#999999] text-sm leading-relaxed mb-6">
            LinkMint is a free service supported by ads. Please disable your ad blocker to continue to your destination.
          </p>

          <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-5 mb-6 text-left">
            <p className="text-white text-sm font-medium mb-3">How to disable:</p>
            <ol className="space-y-2 text-[#999999] text-sm">
              <li className="flex items-start gap-2">
                <span className="text-[#3B82F6] font-bold">1.</span>
                Click the ad blocker icon in your browser toolbar
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#3B82F6] font-bold">2.</span>
                Disable it for this site or pause it temporarily
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#3B82F6] font-bold">3.</span>
                Refresh this page to continue
              </li>
            </ol>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-[#3B82F6] text-white font-semibold rounded-xl hover:bg-[#2563EB] transition-colors"
          >
            I&apos;ve Disabled It — Refresh
          </button>

          <p className="text-[#444444] text-xs mt-4">
            This page generates revenue for the link creator. Thank you for your support.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
