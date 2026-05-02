import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const { data: link } = await supabase
      .from("links")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!link) {
      return Response.json({ error: "Link not found" }, { status: 404 });
    }

    // Get steps
    const { data: steps } = await supabase
      .from("link_steps")
      .select("*")
      .eq("link_id", id)
      .order("step_order", { ascending: true });

    // Get recent clicks
    const { data: clicks } = await supabase
      .from("clicks")
      .select("*")
      .eq("link_id", id)
      .order("created_at", { ascending: false })
      .limit(50);

    return Response.json({ link, steps: steps || [], clicks: clicks || [] });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    const { data: existing } = await supabase
      .from("links")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!existing) {
      return Response.json({ error: "Link not found" }, { status: 404 });
    }

    // Update link fields
    const updates: Record<string, unknown> = {};
    if (body.title !== undefined) updates.title = body.title;
    if (body.is_active !== undefined) updates.is_active = body.is_active;
    if (body.original_url !== undefined) updates.original_url = body.original_url;

    if (Object.keys(updates).length > 0) {
      await supabase.from("links").update(updates).eq("id", id);
    }

    // Update steps if provided
    if (body.steps) {
      // Delete existing steps and insert new ones
      await supabase.from("link_steps").delete().eq("link_id", id);
      const steps = body.steps.map((step: { timer_seconds: number; button_text?: string }, i: number) => ({
        link_id: id,
        step_order: i + 1,
        timer_seconds: step.timer_seconds,
        button_text: step.button_text || "Continue",
      }));
      await supabase.from("link_steps").insert(steps);
    }

    const { data: link } = await supabase.from("links").select("*").eq("id", id).single();
    return Response.json({ link });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const { error } = await supabase
      .from("links")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return Response.json({ error: "Failed to delete link" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
