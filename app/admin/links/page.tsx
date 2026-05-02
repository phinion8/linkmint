"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { formatDate, formatNumber } from "@/lib/utils";

interface AdminLink {
  id: string;
  short_code: string;
  original_url: string;
  title: string | null;
  is_active: boolean;
  total_clicks: number;
  created_at: string;
  users: { name: string; email: string };
}

export default function AdminLinksPage() {
  const router = useRouter();
  const [links, setLinks] = useState<AdminLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLinks = useCallback(async () => {
    const params = new URLSearchParams({ page: page.toString(), search });
    const res = await fetch(`/api/admin/links?${params}`);
    if (res.status === 403) {
      router.push("/login");
      return;
    }
    const data = await res.json();
    setLinks(data.links || []);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  }, [page, search, router]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  async function handleToggle(id: string, active: boolean) {
    await fetch("/api/admin/links", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active: active }),
    });
    fetchLinks();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this link?")) return;
    await fetch("/api/admin/links", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchLinks();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">All Links</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search links..."
          className="w-72 px-4 py-2 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white text-sm placeholder:text-[#555555] focus:border-[#3B82F6]/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all"
        />
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-[#666666]">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#222222]">
                  <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Short Code</th>
                  <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Original URL</th>
                  <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Owner</th>
                  <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Clicks</th>
                  <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Created</th>
                  <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <tr key={link.id} className="border-t border-[#222222] hover:bg-[#141414] transition-colors">
                    <td className="py-3 px-4">
                      <code className="text-[#3B82F6] font-mono">/{link.short_code}</code>
                      {link.title && <p className="text-[#666666] text-xs">{link.title}</p>}
                    </td>
                    <td className="py-3 px-4 text-[#CCCCCC] max-w-xs truncate">{link.original_url}</td>
                    <td className="py-3 px-4">
                      <p className="text-[#CCCCCC]">{link.users?.name}</p>
                      <p className="text-[#666666] text-xs">{link.users?.email}</p>
                    </td>
                    <td className="py-3 px-4 text-[#CCCCCC]">{formatNumber(link.total_clicks)}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${link.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                        {link.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#999999]">{formatDate(link.created_at)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleToggle(link.id, !link.is_active)} className="border border-[#2A2A2A] bg-[#111111] rounded-lg text-[#CCCCCC] hover:bg-[#1A1A1A] transition-all text-xs px-3 py-1.5">
                          {link.is_active ? "Disable" : "Enable"}
                        </button>
                        <button onClick={() => handleDelete(link.id)} className="bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-xs px-3 py-1.5 transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 border-t border-[#222222]">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border border-[#2A2A2A] bg-[#111111] rounded-lg text-[#CCCCCC] hover:bg-[#1A1A1A] transition-all px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-[#999999] text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="border border-[#2A2A2A] bg-[#111111] rounded-lg text-[#CCCCCC] hover:bg-[#1A1A1A] transition-all px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
