"use server";

import { 
  EventSlugSchema, 
  UpdateEventDetailsSchema, 
  UpdateEventSettingsSchema, 
  RegistrationQuestionSchema,
  CreateEventSchema
} from "@/validators/eventValidators";
import { 
  getEventDetails, 
  listAllEvents, 
  updateEventDetails, 
  updateEventSettings, 
  addRegistrationQuestion, 
  updateRegistrationQuestion, 
  removeRegistrationQuestion,
  createEvent
} from "@/services/eventService";
import { logger } from "@/utils/logger";
import { canManageEvent } from "@/services/authService";
import { revalidatePath } from "next/cache";

export async function getEventAction(slug: string) {
  try {
    const validatedData = EventSlugSchema.parse({ slug });
    const event = await getEventDetails(validatedData.slug);
    
    logger.info(`Fetched event details for slug: ${slug}`);
    return { success: true, event };
  } catch (error: any) {
    logger.error(`Failed to get event details for slug: ${slug}`, error);
    if (error.message.includes("not found")) {
       return { success: false, error: "Event not found" };
    }
    return { success: false, error: error.message || "Failed to get event" };
  }
}

export async function listEventsAction() {
  try {
    const data = await listAllEvents();
    logger.info("Fetched all events list");
    return { success: true, data };
  } catch (error: any) {
    logger.error("Failed to list events", error);
    return { success: false, error: error.message || "Failed to list events" };
  }
}

export async function updateEventDetailsAction(data: any) {
  try {
    const validatedData = UpdateEventDetailsSchema.parse(data);
    const { slug, ...details } = validatedData;
    
    if (!(await canManageEvent(slug))) {
      logger.warn(`Unauthorized event details update attempt for slug: ${slug}`);
      return { success: false, error: "Unauthorized" };
    }

    const { startDate, startTime, endTime } = details;
    const startDateTime = startDate && startTime ? new Date(`${startDate}T${startTime}`).toISOString() : undefined;
    const endDateTime = startDate && endTime ? new Date(`${startDate}T${endTime}`).toISOString() : undefined;

    const mappedDetails = {
      event_name: details.title,
      description: details.description,
      location: details.location,
      price: details.ticketPrice,
      capacity: details.capacity ? Number(details.capacity) : null,
      require_approval: details.requireApproval,
      modified_at: new Date().toISOString(),
    };
    
    if (startDateTime) Object.assign(mappedDetails, { start_date: startDateTime });
    if (endDateTime) Object.assign(mappedDetails, { end_date: endDateTime });

    await updateEventDetails(slug, mappedDetails);
    revalidatePath(`/event/${slug}/manage`);
    logger.info(`Updated event details for slug: ${slug}`);
    return { success: true };
  } catch (error: any) {
    logger.error("Failed to update event details", error);
    return { success: false, error: error.message || "Failed to update details" };
  }
}

export async function updateEventSettingsAction(data: any) {
  try {
    const validatedData = UpdateEventSettingsSchema.parse(data);
    
    if (!(await canManageEvent(validatedData.slug))) {
      return { success: false, error: "Unauthorized" };
    }

    await updateEventSettings(validatedData.slug, validatedData.requireApproval);
    revalidatePath(`/event/${validatedData.slug}/manage`);
    logger.info(`Updated event settings for slug: ${validatedData.slug}`);
    return { success: true };
  } catch (error: any) {
    logger.error("Failed to update event settings", error);
    return { success: false, error: error.message || "Failed to update settings" };
  }
}

export async function addRegistrationQuestionAction(data: any) {
  try {
    const validatedData = RegistrationQuestionSchema.parse(data);
    
    if (!(await canManageEvent(validatedData.slug))) {
      return { success: false, error: "Unauthorized" };
    }

    if (!validatedData.text) throw new Error("Question text is required");

    await addRegistrationQuestion(validatedData.slug, validatedData.text, !!validatedData.required);
    revalidatePath(`/event/${validatedData.slug}/manage`);
    logger.info(`Added registration question for slug: ${validatedData.slug}`);
    return { success: true };
  } catch (error: any) {
    logger.error("Failed to add registration question", error);
    return { success: false, error: error.message || "Failed to add question" };
  }
}

export async function updateRegistrationQuestionAction(data: any) {
  try {
    const validatedData = RegistrationQuestionSchema.parse(data);
    
    if (!(await canManageEvent(validatedData.slug))) {
      return { success: false, error: "Unauthorized" };
    }

    if (!validatedData.questionId || !validatedData.text) throw new Error("Question ID and text are required");

    await updateRegistrationQuestion(validatedData.slug, validatedData.questionId, validatedData.text, !!validatedData.required);
    revalidatePath(`/event/${validatedData.slug}/manage`);
    logger.info(`Updated registration question ${validatedData.questionId} for slug: ${validatedData.slug}`);
    return { success: true };
  } catch (error: any) {
    logger.error("Failed to update registration question", error);
    return { success: false, error: error.message || "Failed to update question" };
  }
}

export async function removeRegistrationQuestionAction(data: any) {
  try {
    const validatedData = RegistrationQuestionSchema.parse(data);
    
    if (!(await canManageEvent(validatedData.slug))) {
      return { success: false, error: "Unauthorized" };
    }

    if (!validatedData.questionId) throw new Error("Question ID is required");

    await removeRegistrationQuestion(validatedData.slug, validatedData.questionId);
    revalidatePath(`/event/${validatedData.slug}/manage`);
    logger.info(`Removed registration question ${validatedData.questionId} for slug: ${validatedData.slug}`);
    return { success: true };
  } catch (error: any) {
    logger.error("Failed to remove registration question", error);
    return { success: false, error: error.message || "Failed to remove question" };
  }
}

export async function createEventAction(data: any) {
  try {
    const validatedData = CreateEventSchema.parse(data);
    
    const { getUserRoleAction } = await import("@/actions/authActions");
    const roleResponse = await getUserRoleAction();
    const userId = roleResponse.data?.userId;
    
    if (!userId) {
       return { success: false, error: "Unauthorized" };
    }

    const newSlug = await createEvent(validatedData, userId);
    
    revalidatePath("/dashboard");
    logger.info(`Created new event with slug: ${newSlug}`);
    return { success: true, slug: newSlug };
  } catch (error: any) {
    logger.error("Failed to create event", error);
    return { success: false, error: error.message || "Failed to create event" };
  }
}
