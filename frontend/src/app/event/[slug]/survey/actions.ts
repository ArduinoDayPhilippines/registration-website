"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitSurveyResponse(
  slug: string,
  answers: Record<string, any>,
) {
  const supabase = await createClient();

  // 0. Get Authenticated User
  // We need the user to be logged in to verify they are the one submitting
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to submit a survey.");
  }

  // Use authenticated user's email
  let userEmail = user.email;

  // Fallback: fetch from users table if auth email is missing (unlikely but possible)
  if (!userEmail) {
    const { data: userData } = await supabase
      .from("users")
      .select("email")
      .eq("users_id", user.id)
      .single();
    userEmail = userData?.email;
  }

  if (!userEmail) {
    throw new Error("Could not determine user email.");
  }

  const normalizedEmail = userEmail.toLowerCase().trim();

  // 1. Get Event ID from Slug
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("event_id, post_event_survey")
    .eq("slug", slug)
    .single();

  if (eventError || !event) {
    console.error("Error fetching event:", eventError);
    throw new Error("Event not found");
  }

  // 2. Validate if survey is enabled
  const surveyConfig = event.post_event_survey;
  // @ts-ignore
  if (!surveyConfig?.isEnabled) {
    throw new Error("Survey is not active for this event.");
  }

  // 3. Verify Registrant (Only registered users can answer)
  // Rely on RLS: User should only be able to see their own guest record
  const { data: registration, error: regError } = await supabase
    .from("registrants")
    .select("registrant_id")
    .eq("event_id", event.event_id)
    .eq("users_id", user.id)
    .in("terms_approval", [true])
    .maybeSingle();

  if (regError) {
    console.error("Error verifying registration:", regError);
  }

  if (!registration) {
    return {
      error: "You must be a registered attendee to answer this survey.",
    };
  }

  // 4. Check duplicate submission / Upsert logic
  const { data: existingResponse } = await supabase
    .from("survey_responses")
    .select("survey_responses_id")
    .eq("event_id", event.event_id)
    .eq("users_id", user.id)
    .maybeSingle();

  if (existingResponse) {
    // Update existing response
    const { error: updateError } = await supabase
      .from("survey_responses")
      .update({
        answers: answers,
      })
      .eq("survey_responses_id", existingResponse.survey_responses_id);

    if (updateError) {
      console.error("Error updating survey:", updateError);
      throw new Error("Failed to update survey response");
    }
  } else {
    // 5. Insert New Response
    const { error: insertError } = await supabase
      .from("survey_responses")
      .insert({
        event_id: event.event_id,
        users_id: user.id,
        answers: answers,
      });

    if (insertError) {
      console.error("Error submitting survey:", insertError);
      throw new Error("Failed to submit survey");
    }
  }

  // Revalidate the manage page
  revalidatePath(`/event/${slug}/manage`);

  return { success: true };
}
