"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

interface Payout {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  payout_method: string | null;
  payout_details: string | null;
  admin_note: string | null;
  processed_at: string | null;
  created_at: string;
  users: { name: string; email: string };
}

export default function AdminPayoutsPage() {
  const router = useRouter();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPayouts = useCallback(async () => {
    const params = new URLSearchParams({ page: page.toString(), status: filter });
    const res = await fetch(`/api/admin/payouts?${params}`);
    if (res.status === 403) {
      router.push("/login");
      return;
    }
    const data = await res.json();
    setPayouts(data.payouts || []);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  }, [page, filter, router]);

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);

  async function handleAction(id: string, status: string) {
    const confirmMsg = status === "rejected"
      ? "Reject this payout? The amount will be refunded to the user's wallet."
      : status === "paid"
      ? "Mark this payout as paid?"
      : `Change status to ${status}?`;

    if (!confirm(confirmMsg)) return;

    setActionLoading(id);
    await fetch("/api/admin/payouts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setActionLoading(null);
    fetchPayouts();
  }

  const statusColors: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-400",
    approved: "bg-blue-500/10 text-blue-400",
    paid: "bg-emerald-500/10 text-emerald-400",
    rejected: "bg-red-500/10 text-red-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Payout Requests</h1>
          <p className="text-[#999999] mt-1">Review and process publisher withdrawal requests</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "pending", "approved", "paid", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === s
                ? "bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white"
                : "border border-[#2A2A2A] bg-[#111111] text-[#999999] hover:bg-[#1A1A1A]"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-[#666666]">Loading...</div>
        ) : payouts.length === 0 ? (
          <div className="text-center py-12 text-[#666666]">No payout requests found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#222222]">
                  <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">User</th>
                  <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Amount</th>
                  <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Method</th>
                  <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Details</th>
                  <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Requested</th>
                  <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p) => (
                  <tr key={p.id} className="border-t border-[#222222] hover:bg-[#141414] transition-colors">
                    <td className="py-3 px-4">
                      <p className="text-white">{p.users?.name}</p>
                      <p className="text-[#666666] text-xs">{p.users?.email}</p>
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold tabular-nums">
                      ${Number(p.amount).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-[#CCCCCC] capitalize">{p.payout_method || "—"}</td>
                    <td className="py-3 px-4 text-[#999999] text-xs max-w-[200px] truncate">{p.payout_details || "—"}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[p.status] || ""}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#999999]">{formatDate(p.created_at)}</td>
                    <td className="py-3 px-4">
                      {p.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction(p.id, "approved")}
                            disabled={actionLoading === p.id}
                            className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(p.id, "rejected")}
                            disabled={actionLoading === p.id}
                            className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {p.status === "approved" && (
                        <button
                          onClick={() => handleAction(p.id, "paid")}
                          disabled={actionLoading === p.id}
                          className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                        >
                          Mark Paid
                        </button>
                      )}
                      {(p.status === "paid" || p.status === "rejected") && (
                        <span className="text-xs text-[#666666]">
                          {p.processed_at ? formatDate(p.processed_at) : "—"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 border-t border-[#222222]">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="border border-[#2A2A2A] bg-[#111111] rounded-lg text-[#CCCCCC] hover:bg-[#1A1A1A] transition-all px-3 py-1.5 text-sm disabled:opacity-50">
              Prev
            </button>
            <span className="text-[#999999] text-sm">Page {page} of {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="border border-[#2A2A2A] bg-[#111111] rounded-lg text-[#CCCCCC] hover:bg-[#1A1A1A] transition-all px-3 py-1.5 text-sm disabled:opacity-50">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
