import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { supabase, User } from "./supabase";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const TOKEN_EXPIRY = "7d";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(user: Pick<User, "id" | "email" | "role">): string {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role } as JwtPayload,
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", payload.userId)
    .single();

  return data as User | null;
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth();
  if (user.role !== "admin") {
    throw new Error("Forbidden");
  }
  return user;
}
