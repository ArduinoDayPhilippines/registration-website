"use server";

import { eventManage } from "../../app/event/[slug]/manage/actions";

export async function updateGuestStatus(
  guestId: string,
  isRegistered: boolean,
  slug: string
): Promise<{ success: boolean; error?: string }> {
  const formData = new FormData();
  formData.append("operation", "updateGuestStatus");
  formData.append("slug", slug);
  formData.append("guestId", guestId);
  formData.append("isRegistered", String(isRegistered));

  try {
    const result = await eventManage(formData) as { success: boolean; error?: string } | undefined;
    console.log("updateGuestStatus result:", result);
    return result || { success: false, error: "No response from server" };
  } catch (error) {
    console.error("Error updating guest status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function deleteGuest(
  guestId: string,
  slug: string
): Promise<{ success: boolean; error?: string }> {
  const formData = new FormData();
  formData.append("operation", "deleteGuest");
  formData.append("slug", slug);
  formData.append("guestId", guestId);

  try {
    const result = await eventManage(formData) as { success: boolean; error?: string } | undefined;
    console.log("deleteGuest result:", result);
    return result || { success: false, error: "No response from server" };
  } catch (error) {
    console.error("Error deleting guest:", error);
    return { success: false, error: "Failed to delete guest" };
  }
}

export async function exportGuestsToCSV(
  slug: string
): Promise<{ success: boolean; error?: string; csvData?: string }> {
  const formData = new FormData();
  formData.append("operation", "exportGuestsToCSV");
  formData.append("slug", slug);

  try {
    const result = (await eventManage(formData)) as
      | { success: boolean; error?: string; csvData?: string }
      | undefined;
    if (result?.success && result.csvData) {
      return result;
    }
    return { success: false, error: result?.error ?? "Export not implemented" };
  } catch (error) {
    console.error("Error exporting guests:", error);
    return { success: false, error: "Failed to export guests" };
  }
}
