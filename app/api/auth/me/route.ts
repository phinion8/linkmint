import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }
    return Response.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
