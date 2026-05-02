import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { supabase } from "@/lib/supabase";
import { generateSessionToken } from "@/lib/utils";
import StepPage from "@/components/StepPage";

export default async function InterstitialPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ s?: string }>;
}) {
  const { code } = await params;
  const { s: sessionTokenParam } = await searchParams;

  // Look up the link
  const { data: link } = await supabase
    .from("links")
    .select("*")
    .eq("short_code", code)
    .eq("is_active", true)
    .single();

  if (!link) {
    redirect("/");
  }

  // Get steps for this link
  const { data: steps } = await supabase
    .from("link_steps")
    .select("*")
    .eq("link_id", link.id)
    .order("step_order", { ascending: true });

  if (!steps || steps.length === 0) {
    // No steps configured, redirect directly
    redirect(link.original_url);
  }

  let session;

  if (sessionTokenParam) {
    // Existing session - get current step
    const { data: existingSession } = await supabase
      .from("visit_sessions")
      .select("*")
      .eq("session_token", sessionTokenParam)
      .single();

    if (existingSession && !existingSession.completed && new Date(existingSession.expires_at) > new Date()) {
      session = existingSession;
    }
  }

  if (!session) {
    // New visit - log click and create session
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || null;
    const userAgent = headersList.get("user-agent") || null;
    const referer = headersList.get("referer") || null;

    // Detect device type from user agent
    let deviceType = "desktop";
    if (userAgent) {
      if (/mobile/i.test(userAgent)) deviceType = "mobile";
      else if (/tablet|ipad/i.test(userAgent)) deviceType = "tablet";
    }

    // Log click
    const { data: click } = await supabase
      .from("clicks")
      .insert({
        link_id: link.id,
        ip_address: ip,
        user_agent: userAgent,
        referrer: referer,
        device_type: deviceType,
      })
      .select()
      .single();

    // Create visit session
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min expiry

    const { data: newSession } = await supabase
      .from("visit_sessions")
      .insert({
        link_id: link.id,
        click_id: click?.id || null,
        session_token: sessionToken,
        current_step: 1,
        total_steps: steps.length,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    session = newSession;
  }

  if (!session) {
    redirect("/");
  }

  // If session is completed, redirect to destination
  if (session.completed) {
    redirect(link.original_url);
  }

  // Get current step config
  const currentStepConfig = steps.find((s: { step_order: number }) => s.step_order === session.current_step) || steps[0];

  return (
    <StepPage
      sessionToken={session.session_token}
      shortCode={code}
      stepNumber={session.current_step}
      totalSteps={session.total_steps}
      timerSeconds={currentStepConfig.timer_seconds}
      buttonText={currentStepConfig.button_text}
      adHtml={currentStepConfig.ad_html}
      linkTitle={link.title}
    />
  );
}
