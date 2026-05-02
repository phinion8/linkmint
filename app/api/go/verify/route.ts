import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { sessionToken, step } = await request.json();

    if (!sessionToken || !step) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    // Get session
    const { data: session } = await supabase
      .from("visit_sessions")
      .select("*")
      .eq("session_token", sessionToken)
      .single();

    if (!session) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    // Check expiry
    if (new Date(session.expires_at) < new Date()) {
      return Response.json({ error: "Session expired" }, { status: 410 });
    }

    // Verify step order
    if (session.current_step !== step) {
      return Response.json({ error: "Invalid step" }, { status: 400 });
    }

    // Server-side timer validation: check session was created long enough ago
    // For multi-step, we check that enough time has passed since session creation
    // A more precise approach would track per-step timestamps
    const { data: stepConfig } = await supabase
      .from("link_steps")
      .select("timer_seconds")
      .eq("link_id", session.link_id)
      .eq("step_order", step)
      .single();

    const requiredSeconds = stepConfig?.timer_seconds || 5;
    const sessionAge = (Date.now() - new Date(session.created_at).getTime()) / 1000;

    // Calculate minimum time: sum of all previous steps' timers + current step timer
    const { data: previousSteps } = await supabase
      .from("link_steps")
      .select("timer_seconds")
      .eq("link_id", session.link_id)
      .lte("step_order", step);

    const minTime = (previousSteps || []).reduce((sum, s) => sum + s.timer_seconds, 0) - requiredSeconds;
    // Allow 1 second grace for network latency
    if (sessionAge < minTime + requiredSeconds - 1) {
      return Response.json({ error: "Timer not completed" }, { status: 400 });
    }

    // Check if this is the last step
    if (step >= session.total_steps) {
      // Mark session as completed
      await supabase
        .from("visit_sessions")
        .update({ completed: true, current_step: step })
        .eq("id", session.id);

      // Get the original URL
      const { data: link } = await supabase
        .from("links")
        .select("original_url")
        .eq("id", session.link_id)
        .single();

      return Response.json({ redirect: link?.original_url || "/" });
    }

    // Advance to next step
    await supabase
      .from("visit_sessions")
      .update({ current_step: step + 1 })
      .eq("id", session.id);

    return Response.json({ nextStep: step + 1 });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
