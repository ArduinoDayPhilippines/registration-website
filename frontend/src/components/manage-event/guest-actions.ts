"use server";

import { updateGuestStatusAction, deleteGuestAction } from "@/actions/registrantActions";

export async function updateGuestStatus(
  guestId: string,
  isRegistered: boolean,
  slug: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await updateGuestStatusAction({ guestId, isRegistered }, slug);
    console.log("updateGuestStatus result:", result);
    return result;
  } catch (error) {
    console.error("Error updating guest status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function deleteGuest(
  guestId: string,
  slug: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await deleteGuestAction({ guestId }, slug);
    console.log("deleteGuest result:", result);
    return result;
  } catch (error) {
    console.error("Error deleting guest:", error);
    return { success: false, error: "Failed to delete guest" };
  }
}

export async function exportGuestsToCSV(
  slug: string
): Promise<{ success: boolean; error?: string; csvData?: string }> {
  // Not implemented on the backend yet
  return { success: false, error: "Export not implemented" };
}
