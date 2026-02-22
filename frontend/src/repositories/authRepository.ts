import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }
  return user;
}

export async function getAdminUserById(userId: string) {
  try {
    const adminClient = createAdminClient();
    const { data: adminData, error: adminError } =
      await adminClient.auth.admin.getUserById(userId);

    if (!adminError && adminData?.user) {
      return adminData.user;
    }
  } catch {
    // Admin client may be missing
  }
  return null;
}
