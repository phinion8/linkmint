import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const offset = (page - 1) * limit;

    let query = supabase
      .from("links")
      .select("*, users!inner(name, email)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`short_code.ilike.%${search}%,original_url.ilike.%${search}%,title.ilike.%${search}%`);
    }

    const { data: links, count, error } = await query;

    if (error) {
      return Response.json({ error: "Failed to fetch links" }, { status: 500 });
    }

    return Response.json({
      links,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const { id, is_active } = await request.json();

    await supabase.from("links").update({ is_active }).eq("id", id);
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const { id } = await request.json();

    await supabase.from("links").delete().eq("id", id);
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
}
