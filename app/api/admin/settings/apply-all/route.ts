import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export async function POST() {
  try {
    await requireAdmin();

    // Get current global settings
    const { data: settings } = await supabase
      .from("global_settings")
      .select("default_steps, default_timer_seconds")
      .single();

    if (!settings) {
      return Response.json({ error: "Settings not found" }, { status: 500 });
    }

    // Get all links
    const { data: links } = await supabase
      .from("links")
      .select("id");

    if (!links || links.length === 0) {
      return Response.json({ updated: 0 });
    }

    let updated = 0;

    for (const link of links) {
      // Delete existing steps
      await supabase
        .from("link_steps")
        .delete()
        .eq("link_id", link.id);

      // Create new steps from global settings
      const steps = Array.from({ length: settings.default_steps }, (_, i) => ({
        link_id: link.id,
        step_order: i + 1,
        timer_seconds: settings.default_timer_seconds,
        button_text: i === settings.default_steps - 1 ? "Go to Link" : "Continue",
      }));

      await supabase.from("link_steps").insert(steps);
      updated++;
    }

    return Response.json({ updated });
  } catch {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
}
