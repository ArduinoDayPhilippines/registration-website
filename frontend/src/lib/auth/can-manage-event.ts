import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Server-only. Returns whether the current user can manage the event (edit, delete guests, etc.).
 * Uses auth.users: role and raw_app_meta_data->>'role' for admin; otherwise checks organizer_id.
 */
export async function getCanManageEvent(slug: string): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const adminClient = createAdminClient();

  // Check auth.users: role and app_metadata.role (raw_app_meta_data->>'role')
  const { data: adminData } = await adminClient.auth.admin.getUserById(user.id);
  const authUser = adminData?.user;
  if (authUser) {
    const appRole = (authUser.app_metadata?.role as string) ?? null;
    const jwtRole = authUser.role ?? null;
    if (appRole === "admin" || jwtRole === "admin") return true;
  }

  // Not admin: check if user is the event organizer
  const { data: event } = await adminClient
    .from("events")
    .select("organizer_id")
    .eq("slug", slug)
    .single();

  return event?.organizer_id === user.id;
}
