import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { comparePassword, generateToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 });
    }

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (!user.is_active) {
      return Response.json({ error: "Account is deactivated" }, { status: 403 });
    }

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
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
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  return Response.json({ success: true });
}
