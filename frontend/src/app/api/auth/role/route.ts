import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/auth/role
 * Returns the current user's role from auth.users (role, raw_app_meta_data->>'role')
 * with fallback to public.users.role so admin is recognized either way.
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

    let isAdmin = false;

    try {
      const adminClient = createAdminClient();
      const { data: adminData, error: adminError } =
        await adminClient.auth.admin.getUserById(user.id);

      if (!adminError && adminData?.user) {
        const authUser = adminData.user;
        const appRole = (authUser.app_metadata?.role as string) ?? null;
        const jwtRole = authUser.role ?? null;
        isAdmin = appRole === "admin" || jwtRole === "admin";
      }
    } catch {
      // Admin client may be missing (e.g. no SUPABASE_SERVICE_ROLE_KEY); use fallback
    }

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
