import { getRegistrantsByEvent } from "@/repositories/registrantRepository";
import { getEventIdAndApprovalBySlug, getEventFormQuestions } from "@/repositories/eventRepository";

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

    const [guests, formQuestions] = await Promise.all([
      getRegistrantsByEvent(event.event_id),
      getEventFormQuestions(slug),
    ]);

    if (!guests || guests.length === 0) {
      return { success: false, error: "No guests to export" };
    }

    const orderedKeys = formQuestions.map((q) => q.text);
    const extraKeys = Array.from(
      new Set(
        guests.flatMap((guest) =>
          guest.form_answers ? Object.keys(guest.form_answers) : []
        )
      )
    ).filter((k) => !orderedKeys.includes(k));
    const allQuestionKeys = [...orderedKeys, ...extraKeys];

    const headers = ["Name", "Email", "Status", "Registered At", "Checked In", "Terms Accepted", ...allQuestionKeys];

    const formatRegisteredAt = (value?: string | null) => {
      if (!value) return "";
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) return value;
      return parsed.toLocaleString("en-PH", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    };

    const rows = guests.map((guest) => {
      const user = guest.users;
      const baseRow = [
        `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
        user?.email || '',
        guest.is_registered ? "Registered" : "Pending",
        formatRegisteredAt(guest.created_at),
        guest.check_in ? "Yes" : "No",
        guest.terms_approval ? "Yes" : "No",
      ];
      const answerCols = allQuestionKeys.map(
        (q) => (guest.form_answers?.[q] ?? "")
      );
      return [...baseRow, ...answerCols];
    });

    const csvData = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
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
