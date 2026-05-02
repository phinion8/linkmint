import { supabase } from "@/lib/supabase";
import { requireAuth, hashPassword, comparePassword } from "@/lib/auth";

export async function PATCH(request: Request) {
  try {
    const user = await requireAuth();
    const { name, current_password, new_password } = await request.json();

    const updates: Record<string, string> = {};

    if (name && name.trim()) {
      updates.name = name.trim();
    }

    if (current_password && new_password) {
      if (new_password.length < 6) {
        return Response.json({ error: "New password must be at least 6 characters" }, { status: 400 });
      }

      // Verify current password
      const { data: fullUser } = await supabase
        .from("users")
        .select("password_hash")
        .eq("id", user.id)
        .single();

      if (!fullUser) {
        return Response.json({ error: "User not found" }, { status: 404 });
      }

      const valid = await comparePassword(current_password, fullUser.password_hash);
      if (!valid) {
        return Response.json({ error: "Current password is incorrect" }, { status: 400 });
      }

      updates.password_hash = await hashPassword(new_password);
    }

    if (Object.keys(updates).length === 0) {
      return Response.json({ error: "Nothing to update" }, { status: 400 });
    }

    const { data: updated, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user.id)
      .select("id, email, name, role, created_at")
      .single();

    if (error) {
      return Response.json({ error: "Failed to update profile" }, { status: 500 });
    }

    return Response.json({ user: updated });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
