"use server";

import { createClient } from "@/lib/supabase/server";
import { SurveyConfig } from "@/types/survey";
import { revalidatePath } from "next/cache";

export async function saveEventSurvey(slug: string, surveyData: SurveyConfig) {
  const supabase = await createClient();

  // 1. Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // 2. Authorization Check
  // Fetch event to verify ownership
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("organizer_id")
    .eq("slug", slug)
    .single();

  if (eventError || !event) {
    throw new Error("Event not found");
  }

  const isOrganizer = event.organizer_id === user.id;

  if (!isOrganizer) {
    throw new Error("Forbidden: You must be the event organizer.");
  }

  // 3. Update the event's survey configuration
  const { error } = await supabase
    .from("events")
    .update({
      post_event_survey: surveyData,
    })
    .eq("slug", slug);

  if (error) {
    console.error("Error saving survey:", error);
    throw new Error("Failed to save survey configuration");
  }

  // 4. Revalidate the manage page to reflect changes
  revalidatePath(`/event/${slug}/manage`);

  return { success: true };
}
