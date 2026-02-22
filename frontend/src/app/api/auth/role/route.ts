import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/auth/role
 * Returns the current user's role from JWT app_metadata with fallback to public.users.role
 * No admin client required - uses JWT claims and regular queries with RLS
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ role: null, userId: null });
    }

    // Check app_metadata from JWT token (no admin client needed)
    // This is populated during user creation/update
    const appRole = user.app_metadata?.role as string | undefined;
    let isAdmin = appRole === "admin";

    // Fallback: check public.users.role if not found in JWT
    if (!isAdmin) {
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("users_id", user.id)
        .maybeSingle();
      isAdmin = (profile?.role as string) === "admin";
    }

    return NextResponse.json({
      role: isAdmin ? "admin" : "user",
      userId: user.id,
    });
  } catch (err) {
    console.error("auth/role:", err);
    return NextResponse.json(
      { role: null, userId: null, error: "Failed to get role" },
      { status: 500 }
    );
  }
}
