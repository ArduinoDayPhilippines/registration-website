import { createClient } from "@/lib/supabase/server";
import { Guest } from "@/types/guest";

export async function getRegistrantByUserAndEvent(userId: string, eventId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("registrants")
    .select("registrant_id")
    .eq("users_id", userId)
    .eq("event_id", eventId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch registrant: ${error.message}`);
  }

  return data;
}

export async function createRegistrant(registrantData: {
  event_id: string;
  users_id: string;
  terms_approval: boolean;
  form_answers: Record<string, string>;
  is_registered: boolean;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("registrants")
    .insert(registrantData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create registrant: ${error.message}`);
  }

  return data;
}

export async function updateGuestStatus(guestId: string, isRegistered: boolean) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("registrants")
    .update({ is_registered: isRegistered })
    .eq("registrant_id", guestId)
    .select();

  if (error) throw new Error(`Failed to update guest status: ${error.message}`);
  return data;
}

export async function deleteGuest(guestId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("registrants")
    .delete()
    .eq("registrant_id", guestId);

  if (error) throw new Error(`Failed to delete guest: ${error.message}`);
}

export async function getRegistrantsByEvent(eventId: string): Promise<Guest[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("registrants")
    .select(`
      registrant_id,
      event_id,
      users_id,
      terms_approval,
      form_answers,
      is_registered,
      qr_url,
      users!users_id (
        first_name,
        last_name,
        email
      )
    `)
    .eq("event_id", eventId);

  if (error) {
    throw new Error(`Failed to fetch registrants: ${error.message}`);
  }

  return (data || []) as unknown as Guest[];
}
