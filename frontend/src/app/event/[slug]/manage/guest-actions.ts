"use server";

import { createClient } from "@/lib/supabase/server";
import { getCanManageEvent } from "@/lib/auth/can-manage-event";

type GuestActionResult = {
  success: boolean;
  error?: string;
};

type ExportGuestsResult = GuestActionResult & {
  csvData?: string;
};

/**
 * Update guest registration status
 * Uses RLS policies - user must be event organizer or admin
 */
export async function updateGuestStatus(
  guestId: string,
  isRegistered: boolean,
  slug: string
): Promise<GuestActionResult> {
  if (!guestId) {
    return { success: false, error: "Missing guestId" };
  }

  try {
    const canManage = await getCanManageEvent(slug);
    if (!canManage) {
      return { success: false, error: "Unauthorized" };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("registrants")
      .update({ is_registered: isRegistered })
      .eq("registrant_id", guestId);

    if (error) {
      console.error("Error updating guest status:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in updateGuestStatus:", error);
    return { success: false, error: "Failed to update status" };
  }
}

/**
 * Delete a guest from the event
 * Uses RLS policies - user must be event organizer or admin
 */
export async function deleteGuest(
  guestId: string,
  slug: string
): Promise<GuestActionResult> {
  if (!guestId) {
    return { success: false, error: "Missing guestId" };
  }

  try {
    const canManage = await getCanManageEvent(slug);
    if (!canManage) {
      return { success: false, error: "Unauthorized" };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("registrants")
      .delete()
      .eq("registrant_id", guestId);

    if (error) {
      console.error("Error deleting guest:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in deleteGuest:", error);
    return { success: false, error: "Failed to delete guest" };
  }
}

/**
 * Export guests to CSV format
 * Uses RLS policies - user must be event organizer or admin
 */
export async function exportGuestsToCSV(
  slug: string
): Promise<ExportGuestsResult> {
  try {
    const canManage = await getCanManageEvent(slug);
    if (!canManage) {
      return { success: false, error: "Unauthorized" };
    }

    const supabase = await createClient();
    
    // First get event_id from slug
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("event_id")
      .eq("slug", slug)
      .single();

    if (eventError || !event) {
      return { success: false, error: "Event not found" };
    }

    // RLS policies should allow organizers/admins to read registrants for their events
    const { data: guests, error } = await supabase
      .from("registrants")
      .select(`
        registrant_id,
        is_registered,
        terms_approval,
        form_answers,
        users:users_id (
          first_name,
          last_name,
          email
        )
      `)
      .eq("event_id", event.event_id);

    if (error) {
      console.error("Error fetching guests for export:", error);
      return { success: false, error: error.message };
    }

    if (!guests || guests.length === 0) {
      return { success: false, error: "No guests to export" };
    }

    // Generate CSV
    const headers = ["Name", "Email", "Status", "Terms Accepted"];
    const rows = guests.map((guest) => {
      // Supabase returns foreign key as array or single object, handle both
      const usersData = guest.users as unknown;
      const userData = Array.isArray(usersData) ? usersData[0] : usersData;
      const user = userData as { first_name: string; last_name: string; email: string } | null | undefined;
      
      return [
        `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
        user?.email || '',
        guest.is_registered ? "Registered" : "Pending",
        guest.terms_approval ? "Yes" : "No",
      ];
    });

    const csvData = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    return { success: true, csvData };
  } catch (error) {
    console.error("Error in exportGuestsToCSV:", error);
    return { success: false, error: "Failed to export guests" };
  }
}
