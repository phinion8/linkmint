import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth";
import { generateShortCode, isValidUrl } from "@/lib/utils";

export async function GET() {
  try {
    const user = await requireAuth();

    const { data: links, error } = await supabase
      .from("links")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return Response.json({ error: "Failed to fetch links" }, { status: 500 });
    }

    return Response.json({ links });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { url, title } = await request.json();

    if (!url || !isValidUrl(url)) {
      return Response.json({ error: "A valid URL is required" }, { status: 400 });
    }

    // Check link limit
    const { count } = await supabase
      .from("links")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    const { data: settings } = await supabase
      .from("global_settings")
      .select("*")
      .single();

    const maxLinks = settings?.max_links_per_user || 100;
    if ((count || 0) >= maxLinks) {
      return Response.json({ error: `Link limit reached (${maxLinks})` }, { status: 429 });
    }

    // Generate unique short code
    let shortCode = generateShortCode();
    let attempts = 0;
    while (attempts < 5) {
      const { data: existing } = await supabase
        .from("links")
        .select("id")
        .eq("short_code", shortCode)
        .single();
      if (!existing) break;
      shortCode = generateShortCode();
      attempts++;
    }

    // Create link
    const { data: link, error } = await supabase
      .from("links")
      .insert({
        short_code: shortCode,
        original_url: url,
        user_id: user.id,
        title: title || null,
      })
      .select()
      .single();

    if (error) {
      return Response.json({ error: "Failed to create link" }, { status: 500 });
    }

    // Create default steps based on global settings
    const defaultSteps = settings?.default_steps || 3;
    const defaultTimer = settings?.default_timer_seconds || 5;

    const steps = Array.from({ length: defaultSteps }, (_, i) => ({
      link_id: link.id,
      step_order: i + 1,
      timer_seconds: defaultTimer,
      button_text: i === defaultSteps - 1 ? "Go to Link" : "Continue",
    }));

    await supabase.from("link_steps").insert(steps);

    return Response.json({ link }, { status: 201 });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
