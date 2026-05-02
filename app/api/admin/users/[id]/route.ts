import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const updates: Record<string, unknown> = {};
    if (body.is_active !== undefined) updates.is_active = body.is_active;
    if (body.role !== undefined) updates.role = body.role;

    const { error } = await supabase.from("users").update(updates).eq("id", id);

    if (error) {
      return Response.json({ error: "Failed to update user" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
}
