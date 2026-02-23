import { getEventIdAndApprovalBySlug } from "@/repositories/eventRepository";
import { getRegistrantByUserAndEvent, createRegistrant } from "@/repositories/registrantRepository";

export async function registerForEvent({
  event_id,
  user_id,
  terms_approval,
  form_answers,
}: {
  event_id: string;
  user_id: string;
  terms_approval?: boolean;
  form_answers: Record<string, string>;
}) {
  if (!event_id || !user_id) {
    throw new Error("Missing required fields");
  }

  const eventData = await getEventIdAndApprovalBySlug(event_id);
  if (!eventData) {
    throw new Error("Event not found");
  }

  const is_registered = !eventData.require_approval;

  const existingRegistrant = await getRegistrantByUserAndEvent(user_id, eventData.event_id);
  if (existingRegistrant) {
    throw new Error("You have already registered for this event");
  }

  const data = await createRegistrant({
    event_id: eventData.event_id,
    users_id: user_id,
    terms_approval: terms_approval || true,
    form_answers,
    is_registered,
  });

  return {
    success: true,
    registrant: data,
    message: is_registered ? "Registration successful" : "Registration pending approval",
  };
}


export async function updateGuestStatus(guestId: string, isRegistered: boolean) {
  const { updateGuestStatus } = await import("@/repositories/registrantRepository");
  return await updateGuestStatus(guestId, isRegistered);
}

export async function deleteGuest(guestId: string) {
  const { deleteGuest } = await import("@/repositories/registrantRepository");
  return await deleteGuest(guestId);
}

// Implement other registrant-related service functions here, such as getRegistrant, updateRegistrant, deleteRegistrant, listRegistrantsByEvent, etc, if there is
