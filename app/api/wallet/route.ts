import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireAuth();

    // Get wallet
    const { data: wallet } = await supabase
      .from("user_wallets")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!wallet) {
      // Create wallet if missing
      const { data: newWallet } = await supabase
        .from("user_wallets")
        .insert({ user_id: user.id })
        .select()
        .single();

      return Response.json({ wallet: newWallet, earnings: [], payouts: [], cpm_rate: 1.5 });
    }

    // Get CPM rate
    const { data: settings } = await supabase
      .from("global_settings")
      .select("cpm_rate")
      .single();

    // Get recent earnings with link info
    const { data: earnings } = await supabase
      .from("earnings")
      .select("*, links(short_code, title)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    // Get payout requests
    const { data: payouts } = await supabase
      .from("payout_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    // Get earnings summary by day (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: dailyEarnings } = await supabase
      .from("earnings")
      .select("amount, created_at")
      .eq("user_id", user.id)
      .gte("created_at", thirtyDaysAgo)
      .order("created_at", { ascending: true });

    return Response.json({
      wallet,
      earnings: earnings || [],
      payouts: payouts || [],
      dailyEarnings: dailyEarnings || [],
      cpm_rate: settings?.cpm_rate || 1.5,
    });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
