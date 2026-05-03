"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ShortenForm from "@/components/ShortenForm";
import LinkTable from "@/components/LinkTable";
import { formatDate } from "@/lib/utils";

interface LinkItem {
  id: string;
  short_code: string;
  original_url: string;
  title: string | null;
  is_active: boolean;
  total_clicks: number;
  created_at: string;
}

interface WalletData {
  balance: number;
  total_earned: number;
  total_withdrawn: number;
  min_payout: number;
}

interface EarningItem {
  id: string;
  amount: number;
  cpm_rate: number;
  created_at: string;
  links: { short_code: string; title: string | null } | null;
}

interface PayoutItem {
  id: string;
  amount: number;
  status: string;
  payout_method: string | null;
  payout_details: string | null;
  admin_note: string | null;
  processed_at: string | null;
  created_at: string;
}

type Tab = "overview" | "earnings" | "payouts" | "links" | "support";

interface TicketItem {
  id: string;
  subject: string;
  message: string;
  status: string;
  admin_reply: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [cpmRate, setCpmRate] = useState(0);
  const [earnings, setEarnings] = useState<EarningItem[]>([]);
  const [payouts, setPayouts] = useState<PayoutItem[]>([]);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("");
  const [payoutDetails, setPayoutDetails] = useState("");
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutMsg, setPayoutMsg] = useState("");
  const [payoutError, setPayoutError] = useState("");
  const [showPayoutForm, setShowPayoutForm] = useState(false);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSending, setTicketSending] = useState(false);
  const [ticketSent, setTicketSent] = useState("");

  const fetchLinks = useCallback(async () => {
    const res = await fetch("/api/links");
    if (res.status === 401) {
      router.push("/login");
      return;
    }
    const data = await res.json();
    setLinks(data.links || []);
    setLoading(false);
  }, [router]);

  const fetchWallet = useCallback(async () => {
    const res = await fetch("/api/wallet");
    if (res.ok) {
      const data = await res.json();
      setWallet(data.wallet);
      setCpmRate(data.cpm_rate);
      setEarnings(data.earnings || []);
      setPayouts(data.payouts || []);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
    fetchWallet();
    fetch("/api/support").then(r => r.ok ? r.json() : null).then(d => { if (d?.tickets) setTickets(d.tickets); });
  }, [fetchLinks, fetchWallet]);

  async function handleToggle(id: string, active: boolean) {
    await fetch(`/api/links/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: active }),
    });
    fetchLinks();
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this link?")) return;
    await fetch(`/api/links/${id}`, { method: "DELETE" });
    fetchLinks();
  }

  async function handlePayout(e: React.FormEvent) {
    e.preventDefault();
    setPayoutLoading(true);
    setPayoutError("");
    setPayoutMsg("");

    const res = await fetch("/api/wallet/payout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: parseFloat(payoutAmount),
        payout_method: payoutMethod,
        payout_details: payoutDetails,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setPayoutError(data.error || "Payout request failed");
    } else {
      setPayoutMsg("Payout request submitted successfully!");
      setPayoutAmount("");
      setPayoutMethod("");
      setPayoutDetails("");
      setShowPayoutForm(false);
      fetchWallet();
    }
    setPayoutLoading(false);
  }

  const totalClicks = links.reduce((sum, l) => sum + l.total_clicks, 0);

  const statusColors: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-400",
    approved: "bg-blue-500/10 text-blue-400",
    paid: "bg-emerald-500/10 text-emerald-400",
    rejected: "bg-red-500/10 text-red-400",
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    {
      key: "overview",
      label: "Overview",
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />,
    },
    {
      key: "earnings",
      label: "Earnings",
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    },
    {
      key: "payouts",
      label: "Payouts",
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />,
    },
    {
      key: "links",
      label: "My Links",
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />,
    },
    {
      key: "support" as Tab,
      label: "Support",
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-[#999999] mt-1">Manage your links, earnings, and payouts</p>
      </div>

      {/* Wallet Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-card-accent p-4 sm:p-6">
          <p className="text-xs text-[#999999] mb-1">Balance</p>
          <p className="text-xl sm:text-3xl font-bold tabular-nums text-[#3B82F6]">
            ${wallet ? Number(wallet.balance).toFixed(2) : "0.00"}
          </p>
          {wallet && wallet.balance >= wallet.min_payout && (
            <button
              onClick={() => { setActiveTab("payouts"); setShowPayoutForm(true); }}
              className="mt-3 text-xs bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white px-3 py-1.5 rounded-lg hover:shadow-lg hover:shadow-[#3B82F6]/25 transition-all"
            >
              Withdraw
            </button>
          )}
        </div>
        <div className="glass-card p-4 sm:p-6">
          <p className="text-xs text-[#999999] mb-1">Earned</p>
          <p className="text-xl sm:text-3xl font-bold tabular-nums text-emerald-400">
            ${wallet ? Number(wallet.total_earned).toFixed(2) : "0.00"}
          </p>
          <p className="text-[10px] text-[#666666] mt-1 hidden sm:block">Lifetime</p>
        </div>
        <div className="glass-card p-4 sm:p-6">
          <p className="text-xs text-[#999999] mb-1">Clicks</p>
          <p className="text-xl sm:text-3xl font-bold tabular-nums text-blue-400">{totalClicks}</p>
          <p className="text-[10px] text-[#666666] mt-1 hidden sm:block">{links.length} links</p>
        </div>
        <div className="glass-card p-4 sm:p-6">
          <p className="text-xs text-[#999999] mb-1">CPM</p>
          <p className="text-xl sm:text-3xl font-bold tabular-nums text-amber-400">
            ${cpmRate ? Number(cpmRate).toFixed(2) : "0.00"}
          </p>
          <p className="text-[10px] text-[#666666] mt-1 hidden sm:block">Per 1K views</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-1 glass-card p-1.5 w-fit min-w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-[#3B82F6] text-white"
                  : "text-[#999999] hover:text-white hover:bg-[#111111]"
              }`}
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                {tab.icon}
              </svg>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(" ").pop()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ===== OVERVIEW TAB ===== */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Earnings Info */}
          <div className="glass-card p-5 flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-[#999999]">
              <svg className="w-4 h-4 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Earn <span className="text-amber-400 font-semibold">${cpmRate ? Number(cpmRate).toFixed(2) : "0.00"}</span> per 1,000 completed ad impressions
            </div>
            <span className="text-[#444444]">|</span>
            <span className="text-[#999999]">Min payout: <span className="text-white font-medium">${wallet?.min_payout || 5}</span></span>
            <span className="text-[#444444]">|</span>
            <span className="text-[#999999]">Withdrawn: <span className="text-white font-medium">${wallet ? Number(wallet.total_withdrawn).toFixed(2) : "0.00"}</span></span>
          </div>

          {/* Shorten form */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Create New Short Link</h2>
            <ShortenForm />
          </div>

          {/* Recent Earnings */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Recent Earnings</h2>
              {earnings.length > 0 && (
                <button onClick={() => setActiveTab("earnings")} className="text-xs text-[#3B82F6] hover:text-[#60A5FA] transition-colors">
                  View All
                </button>
              )}
            </div>
            {earnings.length === 0 ? (
              <p className="text-[#666666] text-sm py-4 text-center">No earnings yet. Share your links to start earning!</p>
            ) : (
              <div className="space-y-2">
                {earnings.slice(0, 5).map((e) => (
                  <div key={e.id} className="flex items-center justify-between py-2.5 border-b border-[#222222] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-white">
                          {e.links?.title || `/${e.links?.short_code || "—"}`}
                        </p>
                        <p className="text-xs text-[#666666]">{formatDate(e.created_at)}</p>
                      </div>
                    </div>
                    <span className="text-emerald-400 font-semibold text-sm tabular-nums">
                      +${Number(e.amount).toFixed(4)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== EARNINGS TAB ===== */}
      {activeTab === "earnings" && (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Earnings History</h2>
            {earnings.length === 0 ? (
              <p className="text-[#666666] text-sm py-8 text-center">No earnings yet. Visitors completing ad steps on your links will generate earnings here.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#222222]">
                      <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Date</th>
                      <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Link</th>
                      <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">CPM Rate</th>
                      <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earnings.map((e) => (
                      <tr key={e.id} className="border-t border-[#222222] hover:bg-[#141414] transition-colors">
                        <td className="py-3 px-4 text-[#999999]">{formatDate(e.created_at)}</td>
                        <td className="py-3 px-4">
                          <span className="text-[#3B82F6] font-mono text-sm">/{e.links?.short_code || "—"}</span>
                          {e.links?.title && <p className="text-[#666666] text-xs mt-0.5">{e.links.title}</p>}
                        </td>
                        <td className="py-3 px-4 text-[#999999]">${Number(e.cpm_rate).toFixed(2)}</td>
                        <td className="py-3 px-4 text-right text-emerald-400 font-semibold tabular-nums">+${Number(e.amount).toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== PAYOUTS TAB ===== */}
      {activeTab === "payouts" && (
        <div className="space-y-6">
          {/* Payout Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-5">
              <p className="text-xs text-[#666666] uppercase tracking-wider mb-1">Available</p>
              <p className="text-2xl font-bold tabular-nums text-[#3B82F6]">${wallet ? Number(wallet.balance).toFixed(2) : "0.00"}</p>
            </div>
            <div className="glass-card p-5">
              <p className="text-xs text-[#666666] uppercase tracking-wider mb-1">Total Withdrawn</p>
              <p className="text-2xl font-bold tabular-nums text-cyan-400">${wallet ? Number(wallet.total_withdrawn).toFixed(2) : "0.00"}</p>
            </div>
            <div className="glass-card p-5">
              <p className="text-xs text-[#666666] uppercase tracking-wider mb-1">Min Payout</p>
              <p className="text-2xl font-bold tabular-nums text-[#CCCCCC]">${wallet?.min_payout || 5}</p>
            </div>
          </div>

          {/* Withdraw Button */}
          {wallet && wallet.balance >= wallet.min_payout && !showPayoutForm && (
            <button
              onClick={() => setShowPayoutForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#3B82F6]/25 transition-all duration-200 inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Request Withdrawal
            </button>
          )}
          {wallet && wallet.balance < wallet.min_payout && !showPayoutForm && (
            <div className="glass-card p-4 text-sm text-[#999999] flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              You need at least <span className="text-white font-medium">${wallet.min_payout}</span> to request a withdrawal. Current balance: <span className="text-[#3B82F6] font-medium">${Number(wallet.balance).toFixed(2)}</span>
            </div>
          )}

          {/* Payout Form */}
          {showPayoutForm && (
            <div className="glass-card-accent p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Request Withdrawal</h3>
              <form onSubmit={handlePayout} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm text-[#999999] mb-1.5">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min={wallet?.min_payout || 5}
                    max={wallet?.balance || 0}
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    required
                    placeholder={`Min $${wallet?.min_payout || 5} — Max $${wallet ? Number(wallet.balance).toFixed(2) : "0.00"}`}
                    className="w-full px-4 py-2.5 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#999999] mb-1.5">Payment Method</label>
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all"
                  >
                    <option value="" className="bg-[#111111]">Select method</option>
                    <option value="paypal" className="bg-[#111111]">PayPal</option>
                    <option value="bank" className="bg-[#111111]">Bank Transfer</option>
                    <option value="crypto" className="bg-[#111111]">Crypto (USDT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#999999] mb-1.5">Payment Details</label>
                  <input
                    type="text"
                    value={payoutDetails}
                    onChange={(e) => setPayoutDetails(e.target.value)}
                    required
                    placeholder="PayPal email, bank account, or wallet address"
                    className="w-full px-4 py-2.5 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all"
                  />
                </div>
                {payoutError && <p className="text-red-400 text-sm">{payoutError}</p>}
                {payoutMsg && <p className="text-emerald-400 text-sm">{payoutMsg}</p>}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={payoutLoading}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#3B82F6]/25 transition-all duration-200 disabled:opacity-50"
                  >
                    {payoutLoading ? "Submitting..." : "Submit Request"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPayoutForm(false)}
                    className="px-6 py-2.5 border border-[#2A2A2A] bg-[#111111] rounded-xl text-[#CCCCCC] hover:bg-[#1A1A1A] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Payout History */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Withdrawal History</h2>
            {payouts.length === 0 ? (
              <p className="text-[#666666] text-sm py-8 text-center">No withdrawal requests yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#222222]">
                      <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Date</th>
                      <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Amount</th>
                      <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Method</th>
                      <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Status</th>
                      <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Processed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((p) => (
                      <tr key={p.id} className="border-t border-[#222222] hover:bg-[#141414] transition-colors">
                        <td className="py-3 px-4 text-[#999999]">{formatDate(p.created_at)}</td>
                        <td className="py-3 px-4 text-white font-semibold tabular-nums">${Number(p.amount).toFixed(2)}</td>
                        <td className="py-3 px-4 text-[#999999] capitalize">{p.payout_method || "—"}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[p.status] || ""}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#666666]">{p.processed_at ? formatDate(p.processed_at) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== LINKS TAB ===== */}
      {activeTab === "links" && (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Create New Short Link</h2>
            <ShortenForm />
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Your Links</h2>
            {loading ? (
              <div className="text-center py-8 text-[#666666]">Loading...</div>
            ) : (
              <LinkTable
                links={links}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      )}

      {/* ===== SUPPORT TAB ===== */}
      {activeTab === "support" && (
        <div className="space-y-6">
          {/* Submit ticket */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Submit a Ticket</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setTicketSending(true); setTicketSent("");
              const res = await fetch("/api/support", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "User", email: "user@linkmint.app", subject: ticketSubject, message: ticketMessage }),
              });
              if (res.ok) {
                setTicketSent("Ticket submitted successfully!");
                setTicketSubject(""); setTicketMessage("");
                const d = await fetch("/api/support").then(r => r.json());
                if (d?.tickets) setTickets(d.tickets);
              } else { setTicketSent("Failed to submit ticket"); }
              setTicketSending(false);
              setTimeout(() => setTicketSent(""), 4000);
            }} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-sm text-[#999999] mb-1.5">Subject</label>
                <select value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} required
                  className="w-full px-4 py-2.5 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all">
                  <option value="" className="bg-[#111111]">Select topic</option>
                  <option value="account" className="bg-[#111111]">Account Issue</option>
                  <option value="payout" className="bg-[#111111]">Payout / Earnings</option>
                  <option value="links" className="bg-[#111111]">Links / Shortening</option>
                  <option value="bug" className="bg-[#111111]">Bug Report</option>
                  <option value="other" className="bg-[#111111]">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#999999] mb-1.5">Message</label>
                <textarea value={ticketMessage} onChange={(e) => setTicketMessage(e.target.value)} required rows={4}
                  className="w-full px-4 py-2.5 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all resize-none"
                  placeholder="Describe your issue..." />
              </div>
              {ticketSent && <p className={`text-sm ${ticketSent.includes("success") ? "text-emerald-400" : "text-red-400"}`}>{ticketSent}</p>}
              <button type="submit" disabled={ticketSending}
                className="px-6 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-xl transition-all disabled:opacity-50 text-sm">
                {ticketSending ? "Submitting..." : "Submit Ticket"}
              </button>
            </form>
          </div>

          {/* Ticket history */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Your Tickets</h2>
            {tickets.length === 0 ? (
              <p className="text-[#666666] text-sm py-4 text-center">No tickets yet.</p>
            ) : (
              <div className="space-y-3">
                {tickets.map((t) => (
                  <div key={t.id} className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium capitalize">{t.subject}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          t.status === "pending" ? "bg-amber-500/10 text-amber-400" :
                          t.status === "in_progress" ? "bg-blue-500/10 text-blue-400" :
                          t.status === "resolved" ? "bg-emerald-500/10 text-emerald-400" :
                          "bg-[#222222] text-[#666666]"
                        }`}>{t.status.replace("_", " ")}</span>
                      </div>
                      <span className="text-[#555555] text-xs">{formatDate(t.created_at)}</span>
                    </div>
                    <p className="text-[#999999] text-sm">{t.message}</p>
                    {t.admin_reply && (
                      <div className="mt-3 pt-3 border-t border-[#1A1A1A]">
                        <p className="text-[10px] text-[#3B82F6] uppercase tracking-wider mb-1">Admin Reply</p>
                        <p className="text-[#CCCCCC] text-sm">{t.admin_reply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
