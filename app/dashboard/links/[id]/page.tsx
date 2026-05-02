"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

interface LinkDetail {
  id: string;
  short_code: string;
  original_url: string;
  title: string | null;
  is_active: boolean;
  total_clicks: number;
  created_at: string;
}

interface Step {
  id: string;
  step_order: number;
  timer_seconds: number;
  button_text: string;
}

interface Click {
  id: string;
  ip_address: string | null;
  user_agent: string | null;
  country: string | null;
  device_type: string | null;
  created_at: string;
}

export default function LinkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [link, setLink] = useState<LinkDetail | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [clicks, setClicks] = useState<Click[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/links/${id}`);
    if (res.status === 401) {
      router.push("/login");
      return;
    }
    if (res.status === 404) {
      router.push("/dashboard");
      return;
    }
    const data = await res.json();
    setLink(data.link);
    setSteps(data.steps);
    setClicks(data.clicks);
    setLoading(false);
  }, [id, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function addStep() {
    setSteps((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        step_order: prev.length + 1,
        timer_seconds: 5,
        button_text: "Continue",
      },
    ]);
  }

  function removeStep(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, step_order: i + 1 })));
  }

  function updateStep(index: number, field: string, value: number | string) {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  async function saveSteps() {
    setSaving(true);
    await fetch(`/api/links/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        steps: steps.map((s) => ({
          timer_seconds: s.timer_seconds,
          button_text: s.button_text,
        })),
      }),
    });
    setSaving(false);
    fetchData();
  }

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  if (!link) {
    return <div className="text-center py-20 text-gray-500">Link not found</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{link.title || `/${link.short_code}`}</h1>
          <p className="text-gray-400 text-sm mt-1">{link.original_url}</p>
        </div>
        <button onClick={() => router.push("/dashboard")} className="text-gray-400 hover:text-white text-sm">
          Back to Dashboard
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Total Clicks</p>
          <p className="text-2xl font-bold mt-1">{link.total_clicks}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Status</p>
          <p className={`text-2xl font-bold mt-1 ${link.is_active ? "text-green-400" : "text-red-400"}`}>
            {link.is_active ? "Active" : "Inactive"}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Steps</p>
          <p className="text-2xl font-bold mt-1">{steps.length}</p>
        </div>
      </div>

      {/* Step Configuration */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Step Configuration</h2>
          <div className="flex gap-2">
            <button
              onClick={addStep}
              className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Step
            </button>
            <button
              onClick={saveSteps}
              disabled={saving}
              className="text-sm px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Steps"}
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-4 bg-gray-800 rounded-lg p-4">
              <span className="text-gray-400 font-medium w-20">Step {i + 1}</span>
              <div className="flex-1 flex items-center gap-4">
                <div>
                  <label className="text-xs text-gray-500">Timer (sec)</label>
                  <input
                    type="number"
                    value={step.timer_seconds}
                    onChange={(e) => updateStep(i, "timer_seconds", parseInt(e.target.value) || 1)}
                    min={1}
                    max={60}
                    className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Button Text</label>
                  <input
                    type="text"
                    value={step.button_text}
                    onChange={(e) => updateStep(i, "button_text", e.target.value)}
                    className="w-40 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>
              </div>
              {steps.length > 1 && (
                <button
                  onClick={() => removeStep(i)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Clicks */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Clicks</h2>
        {clicks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No clicks yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="py-2 px-3 text-gray-400">Date</th>
                  <th className="py-2 px-3 text-gray-400">Country</th>
                  <th className="py-2 px-3 text-gray-400">Device</th>
                  <th className="py-2 px-3 text-gray-400">IP</th>
                </tr>
              </thead>
              <tbody>
                {clicks.map((click) => (
                  <tr key={click.id} className="border-b border-gray-800/50">
                    <td className="py-2 px-3 text-gray-300">{formatDate(click.created_at)}</td>
                    <td className="py-2 px-3 text-gray-300">{click.country || "-"}</td>
                    <td className="py-2 px-3 text-gray-300">{click.device_type || "-"}</td>
                    <td className="py-2 px-3 text-gray-400 font-mono text-xs">{click.ip_address || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
