"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, subject, message }),
    });
    if (res.ok) setSent(true);
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-3">Support</h1>
          <p className="text-[#999999] mb-8">Have a question or need help? Reach out to us.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-5">Send a Message</h2>
              {sent ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold mb-1">Message sent!</p>
                  <p className="text-[#999999] text-sm">We&apos;ll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#999999] mb-1">Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                      className="w-full px-4 py-2.5 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all"
                      placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm text-[#999999] mb-1">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                      className="w-full px-4 py-2.5 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all"
                      placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm text-[#999999] mb-1">Subject</label>
                    <select value={subject} onChange={(e) => setSubject(e.target.value)} required
                      className="w-full px-4 py-2.5 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all">
                      <option value="" className="bg-[#111111]">Select a topic</option>
                      <option value="account" className="bg-[#111111]">Account Issue</option>
                      <option value="payout" className="bg-[#111111]">Payout / Earnings</option>
                      <option value="links" className="bg-[#111111]">Links / Shortening</option>
                      <option value="ads" className="bg-[#111111]">Ads / Monetization</option>
                      <option value="bug" className="bg-[#111111]">Bug Report</option>
                      <option value="other" className="bg-[#111111]">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[#999999] mb-1">Message</label>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={4}
                      className="w-full px-4 py-2.5 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all resize-none"
                      placeholder="Describe your issue..." />
                  </div>
                  <button type="submit"
                    className="w-full py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-xl transition-all duration-200">
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* FAQ & Info */}
            <div className="space-y-5">
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Quick Answers</h2>
                <div className="space-y-4">
                  {[
                    { q: "How do I earn money?", a: "Create short links, share them, and earn revenue for every visitor who completes the ad steps." },
                    { q: "When can I withdraw?", a: "You can request a payout once your balance reaches the minimum threshold shown in your dashboard." },
                    { q: "Why are my earnings low?", a: "Earnings depend on traffic geography. Tier 1 countries (US, UK, DE) pay significantly more than Tier 3." },
                    { q: "Can I use LinkPearl with ad blockers?", a: "Visitors need to disable ad blockers to proceed through shortened links. This ensures ad revenue is generated." },
                  ].map((faq) => (
                    <div key={faq.q}>
                      <p className="text-white text-sm font-medium mb-1">{faq.q}</p>
                      <p className="text-[#999999] text-xs leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-white mb-3">Other Ways to Reach Us</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-[#999999]">
                    <svg className="w-4 h-4 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Telegram: @linkpearl_bot
                  </div>
                  <div className="flex items-center gap-3 text-[#999999]">
                    <svg className="w-4 h-4 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    support@linkpearl.vercel.app
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
