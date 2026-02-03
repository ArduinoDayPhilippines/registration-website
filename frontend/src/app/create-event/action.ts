"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/utils/slug";
import type { EventFormData } from "@/types/event";

type CreateEventFormData = EventFormData;

export async function createEvent(formData: CreateEventFormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to create an event.");
  }

  const {
    title,
    startDate,
    startTime,
    endDate,
    endTime,
    location,
    description,
    ticketPrice,
    requireApproval,
    capacity,
    questions,
  } = formData;

  const parsedCapacity =
    capacity && capacity !== "Unlimited" ? parseInt(capacity) : null;
  const parsedQuestions = questions || [];

  const slug = generateSlug(title);

  const { error: insertError } = await supabase
    .from("events")
    .insert({
      organizer_id: user.id,
      event_name: title,
      slug,
      start_date: new Date(`${startDate}T${startTime}`).toISOString(),
      end_date:
        endDate && endTime
          ? new Date(`${endDate}T${endTime}`).toISOString()
          : null,
      location,
      description: description || null,
      price: ticketPrice || "free",
      capacity: parsedCapacity,
      require_approval: requireApproval || false,
      form_questions: parsedQuestions,
      status: "upcoming",
    })
    .select()
    .single();

  if (insertError) {
    console.error("Insert error:", insertError);
    throw new Error(`Failed to create event: ${insertError.message}`);
  }

  revalidatePath("/dashboard");
  redirect(`/event/${slug}`);
}
