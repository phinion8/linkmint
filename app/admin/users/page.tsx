"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  link_count: number;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = useCallback(async () => {
    const res = await fetch(`/api/admin/users?page=${page}`);
    if (res.status === 403) {
      router.push("/login");
      return;
    }
    const data = await res.json();
    setUsers(data.users || []);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  }, [page, router]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleToggleActive(id: string, active: boolean) {
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: active }),
    });
    fetchUsers();
  }

  async function handleToggleRole(id: string, currentRole: string) {
    const newRole = currentRole === "admin" ? "publisher" : "admin";
    if (!confirm(`Change role to ${newRole}?`)) return;
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    fetchUsers();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Users</h1>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-[#666666]">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#222222]">
                  <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Name</th>
                  <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Email</th>
                  <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Role</th>
                  <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Links</th>
                  <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Joined</th>
                  <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-[#222222] hover:bg-[#141414] transition-colors">
                    <td className="py-3 px-4 text-[#CCCCCC]">{user.name}</td>
                    <td className="py-3 px-4 text-[#999999]">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${user.role === "admin" ? "bg-purple-500/10 text-purple-400" : "bg-blue-500/10 text-blue-400"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#CCCCCC]">{user.link_count}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${user.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                        {user.is_active ? "Active" : "Banned"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#999999]">{formatDate(user.created_at)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleRole(user.id, user.role)}
                          className="border border-[#2A2A2A] bg-[#111111] rounded-lg text-[#CCCCCC] hover:bg-[#1A1A1A] transition-all text-xs px-3 py-1.5"
                        >
                          Toggle Role
                        </button>
                        <button
                          onClick={() => handleToggleActive(user.id, !user.is_active)}
                          className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${user.is_active ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-[#3B82F6]/10 text-[#3B82F6] hover:bg-[#3B82F6]/20"}`}
                        >
                          {user.is_active ? "Ban" : "Unban"}
                        </button>
                      </div>
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
