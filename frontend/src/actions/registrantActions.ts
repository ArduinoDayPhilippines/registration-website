"use server";

import { revalidatePath } from "next/cache";
import {
  CreateRegistrantSchema,
  CreateRegistrantInput,
  UpdateGuestStatusSchema,
  DeleteGuestSchema 
} from "@/validators/registrantValidators";
import {
  registerForEvent,
  updateGuestStatus,
  deleteGuest 
} from "@/services/registrantService";
import { canManageEvent } from "@/services/authService";
import { logger } from "@/utils/logger";
import {
  withActionErrorHandler,
  UnauthorizedError,
} from "@/lib/utils/actionError";

export const createRegistrantAction = withActionErrorHandler(
  async (data: CreateRegistrantInput) => {
    const validatedData = CreateRegistrantSchema.parse(data);
    const result = await registerForEvent(validatedData);
    return { result };
  },
);

export const updateGuestStatusAction = withActionErrorHandler(
  async (data: any, slug: string) => {
    const validatedData = UpdateGuestStatusSchema.parse(data);

    if (!(await canManageEvent(slug))) {
      logger.warn(
        `Unauthorized guest update attempt by user for guest ${validatedData.guestId}`,
      );
      throw new UnauthorizedError("Unauthorized");
    }

    await updateGuestStatus(validatedData.guestId, validatedData.isRegistered);
    revalidatePath(`/event/${slug}/manage`);
    logger.info(`Successfully updated guest ${validatedData.guestId} status`);
  },
);

export const deleteGuestAction = withActionErrorHandler(
  async (data: any, slug: string) => {
    const validatedData = DeleteGuestSchema.parse(data);

    if (!(await canManageEvent(slug))) {
      logger.warn(
        `Unauthorized guest deletion attempt by user for guest ${validatedData.guestId}`,
      );
      throw new UnauthorizedError("Unauthorized");
    }

    await deleteGuest(validatedData.guestId);
    revalidatePath(`/event/${slug}/manage`);
    logger.info(`Successfully deleted guest ${validatedData.guestId}`);
  },
);

export const exportGuestsAction = withActionErrorHandler(
  async (slug: string) => {
    if (!(await canManageEvent(slug))) {
      logger.warn(`Unauthorized guest export attempt for event ${slug}`);
      throw new UnauthorizedError("Unauthorized");
    }

    const { exportGuestsToCSV } = await import("@/services/guestService");
    const result = await exportGuestsToCSV(slug);

    if (result.success) {
      logger.info(`Successfully exported guests for event ${slug}`);
    } else {
      throw new Error(result.error || "Failed to export guests");
    }

    return result;
  },
);
