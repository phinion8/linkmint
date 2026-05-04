import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";

// GET — fetch user's own tickets
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { data: tickets } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    return Response.json({ tickets: tickets || [] });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// POST — create a new ticket (works for logged-in and guest users)
export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    // Try to get current user (optional — guests can also submit)
    let userId = null;
    try {
      const user = await getCurrentUser();
      if (user) userId = user.id;
    } catch { /* guest submission */ }

    const { data: ticket, error } = await supabase
      .from("support_tickets")
      .insert({ user_id: userId, name, email, subject, message })
      .select()
      .single();

    if (error) {
      return Response.json({ error: "Failed to create ticket" }, { status: 500 });
    }

    // Send email notification
    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: process.env.WEB3FORMS_KEY || "",
          to: "priyanshuverma8328@gmail.com",
          subject: `[LinkPearl Support] ${subject} — Ticket #${ticket.id.slice(0, 8)}`,
          from_name: name,
          reply_to: email,
          message: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n\nTicket ID: ${ticket.id}`,
        }),
      });
    } catch { /* email send failed silently */ }

    return Response.json({ ticket }, { status: 201 });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
