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
import {
  withActionErrorHandler,
  UnauthorizedError,
} from "@/lib/utils/actionError";

export const getEventAction = withActionErrorHandler(async (slug: string) => {
  const validatedData = EventSlugSchema.parse({ slug });
  const event = await getEventDetails(validatedData.slug);

  logger.info(`Fetched event details for slug: ${slug}`);
  return { event };
});

export const listEventsAction = withActionErrorHandler(async () => {
  const data = await listAllEvents();
  logger.info("Fetched all events list");
  return data;
});

export const updateEventDetailsAction = withActionErrorHandler(
  async (data: any) => {
    const validatedData = UpdateEventDetailsSchema.parse(data);
    const { slug, ...details } = validatedData;

    if (!(await canManageEvent(slug))) {
      logger.warn(
        `Unauthorized event details update attempt for slug: ${slug}`,
      );
      throw new UnauthorizedError("Unauthorized");
    }

    const { startDate, startTime, endTime } = details;
    const startDateTime =
      startDate && startTime
        ? new Date(`${startDate}T${startTime}`).toISOString()
        : undefined;
    const endDateTime =
      startDate && endTime
        ? new Date(`${startDate}T${endTime}`).toISOString()
        : undefined;

    const mappedDetails = {
      event_name: details.title,
      description: details.description,
      location: details.location,
      price: details.ticketPrice,
      capacity: details.capacity ? Number(details.capacity) : null,
      require_approval: details.requireApproval,
      modified_at: new Date().toISOString(),
    };

    if (startDateTime)
      Object.assign(mappedDetails, { start_date: startDateTime });
    if (endDateTime) Object.assign(mappedDetails, { end_date: endDateTime });

    await updateEventDetails(slug, mappedDetails);
    revalidatePath(`/event/${slug}/manage`);
    logger.info(`Updated event details for slug: ${slug}`);
  },
);

export const updateEventSettingsAction = withActionErrorHandler(
  async (data: any) => {
    const validatedData = UpdateEventSettingsSchema.parse(data);

    if (!(await canManageEvent(validatedData.slug))) {
      throw new UnauthorizedError("Unauthorized");
    }

    await updateEventSettings(
      validatedData.slug,
      validatedData.requireApproval,
    );
    revalidatePath(`/event/${validatedData.slug}/manage`);
    logger.info(`Updated event settings for slug: ${validatedData.slug}`);
  },
);

export const addRegistrationQuestionAction = withActionErrorHandler(
  async (data: any) => {
    const validatedData = RegistrationQuestionSchema.parse(data);

    if (!(await canManageEvent(validatedData.slug))) {
      throw new UnauthorizedError("Unauthorized");
    }

    if (!validatedData.text) throw new Error("Question text is required");

    await addRegistrationQuestion(
      validatedData.slug,
      validatedData.text,
      !!validatedData.required,
    );
    revalidatePath(`/event/${validatedData.slug}/manage`);
    logger.info(`Added registration question for slug: ${validatedData.slug}`);
  },
);

export const updateRegistrationQuestionAction = withActionErrorHandler(
  async (data: any) => {
    const validatedData = RegistrationQuestionSchema.parse(data);

    if (!(await canManageEvent(validatedData.slug))) {
      throw new UnauthorizedError("Unauthorized");
    }

    if (!validatedData.questionId || !validatedData.text)
      throw new Error("Question ID and text are required");

    await updateRegistrationQuestion(
      validatedData.slug,
      validatedData.questionId,
      validatedData.text,
      !!validatedData.required,
    );
    revalidatePath(`/event/${validatedData.slug}/manage`);
    logger.info(
      `Updated registration question ${validatedData.questionId} for slug: ${validatedData.slug}`,
    );
  },
);

export const removeRegistrationQuestionAction = withActionErrorHandler(
  async (data: any) => {
    const validatedData = RegistrationQuestionSchema.parse(data);

    if (!(await canManageEvent(validatedData.slug))) {
      throw new UnauthorizedError("Unauthorized");
    }

    if (!validatedData.questionId) throw new Error("Question ID is required");

    await removeRegistrationQuestion(
      validatedData.slug,
      validatedData.questionId,
    );
    revalidatePath(`/event/${validatedData.slug}/manage`);
    logger.info(
      `Removed registration question ${validatedData.questionId} for slug: ${validatedData.slug}`,
    );
  },
);

export const createEventAction = withActionErrorHandler(async (data: any) => {
  const validatedData = CreateEventSchema.parse(data);

  const { getUserRoleAction } = await import("@/actions/authActions");
  const roleResponse = await getUserRoleAction();
  const userId = roleResponse.data?.userId as string | undefined;

  if (!userId) {
    throw new UnauthorizedError("Unauthorized");
  }

  const newSlug = await createEvent(validatedData, userId);

  revalidatePath("/dashboard");
  logger.info(`Created new event with slug: ${newSlug}`);
  return { slug: newSlug };
});
