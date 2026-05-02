import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { hashPassword, generateToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return Response.json({ error: "Email, password, and name are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return Response.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Check if user exists
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return Response.json({ error: "Email already registered" }, { status: 409 });
    }

    const password_hash = await hashPassword(password);

    const { data: user, error } = await supabase
      .from("users")
      .insert({ email, password_hash, name, role: "publisher" })
      .select()
      .single();

    if (error) {
      return Response.json({ error: "Failed to create account" }, { status: 500 });
    }

    const token = generateToken(user);
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return Response.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("Register error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
