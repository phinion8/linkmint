import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

// GET — all tickets with filters
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = 20;

    let query = supabase
      .from("support_tickets")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1);

    if (status !== "all") {
      query = query.eq("status", status);
    }

    const { data: tickets, count } = await query;

    // Count by status
    const { count: pendingCount } = await supabase
      .from("support_tickets")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    const { count: inProgressCount } = await supabase
      .from("support_tickets")
      .select("*", { count: "exact", head: true })
      .eq("status", "in_progress");

    return Response.json({
      tickets: tickets || [],
      totalPages: Math.ceil((count || 0) / perPage),
      total: count || 0,
      counts: {
        pending: pendingCount || 0,
        in_progress: inProgressCount || 0,
      },
    });
  } catch {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
}

// PATCH — update ticket status / reply
export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const { id, status, admin_reply } = await request.json();

    if (!id) return Response.json({ error: "Ticket ID required" }, { status: 400 });

    const updates: Record<string, unknown> = {};
    if (status) updates.status = status;
    if (admin_reply !== undefined) updates.admin_reply = admin_reply;

    const { data: ticket, error } = await supabase
      .from("support_tickets")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return Response.json({ error: "Failed to update" }, { status: 500 });

    return Response.json({ ticket });
  } catch {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
}
