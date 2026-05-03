"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

interface Ticket {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  admin_reply: string | null;
  created_at: string;
}

export default function AdminTicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [counts, setCounts] = useState({ pending: 0, in_progress: 0 });
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchTickets = useCallback(async () => {
    const params = new URLSearchParams({ page: page.toString(), status: filter });
    const res = await fetch(`/api/admin/tickets?${params}`);
    if (res.status === 403) { router.push("/login"); return; }
    const data = await res.json();
    setTickets(data.tickets || []);
    setTotalPages(data.totalPages || 1);
    setCounts(data.counts || { pending: 0, in_progress: 0 });
    setLoading(false);
  }, [page, filter, router]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  async function updateTicket(id: string, status?: string, admin_reply?: string) {
    setSaving(true);
    await fetch("/api/admin/tickets", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, admin_reply }),
    });
    setSaving(false);
    setReplyId(null);
    setReplyText("");
    fetchTickets();
  }

  const statusColors: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-400",
    in_progress: "bg-blue-500/10 text-blue-400",
    resolved: "bg-emerald-500/10 text-emerald-400",
    closed: "bg-[#222222] text-[#666666]",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Support Tickets</h1>
        <p className="text-[#999999] mt-1">
          {counts.pending > 0 && <span className="text-amber-400 font-semibold">{counts.pending} pending</span>}
          {counts.pending > 0 && counts.in_progress > 0 && " · "}
          {counts.in_progress > 0 && <span className="text-blue-400 font-semibold">{counts.in_progress} in progress</span>}
          {counts.pending === 0 && counts.in_progress === 0 && "All tickets handled"}
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "pending", "in_progress", "resolved", "closed"].map((s) => (
          <button key={s} onClick={() => { setFilter(s); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === s
                ? "bg-[#3B82F6] text-white"
                : "border border-[#2A2A2A] bg-[#111111] text-[#999999] hover:bg-[#1A1A1A]"
            }`}>
            {s.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Tickets */}
      {loading ? (
        <div className="text-center py-12 text-[#666666]">Loading...</div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12 text-[#666666]">No tickets found</div>
      ) : (
        <div className="space-y-4">
          {tickets.map((t) => (
            <div key={t.id} className="glass-card p-5">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[t.status]}`}>
                    {t.status.replace("_", " ")}
                  </span>
                  <span className="text-white font-medium text-sm capitalize">{t.subject}</span>
                  <span className="text-[#444444] text-xs font-mono">#{t.id.slice(0, 8)}</span>
                </div>
                <span className="text-[#555555] text-xs">{formatDate(t.created_at)}</span>
              </div>

              {/* User info */}
              <div className="flex items-center gap-2 mb-3 text-xs text-[#666666]">
                <span>{t.name}</span>
                <span>·</span>
                <span>{t.email}</span>
              </div>

              {/* Message */}
              <p className="text-[#CCCCCC] text-sm mb-4 leading-relaxed">{t.message}</p>

              {/* Admin reply */}
              {t.admin_reply && (
                <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-4 mb-4">
                  <p className="text-[10px] text-[#3B82F6] uppercase tracking-wider mb-1">Your Reply</p>
                  <p className="text-[#CCCCCC] text-sm">{t.admin_reply}</p>
                </div>
              )}

              {/* Reply form */}
              {replyId === t.id && (
                <div className="mb-4">
                  <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={3}
                    className="w-full px-4 py-2.5 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all resize-none text-sm mb-2"
                    placeholder="Type your reply..." />
                  <div className="flex gap-2">
                    <button onClick={() => updateTicket(t.id, "resolved", replyText)} disabled={saving || !replyText}
                      className="text-xs px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors disabled:opacity-50">
                      Reply & Resolve
                    </button>
                    <button onClick={() => updateTicket(t.id, "in_progress", replyText)} disabled={saving || !replyText}
                      className="text-xs px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors disabled:opacity-50">
                      Reply & Keep Open
                    </button>
                    <button onClick={() => { setReplyId(null); setReplyText(""); }}
                      className="text-xs px-3 py-1.5 text-[#666666] hover:text-white transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {replyId !== t.id && (
                  <button onClick={() => { setReplyId(t.id); setReplyText(t.admin_reply || ""); }}
                    className="text-xs px-3 py-1.5 bg-[#3B82F6]/10 text-[#3B82F6] rounded-lg hover:bg-[#3B82F6]/20 transition-colors">
                    Reply
                  </button>
                )}
                {t.status === "pending" && (
                  <button onClick={() => updateTicket(t.id, "in_progress")}
                    className="text-xs px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors">
                    Mark In Progress
                  </button>
                )}
                {t.status !== "resolved" && t.status !== "closed" && (
                  <button onClick={() => updateTicket(t.id, "resolved")}
                    className="text-xs px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors">
                    Resolve
                  </button>
                )}
                {t.status !== "closed" && (
                  <button onClick={() => updateTicket(t.id, "closed")}
                    className="text-xs px-3 py-1.5 bg-[#222222] text-[#666666] rounded-lg hover:bg-[#2A2A2A] transition-colors">
                    Close
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="border border-[#2A2A2A] bg-[#111111] rounded-lg text-[#CCCCCC] hover:bg-[#1A1A1A] transition-all px-3 py-1.5 text-sm disabled:opacity-50">Prev</button>
          <span className="text-[#999999] text-sm">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="border border-[#2A2A2A] bg-[#111111] rounded-lg text-[#CCCCCC] hover:bg-[#1A1A1A] transition-all px-3 py-1.5 text-sm disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
