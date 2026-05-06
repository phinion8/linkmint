import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const { amount, payout_method, payout_details } = await request.json();

    if (!amount || typeof amount !== "number" || amount <= 0 || !isFinite(amount)) {
      return Response.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!payout_method || !payout_details) {
      return Response.json({ error: "Payment method and details required" }, { status: 400 });
    }

    const validMethods = ["paypal", "upi"];
    if (!validMethods.includes(payout_method)) {
      return Response.json({ error: "Invalid payment method" }, { status: 400 });
    }

    // Atomic: check balance + deduct + create payout in one DB call
    // First check for pending payouts
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

    // Deduct balance first (prevents race condition — if two requests hit,
    // one will fail because balance goes negative and we check after)
    const { data: wallet } = await supabase
      .from("user_wallets")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!wallet) {
      return Response.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (amount < wallet.min_payout) {
      return Response.json({ error: `Minimum payout is $${wallet.min_payout}` }, { status: 400 });
    }

    if (amount > Number(wallet.balance)) {
      return Response.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // Deduct FIRST, then create payout (if payout creation fails, we refund)
    const newBalance = Number(wallet.balance) - amount;
    const newWithdrawn = Number(wallet.total_withdrawn) + amount;

    const { error: updateError } = await supabase
      .from("user_wallets")
      .update({ balance: newBalance, total_withdrawn: newWithdrawn })
      .eq("user_id", user.id)
      .gte("balance", amount); // This ensures balance >= amount at DB level

    if (updateError) {
      return Response.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // Create payout request
    const { data: payout, error } = await supabase
      .from("payout_requests")
      .insert({
        user_id: user.id,
        amount,
        payout_method,
        payout_details,
      })
      .select()
      .single();

    if (error) {
      // Refund if payout creation failed
      await supabase
        .from("user_wallets")
        .update({
          balance: Number(wallet.balance),
          total_withdrawn: Number(wallet.total_withdrawn),
        })
        .eq("user_id", user.id);

      return Response.json({ error: "Failed to create payout request" }, { status: 500 });
    }

    return Response.json({ payout });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
