"use client";

import { useState } from "react";
import { formatDate, formatNumber } from "@/lib/utils";

interface LinkItem {
  id: string;
  short_code: string;
  original_url: string;
  title: string | null;
  is_active: boolean;
  total_clicks: number;
  created_at: string;
}

interface LinkTableProps {
  links: LinkItem[];
  showActions?: boolean;
  onToggle?: (id: string, active: boolean) => void;
  onDelete?: (id: string) => void;
}

export default function LinkTable({ links, showActions = true, onToggle, onDelete }: LinkTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCopy(shortCode: string, id: string) {
    navigator.clipboard.writeText(`${window.location.origin}/${shortCode}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-12 text-[#666666]">
        No links yet. Create your first short link!
      </div>
    );
  }

  return (
    <div className="glass-card overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-[#222222]">
            <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Short URL</th>
            <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Original URL</th>
            <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Clicks</th>
            <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Status</th>
            <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Created</th>
            {showActions && (
              <th className="py-3 px-4 text-xs font-medium text-[#666666] uppercase tracking-wider">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link.id} className="border-t border-[#222222] hover:bg-[#141414] transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <code className="text-[#3B82F6] font-mono text-sm">/{link.short_code}</code>
                  <button
                    onClick={() => handleCopy(link.short_code, link.id)}
                    className="border border-[#2A2A2A] bg-[#111111] rounded-lg text-[#CCCCCC] hover:bg-[#1A1A1A] transition-all text-xs px-2 py-0.5"
                  >
                    {copiedId === link.id ? "Copied!" : "Copy"}
                  </button>
                </div>
                {link.title && (
                  <p className="text-[#666666] text-xs mt-0.5">{link.title}</p>
                )}
              </td>
              <td className="py-3 px-4">
                <span className="text-[#CCCCCC] text-sm truncate block max-w-xs" title={link.original_url}>
                  {link.original_url}
                </span>
              </td>
              <td className="py-3 px-4 text-[#CCCCCC] text-sm">
                {formatNumber(link.total_clicks)}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    link.is_active
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {link.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="py-3 px-4 text-[#999999] text-sm">
                {formatDate(link.created_at)}
              </td>
              {showActions && (
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    {onToggle && (
                      <button
                        onClick={() => onToggle(link.id, !link.is_active)}
                        className="text-xs px-2.5 py-1 border border-[#2A2A2A] bg-[#111111] rounded-lg text-[#CCCCCC] hover:bg-[#1A1A1A] transition-all"
                      >
                        {link.is_active ? "Disable" : "Enable"}
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(link.id)}
                        className="text-xs px-2.5 py-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
