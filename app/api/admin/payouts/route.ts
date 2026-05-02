import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = 20;

    let query = supabase
      .from("payout_requests")
      .select("*, users(name, email)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1);

    if (status !== "all") {
      query = query.eq("status", status);
    }

    const { data: payouts, count } = await query;

    return Response.json({
      payouts: payouts || [],
      totalPages: Math.ceil((count || 0) / perPage),
      total: count || 0,
    });
  } catch {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const { id, status, admin_note } = await request.json();

    if (!id || !status) {
      return Response.json({ error: "ID and status required" }, { status: 400 });
    }

    const validStatuses = ["approved", "paid", "rejected"];
    if (!validStatuses.includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    // Get the payout request
    const { data: payout } = await supabase
      .from("payout_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (!payout) {
      return Response.json({ error: "Payout not found" }, { status: 404 });
    }

    // If rejecting, refund the balance
    if (status === "rejected" && payout.status === "pending") {
      const { data: wallet } = await supabase
        .from("user_wallets")
        .select("*")
        .eq("user_id", payout.user_id)
        .single();

      if (wallet) {
        await supabase
          .from("user_wallets")
          .update({
            balance: Number(wallet.balance) + Number(payout.amount),
            total_withdrawn: Number(wallet.total_withdrawn) - Number(payout.amount),
          })
          .eq("user_id", payout.user_id);
      }
    }

    // Update payout status
    const updates: Record<string, unknown> = { status };
    if (admin_note) updates.admin_note = admin_note;
    if (status === "paid" || status === "rejected") {
      updates.processed_at = new Date().toISOString();
    }

    const { data: updated, error } = await supabase
      .from("payout_requests")
      .update(updates)
      .eq("id", id)
      .select("*, users(name, email)")
      .single();

    if (error) {
      return Response.json({ error: "Failed to update payout" }, { status: 500 });
    }

    return Response.json({ payout: updated });
  } catch {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
}
