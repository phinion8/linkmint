"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatNumber } from "@/lib/utils";

interface Stats {
  totalLinks: number;
  totalUsers: number;
  totalClicks: number;
  totalRevenue: number;
  pendingPayouts: number;
  totalPaidOut: number;
}

interface Settings {
  default_steps: number;
  default_timer_seconds: number;
  max_links_per_user: number;
  site_name: string;
  cpm_rate: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => {
        if (res.status === 403 || res.status === 401) {
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setStats(data.stats);
          setSettings(data.settings);
        }
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return <div className="text-center py-20 text-[#666666]">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-[#999999] mt-1">Platform overview and management</p>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-sm text-[#999999]">Total Users</p>
          </div>
          <p className="text-3xl font-bold tabular-nums text-[#3B82F6]">{formatNumber(stats?.totalUsers || 0)}</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#60A5FA]/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#60A5FA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <p className="text-sm text-[#999999]">Total Links</p>
          </div>
          <p className="text-3xl font-bold tabular-nums text-[#60A5FA]">{formatNumber(stats?.totalLinks || 0)}</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <p className="text-sm text-[#999999]">Total Clicks</p>
          </div>
          <p className="text-3xl font-bold tabular-nums text-blue-400">{formatNumber(stats?.totalClicks || 0)}</p>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card-accent p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-[#999999]">Total Revenue</p>
          </div>
          <p className="text-3xl font-bold tabular-nums text-emerald-400">${(stats?.totalRevenue || 0).toFixed(2)}</p>
          <p className="text-xs text-[#666666] mt-2">Earned by all publishers</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-[#999999]">Pending Payouts</p>
          </div>
          <p className="text-3xl font-bold tabular-nums text-amber-400">{stats?.pendingPayouts || 0}</p>
          {(stats?.pendingPayouts || 0) > 0 && (
            <button
              onClick={() => router.push("/admin/payouts")}
              className="mt-3 text-xs bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-lg hover:bg-amber-500/20 transition-colors"
            >
              Review Now
            </button>
          )}
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-[#999999]">Total Paid Out</p>
          </div>
          <p className="text-3xl font-bold tabular-nums text-cyan-400">${(stats?.totalPaidOut || 0).toFixed(2)}</p>
          <p className="text-xs text-[#666666] mt-2">All-time withdrawals</p>
        </div>
      </div>

      {/* Current Configuration */}
      {settings && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Platform Configuration</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
            <div>
              <p className="text-[#666666] text-xs uppercase tracking-wider mb-1">Site Name</p>
              <p className="text-white font-medium">{settings.site_name}</p>
            </div>
            <div>
              <p className="text-[#666666] text-xs uppercase tracking-wider mb-1">Default Steps</p>
              <p className="text-white font-medium">{settings.default_steps}</p>
            </div>
            <div>
              <p className="text-[#666666] text-xs uppercase tracking-wider mb-1">Timer/Step</p>
              <p className="text-white font-medium">{settings.default_timer_seconds}s</p>
            </div>
            <div>
              <p className="text-[#666666] text-xs uppercase tracking-wider mb-1">Max Links</p>
              <p className="text-white font-medium">{settings.max_links_per_user}/user</p>
            </div>
            <div>
              <p className="text-[#666666] text-xs uppercase tracking-wider mb-1">CPM Rate</p>
              <p className="text-amber-400 font-medium">${Number(settings.cpm_rate).toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => router.push("/admin/links")}
          className="glass-card glass-card-hover p-6 text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#60A5FA]/10 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-[#60A5FA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h3 className="font-semibold text-white mb-1">Manage Links</h3>
          <p className="text-[#666666] text-sm">View, search, toggle, and delete all links</p>
        </button>

        <button
          onClick={() => router.push("/admin/users")}
          className="glass-card glass-card-hover p-6 text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-white mb-1">Manage Users</h3>
          <p className="text-[#666666] text-sm">Roles, ban/unban, view activity</p>
        </button>

        <button
          onClick={() => router.push("/admin/payouts")}
          className="glass-card glass-card-hover p-6 text-left group relative"
        >
          {(stats?.pendingPayouts || 0) > 0 && (
            <span className="absolute top-4 right-4 w-5 h-5 rounded-full bg-amber-500 text-[10px] font-bold text-black flex items-center justify-center">
              {stats?.pendingPayouts}
            </span>
          )}
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-white mb-1">Payouts</h3>
          <p className="text-[#666666] text-sm">Review and process withdrawal requests</p>
        </button>

        <button
          onClick={() => router.push("/admin/settings")}
          className="glass-card glass-card-hover p-6 text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-white mb-1">Settings</h3>
          <p className="text-[#666666] text-sm">CPM rate, steps, timers, limits</p>
        </button>
      </div>
    </div>
  );
}
