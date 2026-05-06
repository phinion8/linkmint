import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const { data: settings } = await supabase.from("global_settings").select("*").single();

    // Get stats
    const { count: totalLinks } = await supabase
      .from("links")
      .select("*", { count: "exact", head: true });

    const { count: totalUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    const { count: totalClicks } = await supabase
      .from("clicks")
      .select("*", { count: "exact", head: true });

    // Revenue stats
    const { data: earningsAgg } = await supabase
      .from("earnings")
      .select("amount");

    const totalRevenue = earningsAgg?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;

    const { count: pendingPayouts } = await supabase
      .from("payout_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    const { data: payoutAgg } = await supabase
      .from("payout_requests")
      .select("amount")
      .eq("status", "paid");

    const totalPaidOut = payoutAgg?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

    return Response.json({
      settings,
      stats: {
        totalLinks: totalLinks || 0,
        totalUsers: totalUsers || 0,
        totalClicks: totalClicks || 0,
        totalRevenue,
        pendingPayouts: pendingPayouts || 0,
        totalPaidOut,
      },
    });
  } catch {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    const updates: Record<string, unknown> = {};
    if (body.default_steps !== undefined) {
      const v = Number(body.default_steps);
      if (v < 1 || v > 20 || !Number.isInteger(v)) return Response.json({ error: "Steps must be 1-20" }, { status: 400 });
      updates.default_steps = v;
    }
    if (body.default_timer_seconds !== undefined) {
      const v = Number(body.default_timer_seconds);
      if (v < 1 || v > 300 || !Number.isInteger(v)) return Response.json({ error: "Timer must be 1-300 seconds" }, { status: 400 });
      updates.default_timer_seconds = v;
    }
    if (body.max_links_per_user !== undefined) {
      const v = Number(body.max_links_per_user);
      if (v < 1 || v > 10000 || !Number.isInteger(v)) return Response.json({ error: "Max links must be 1-10000" }, { status: 400 });
      updates.max_links_per_user = v;
    }
    if (body.site_name !== undefined) {
      if (typeof body.site_name !== "string" || body.site_name.length > 100) return Response.json({ error: "Invalid site name" }, { status: 400 });
      updates.site_name = body.site_name.trim();
    }
    if (body.cpm_rate !== undefined) {
      const v = Number(body.cpm_rate);
      if (v < 0.01 || v > 100 || !isFinite(v)) return Response.json({ error: "CPM rate must be $0.01-$100" }, { status: 400 });
      updates.cpm_rate = v;
    }
    if (body.ad_layout !== undefined) {
      if (!["v1", "v2"].includes(body.ad_layout)) return Response.json({ error: "Invalid ad layout" }, { status: 400 });
      updates.ad_layout = body.ad_layout;
    }

    const { data: settings, error } = await supabase
      .from("global_settings")
      .update(updates)
      .select()
      .single();

    if (error) {
      // If no row exists yet, try to get the id first
      const { data: existing } = await supabase.from("global_settings").select("id").single();
      if (existing) {
        const { data: updated } = await supabase
          .from("global_settings")
          .update(updates)
          .eq("id", existing.id)
          .select()
          .single();
        return Response.json({ settings: updated });
      }
      return Response.json({ error: "Failed to update settings" }, { status: 500 });
    }

    return Response.json({ settings });
  } catch {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
}
