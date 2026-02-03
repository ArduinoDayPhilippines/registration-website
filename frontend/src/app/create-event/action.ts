"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/auth";

export async function createEvent(formData: any) {
  // Verify admin is logged in
  const cookieStore = await cookies();
  const authToken = cookieStore.get(AUTH_COOKIE);
  
  if (!authToken) {
    throw new Error("Unauthorized: Please login first");
  }

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

  
  if (!title || !startDate || !startTime || !location) {
    throw new Error("Missing required fields");
  }

  const supabase = createAdminClient();

  // Get the authenticated user from Supabase
  const { data: { user }, error: userError } = await supabase.auth.getUser(authToken.value);
  
  if (userError || !user) {
    throw new Error("Invalid authentication");
  }

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