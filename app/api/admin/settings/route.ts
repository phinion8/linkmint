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
    if (body.default_steps !== undefined) updates.default_steps = body.default_steps;
    if (body.default_timer_seconds !== undefined) updates.default_timer_seconds = body.default_timer_seconds;
    if (body.max_links_per_user !== undefined) updates.max_links_per_user = body.max_links_per_user;
    if (body.site_name !== undefined) updates.site_name = body.site_name;
    if (body.cpm_rate !== undefined) updates.cpm_rate = body.cpm_rate;
    if (body.ad_layout !== undefined) updates.ad_layout = body.ad_layout;

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
