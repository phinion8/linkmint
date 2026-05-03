import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateToken } from "@/lib/auth";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, name, firebaseUid } = await request.json();

    if (!email || !name) {
      return Response.json({ error: "Email and name required" }, { status: 400 });
    }

    // Check if user exists
    const { data: existing } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    let user;

    if (existing) {
      // Existing user — mark as verified and login
      if (!existing.is_verified) {
        await supabase.from("users").update({ is_verified: true }).eq("id", existing.id);
      }
      user = existing;
    } else {
      // New user — create account (Google users are auto-verified)
      const password_hash = await bcrypt.hash(firebaseUid + email, 12);

      const { data: newUser, error } = await supabase
        .from("users")
        .insert({
          email,
          password_hash,
          name,
          role: "publisher",
          is_verified: true,
        })
        .select()
        .single();

      if (error) {
        return Response.json({ error: "Failed to create account" }, { status: 500 });
      }
      user = newUser;
    }

    // Generate JWT and set cookie
    const token = generateToken(user);
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return Response.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
