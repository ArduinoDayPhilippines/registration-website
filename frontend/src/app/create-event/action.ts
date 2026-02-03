"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createEvent(formData: any) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const {
    title,
    startDate,
    startTime,
    endDate,
    endTime,
    location,
    description,
    coverImage,
    ticketPrice,
    requireApproval,
    capacity,
    registrationQuestions,
  } = formData;

  const parsedCapacity = capacity && capacity !== "Unlimited" ? parseInt(capacity) : null;
  const parsedQuestions = registrationQuestions || [];

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const { data, error: insertError } = await supabase
    .from("events")
    .insert({
      organizer_id: user.id,
      event_name: title,
      start_date: new Date(`${startDate}T${startTime}`).toISOString(),
      end_date: endDate && endTime ? new Date(`${endDate}T${endTime}`).toISOString() : null,
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
  redirect(`/event/${slug}/manage`);
}