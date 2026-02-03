"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Question } from "@/types/event";
import { Guest, GuestStats } from "@/types/guest";

export async function updateEventDetails(
  slug: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const startDate = formData.get("startDate") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const location = formData.get("location") as string;
    const capacity = formData.get("capacity") as string;
    const ticketPrice = formData.get("ticketPrice") as string;

    if (!title?.trim()) {
      return { success: false, error: "Event title is required" };
    }

    if (!startDate || !startTime) {
      return { success: false, error: "Start date and time are required" };
    }

    console.log("Updating event details:", {
      slug,
      title,
      description,
      startDate,
      startTime,
      endTime,
      location,
      capacity,
      ticketPrice,
    });

    revalidatePath(`/event/${slug}`);
    revalidatePath(`/event/${slug}/manage`);

    return { success: true };
  } catch (error) {
    console.error("Error updating event details:", error);
    return { success: false, error: "Failed to update event details" };
  }
}

export async function addRegistrationQuestion(
  slug: string,
  question: { text: string; required: boolean }
): Promise<{ success: boolean; error?: string; question?: Question }> {
  try {
    if (!question.text?.trim()) {
      return { success: false, error: "Question text is required" };
    }

    const newQuestion: Question = {
      id: Date.now(),
      text: question.text,
      required: question.required,
    };

    console.log("Adding question to event:", slug, newQuestion);

    revalidatePath(`/event/${slug}/manage`);

    return { success: true, question: newQuestion };
  } catch (error) {
    console.error("Error adding question:", error);
    return { success: false, error: "Failed to add question" };
  }
}

export async function updateRegistrationQuestion(
  slug: string,
  questionId: number,
  updates: { text?: string; required?: boolean }
): Promise<{ success: boolean; error?: string }> {
  try {
    if (updates.text !== undefined && !updates.text?.trim()) {
      return { success: false, error: "Question text cannot be empty" };
    }

    console.log("Updating question:", questionId, updates);

    revalidatePath(`/event/${slug}/manage`);

    return { success: true };
  } catch (error) {
    console.error("Error updating question:", error);
    return { success: false, error: "Failed to update question" };
  }
}

export async function removeRegistrationQuestion(
  slug: string,
  questionId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("Removing question:", questionId, "from event:", slug);

    revalidatePath(`/event/${slug}/manage`);

    return { success: true };
  } catch (error) {
    console.error("Error removing question:", error);
    return { success: false, error: "Failed to remove question" };
  }
}

export async function updateEventSettings(
  slug: string,
  settings: { requireApproval?: boolean }
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("Updating event settings:", slug, settings);

    revalidatePath(`/event/${slug}/manage`);
    revalidatePath(`/event/${slug}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating event settings:", error);
    return { success: false, error: "Failed to update event settings" };
  }
}

export async function deleteEvent(
  slug: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("Deleting event:", slug);

    revalidatePath("/");
    redirect("/");
  } catch (error) {
    console.error("Error deleting event:", error);
    return { success: false, error: "Failed to delete event" };
  }
}

export async function updateEventCoverImage(
  slug: string,
  coverImage: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!coverImage) {
      return { success: false, error: "Cover image is required" };
    }

    console.log("Updating cover image for event:", slug);

    revalidatePath(`/event/${slug}`);
    revalidatePath(`/event/${slug}/manage`);

    return { success: true };
  } catch (error) {
    console.error("Error updating cover image:", error);
    return { success: false, error: "Failed to update cover image" };
  }
}

export async function duplicateEvent(
  slug: string
): Promise<{ success: boolean; error?: string; newSlug?: string }> {
  try {
    console.log("Duplicating event:", slug);

    const newSlug = `${slug}-copy`;

    revalidatePath("/");

    return { success: true, newSlug };
  } catch (error) {
    console.error("Error duplicating event:", error);
    return { success: false, error: "Failed to duplicate event" };
  }
}

export async function updateEventCapacity(
  slug: string,
  capacity: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("Updating event capacity:", slug, capacity);

    revalidatePath(`/event/${slug}`);
    revalidatePath(`/event/${slug}/manage`);

    return { success: true };
  } catch (error) {
    console.error("Error updating event capacity:", error);
    return { success: false, error: "Failed to update event capacity" };
  }
}

export async function toggleEventVisibility(
  slug: string,
  isPublished: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("Toggling event visibility:", slug, isPublished);

    revalidatePath(`/event/${slug}`);
    revalidatePath(`/event/${slug}/manage`);
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error toggling event visibility:", error);
    return { success: false, error: "Failed to update event visibility" };
  }
}

export async function getEventGuests(
  slug: string
): Promise<{ success: boolean; guests?: Guest[]; error?: string }> {
  try {
    console.log("Fetching guests for event:", slug);

    const mockGuests: Guest[] = [];

    return { success: true, guests: mockGuests };
  } catch (error) {
    console.error("Error fetching guests:", error);
    return { success: false, error: "Failed to fetch guests" };
  }
}

export async function getGuestStatistics(
  slug: string
): Promise<{ success: boolean; stats?: GuestStats; error?: string }> {
  try {
    console.log("Fetching guest statistics for event:", slug);

    const stats: GuestStats = {
      totalRegistered: 0,
      going: 0,
      checkedIn: 0,
      waitlist: 0,
    };

    return { success: true, stats };
  } catch (error) {
    console.error("Error fetching guest statistics:", error);
    return { success: false, error: "Failed to fetch guest statistics" };
  }
}

export async function updateGuestStatus(
  guestId: string,
  status: "pending" | "approved" | "rejected" | "checked_in"
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("Updating guest status:", guestId, status);

    return { success: true };
  } catch (error) {
    console.error("Error updating guest status:", error);
    return { success: false, error: "Failed to update guest status" };
  }
}

export async function deleteGuest(
  guestId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("Deleting guest:", guestId);

    return { success: true };
  } catch (error) {
    console.error("Error deleting guest:", error);
    return { success: false, error: "Failed to delete guest" };
  }
}

export async function exportGuestsToCSV(
  slug: string
): Promise<{ success: boolean; csvData?: string; error?: string }> {
  try {
    console.log("Exporting guests to CSV for event:", slug);

    const result = await getEventGuests(slug);

    if (!result.success || !result.guests) {
      return { success: false, error: "Failed to fetch guests" };
    }

    const headers = [
      "Email",
      "First Name",
      "Last Name",
      "Status",
      "Registered At",
    ];
    const rows = result.guests.map((guest) => [
      guest.email,
      guest.firstName,
      guest.lastName,
      guest.status,
      new Date(guest.createdAt).toLocaleDateString(),
    ]);

    const csvData = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    return { success: true, csvData };
  } catch (error) {
    console.error("Error exporting guests:", error);
    return { success: false, error: "Failed to export guests" };
  }
}
