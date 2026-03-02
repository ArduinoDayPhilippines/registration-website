import { getRegistrantsByEvent } from "@/repositories/registrantRepository";
import { getEventIdAndApprovalBySlug } from "@/repositories/eventRepository";

export interface ExportGuestsResult {
  success: boolean;
  csvData?: string;
  error?: string;
}

export async function exportGuestsToCSV(slug: string): Promise<ExportGuestsResult> {
  try {
    const event = await getEventIdAndApprovalBySlug(slug);
    if (!event) {
      return { success: false, error: "Event not found" };
    }

    const guests = await getRegistrantsByEvent(event.event_id);

    if (!guests || guests.length === 0) {
      return { success: false, error: "No guests to export" };
    }

    const headers = ["Name", "Email", "Status", "Terms Accepted"];
    const rows = guests.map((guest) => {
      const user = guest.users;
      
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
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to export guests" 
    };
  }
}
