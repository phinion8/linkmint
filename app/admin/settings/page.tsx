"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    site_name: "LinkMint",
    default_steps: 3,
    default_timer_seconds: 5,
    max_links_per_user: 100,
    cpm_rate: 1.5,
    ad_layout: "v1",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => {
        if (res.status === 403) {
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.settings) {
          setSettings({
            site_name: data.settings.site_name,
            default_steps: data.settings.default_steps,
            default_timer_seconds: data.settings.default_timer_seconds,
            max_links_per_user: data.settings.max_links_per_user,
            cpm_rate: data.settings.cpm_rate || 1.5,
            ad_layout: data.settings.ad_layout || "v1",
          });
        }
        setLoading(false);
      });
  }, [router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) {
    return <div className="text-center py-20 text-[#666666]">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Global Settings</h1>

      <form onSubmit={handleSave} className="glass-card p-6 space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm text-[#999999] mb-1">Site Name</label>
          <input
            type="text"
            value={settings.site_name}
            onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
            className="w-full px-4 py-2 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm text-[#999999] mb-1">Default Steps per Link</label>
          <input
            type="number"
            value={settings.default_steps}
            onChange={(e) => setSettings({ ...settings, default_steps: parseInt(e.target.value) || 1 })}
            min={1}
            max={10}
            className="w-32 px-4 py-2 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all"
          />
          <p className="text-xs text-[#666666] mt-1">
            Number of intermediate ad pages visitors must complete (1-10)
          </p>
        </div>

        <div>
          <label className="block text-sm text-[#999999] mb-1">Default Timer per Step (seconds)</label>
          <input
            type="number"
            value={settings.default_timer_seconds}
            onChange={(e) => setSettings({ ...settings, default_timer_seconds: parseInt(e.target.value) || 1 })}
            min={1}
            max={60}
            className="w-32 px-4 py-2 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all"
          />
          <p className="text-xs text-[#666666] mt-1">
            How long visitors must wait on each step page (1-60 seconds)
          </p>
        </div>

        <div>
          <label className="block text-sm text-[#999999] mb-1">CPM Rate ($ per 1,000 impressions)</label>
          <input
            type="number"
            step="0.01"
            value={settings.cpm_rate}
            onChange={(e) => setSettings({ ...settings, cpm_rate: parseFloat(e.target.value) || 0.01 })}
            min={0.01}
            max={100}
            className="w-40 px-4 py-2 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all"
          />
          <p className="text-xs text-[#666666] mt-1">
            Revenue earned by publishers for every 1,000 completed ad impressions
          </p>
        </div>

        <div>
          <label className="block text-sm text-[#999999] mb-1">Max Links per User</label>
          <input
            type="number"
            value={settings.max_links_per_user}
            onChange={(e) => setSettings({ ...settings, max_links_per_user: parseInt(e.target.value) || 1 })}
            min={1}
            max={10000}
            className="w-32 px-4 py-2 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all"
          />
        </div>

        {/* Ad Layout Selector */}
        <div className="pt-4 border-t border-[#2A2A2A]">
          <label className="block text-sm text-[#999999] mb-3">Ad Page Layout</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* V1 */}
            <label
              className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                settings.ad_layout === "v1"
                  ? "border-[#3B82F6] bg-[#3B82F6]/5"
                  : "border-[#2A2A2A] bg-[#111111] hover:border-[#3A3A3A]"
              }`}
            >
              <input
                type="radio"
                name="ad_layout"
                value="v1"
                checked={settings.ad_layout === "v1"}
                onChange={() => setSettings({ ...settings, ad_layout: "v1" })}
                className="sr-only"
              />
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  settings.ad_layout === "v1" ? "border-[#3B82F6]" : "border-[#444444]"
                }`}>
                  {settings.ad_layout === "v1" && <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />}
                </div>
                <span className="text-white font-semibold text-sm">V1 — Full Experience</span>
              </div>
              <p className="text-[#666666] text-xs leading-relaxed ml-7">
                3-column layout with games, trivia, polls, fun facts. 6 banner ads + native + popunder + social bar. Maximum engagement & revenue.
              </p>
              <div className="mt-3 ml-7 flex flex-wrap gap-1">
                {["728x90", "160x600", "468x60", "300x250", "320x50", "160x300", "Native", "Popunder", "Social Bar"].map((t) => (
                  <span key={t} className="text-[10px] bg-[#1A1A1A] text-[#666666] px-1.5 py-0.5 rounded">{t}</span>
                ))}
              </div>
            </label>

            {/* V2 */}
            <label
              className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                settings.ad_layout === "v2"
                  ? "border-[#3B82F6] bg-[#3B82F6]/5"
                  : "border-[#2A2A2A] bg-[#111111] hover:border-[#3A3A3A]"
              }`}
            >
              <input
                type="radio"
                name="ad_layout"
                value="v2"
                checked={settings.ad_layout === "v2"}
                onChange={() => setSettings({ ...settings, ad_layout: "v2" })}
                className="sr-only"
              />
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  settings.ad_layout === "v2" ? "border-[#3B82F6]" : "border-[#444444]"
                }`}>
                  {settings.ad_layout === "v2" && <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />}
                </div>
                <span className="text-white font-semibold text-sm">V2 — Clean & Focused</span>
              </div>
              <p className="text-[#666666] text-xs leading-relaxed ml-7">
                Single column, minimal UI. Top banner → countdown → high CPM ad → continue button. Popunder on click. Sticky bottom banner. Fast & clean.
              </p>
              <div className="mt-3 ml-7 flex flex-wrap gap-1">
                {["728x90", "300x250", "320x50", "Popunder", "Social Bar", "Sticky"].map((t) => (
                  <span key={t} className="text-[10px] bg-[#1A1A1A] text-[#666666] px-1.5 py-0.5 rounded">{t}</span>
                ))}
              </div>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#3B82F6]/25 transition-all duration-200 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
          {saved && <span className="text-[#3B82F6] text-sm">Settings saved!</span>}
        </div>
      </form>
    </div>
  );
}
