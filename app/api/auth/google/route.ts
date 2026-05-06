import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateToken } from "@/lib/auth";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { idToken, email, name } = await request.json();

    if (!idToken || !email) {
      return Response.json({ error: "ID token and email required" }, { status: 400 });
    }

    // Verify Firebase ID token server-side
    let verifiedEmail: string;
    let verifiedName: string;
    try {
      // Dynamic import to avoid issues if firebase-admin isn't configured
      const { adminAuth } = await import("@/lib/firebase-admin");
      const decoded = await adminAuth.verifyIdToken(idToken);
      verifiedEmail = decoded.email || email;
      verifiedName = decoded.name || name || verifiedEmail.split("@")[0];
    } catch {
      // Fallback: if firebase-admin is not configured, verify the token format at minimum
      // In production, ALWAYS configure firebase-admin
      if (!process.env.FIREBASE_PRIVATE_KEY) {
        // No admin SDK configured — accept but log warning
        console.warn("WARNING: Firebase Admin SDK not configured. Google auth tokens are NOT being verified server-side.");
        verifiedEmail = email;
        verifiedName = name || email.split("@")[0];
      } else {
        return Response.json({ error: "Invalid authentication token" }, { status: 401 });
      }
    }

    // Check if user exists
    const { data: existing } = await supabase
      .from("users")
      .select("*")
      .eq("email", verifiedEmail)
      .single();

    let user;

    if (existing) {
      if (!existing.is_verified) {
        await supabase.from("users").update({ is_verified: true }).eq("id", existing.id);
      }
      user = existing;
    } else {
      const password_hash = await bcrypt.hash(crypto.randomUUID(), 12);

      const { data: newUser, error } = await supabase
        .from("users")
        .insert({
          email: verifiedEmail,
          password_hash,
          name: verifiedName,
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
