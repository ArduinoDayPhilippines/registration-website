import { createClient } from "@/lib/supabase/server";

/**
 * Server-only. Returns whether the current user can manage the event (edit, delete guests, etc.).
 * Uses JWT claims for admin check and database query for organizer check.
 * No admin client required - relies on RLS policies.
 */
export async function getCanManageEvent(slug: string): Promise<boolean> {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  // Check if user is admin via app_metadata (available in JWT)
  // This is set during user creation/update
  const userRole = user.app_metadata?.role as string | undefined;
  if (userRole === "admin") {
    return true;
  }

  // Check if user is the event organizer
  // RLS policies should allow users to read events they organize
  const { data: event } = await supabase
    .from("events")
    .select("organizer_id")
    .eq("slug", slug)
    .single();

  return event?.organizer_id === user.id;
}

/**
 * Alternative version that returns user info along with permission check
 * Useful when you need both the permission and user details
 */
export async function getManageEventContext(slug: string): Promise<{
  canManage: boolean;
  userId: string | null;
  isAdmin: boolean;
}> {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { canManage: false, userId: null, isAdmin: false };
  }

  const userRole = user.app_metadata?.role as string | undefined;
  const isAdmin = userRole === "admin";

  if (isAdmin) {
    return { canManage: true, userId: user.id, isAdmin: true };
  }

  const { data: event } = await supabase
    .from("events")
    .select("organizer_id")
    .eq("slug", slug)
    .single();

  const isOrganizer = event?.organizer_id === user.id;

  return {
    canManage: isOrganizer,
    userId: user.id,
    isAdmin: false,
  };
}
