import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const { data: users, count, error } = await supabase
      .from("users")
      .select("id, email, name, role, is_active, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return Response.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    // Get link counts per user
    const userIds = (users || []).map((u) => u.id);
    const { data: linkCounts } = await supabase
      .from("links")
      .select("user_id")
      .in("user_id", userIds);

    const countMap: Record<string, number> = {};
    (linkCounts || []).forEach((l) => {
      countMap[l.user_id] = (countMap[l.user_id] || 0) + 1;
    });

    const usersWithCounts = (users || []).map((u) => ({
      ...u,
      link_count: countMap[u.id] || 0,
    }));

    return Response.json({
      users: usersWithCounts,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
}
