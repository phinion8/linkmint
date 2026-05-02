import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const { amount, payout_method, payout_details } = await request.json();

    if (!amount || amount <= 0) {
      return Response.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Get wallet
    const { data: wallet } = await supabase
      .from("user_wallets")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!wallet) {
      return Response.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (amount < wallet.min_payout) {
      return Response.json(
        { error: `Minimum payout is $${wallet.min_payout}` },
        { status: 400 }
      );
    }

    if (amount > wallet.balance) {
      return Response.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // Check for pending payouts
    const { data: pendingPayouts } = await supabase
      .from("payout_requests")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "pending");

    if (pendingPayouts && pendingPayouts.length > 0) {
      return Response.json(
        { error: "You already have a pending payout request" },
        { status: 400 }
      );
    }

    // Create payout request
    const { data: payout, error } = await supabase
      .from("payout_requests")
      .insert({
        user_id: user.id,
        amount,
        payout_method: payout_method || null,
        payout_details: payout_details || null,
      })
      .select()
      .single();

    if (error) {
      return Response.json({ error: "Failed to create payout request" }, { status: 500 });
    }

    // Deduct from balance
    await supabase
      .from("user_wallets")
      .update({
        balance: wallet.balance - amount,
        total_withdrawn: wallet.total_withdrawn + amount,
      })
      .eq("user_id", user.id);

    return Response.json({ payout });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
