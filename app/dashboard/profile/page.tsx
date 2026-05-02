"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface WalletData {
  balance: number;
  total_earned: number;
  total_withdrawn: number;
  min_payout: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/wallet").then((r) => (r.ok ? r.json() : null)),
    ]).then(([authData, walletData]) => {
      if (!authData?.user) {
        router.push("/login");
        return;
      }
      setUser(authData.user);
      setName(authData.user.name);
      if (walletData?.wallet) setWallet(walletData.wallet);
      setLoading(false);
    });
  }, [router]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg("");
    setSaveError("");

    const body: Record<string, string> = { name };
    if (currentPassword && newPassword) {
      body.current_password = currentPassword;
      body.new_password = newPassword;
    }

    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();

    if (!res.ok) {
      setSaveError(data.error || "Failed to update profile");
    } else {
      setSaveMsg("Profile updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      if (data.user) setUser(data.user);
    }
    setSaving(false);
    setTimeout(() => { setSaveMsg(""); setSaveError(""); }, 4000);
  }

  async function handleLogout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  }

  if (loading) {
    return <div className="text-center py-20 text-[#666666]">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-[#999999] mt-1">Manage your account settings</p>
      </div>

      {/* Profile Card */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] flex items-center justify-center text-2xl font-bold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
            <p className="text-[#999999] text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                user?.role === "admin" ? "bg-purple-500/10 text-purple-400" : "bg-blue-500/10 text-blue-400"
              }`}>
                {user?.role}
              </span>
              <span className="text-xs text-[#666666]">Joined {user?.created_at ? formatDate(user.created_at) : "—"}</span>
            </div>
          </div>
        </div>

        {/* Wallet Summary */}
        {wallet && (
          <div className="grid grid-cols-3 gap-4 pt-5 border-t border-[#222222]">
            <div>
              <p className="text-xs text-[#666666] uppercase tracking-wider mb-1">Balance</p>
              <p className="text-lg font-bold tabular-nums text-[#3B82F6]">${Number(wallet.balance).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-[#666666] uppercase tracking-wider mb-1">Total Earned</p>
              <p className="text-lg font-bold tabular-nums text-emerald-400">${Number(wallet.total_earned).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-[#666666] uppercase tracking-wider mb-1">Withdrawn</p>
              <p className="text-lg font-bold tabular-nums text-cyan-400">${Number(wallet.total_withdrawn).toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-5">Edit Profile</h3>
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div>
            <label className="block text-sm text-[#999999] mb-1.5">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-[#999999] mb-1.5">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-2.5 bg-[#111111] border border-[#222222] rounded-xl text-[#666666] cursor-not-allowed"
            />
            <p className="text-xs text-[#555555] mt-1">Email cannot be changed</p>
          </div>

          <div className="pt-4 border-t border-[#222222]">
            <h4 className="text-sm font-medium text-[#CCCCCC] mb-4">Change Password</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#999999] mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                  className="w-full px-4 py-2.5 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-[#999999] mb-1.5">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  minLength={6}
                  className="w-full px-4 py-2.5 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all"
                />
              </div>
            </div>
          </div>

          {saveError && <p className="text-red-400 text-sm">{saveError}</p>}
          {saveMsg && <p className="text-emerald-400 text-sm">{saveMsg}</p>}

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#3B82F6]/25 transition-all duration-200 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="glass-card p-6 border-red-500/10">
        <h3 className="text-lg font-semibold text-white mb-2">Account</h3>
        <p className="text-[#999999] text-sm mb-4">Sign out of your account on this device.</p>
        <button
          onClick={handleLogout}
          className="px-5 py-2.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors text-sm font-medium"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
