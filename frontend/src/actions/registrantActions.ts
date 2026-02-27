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

export async function createRegistrantAction(data: CreateRegistrantInput) {
  try {
    const validatedData = CreateRegistrantSchema.parse(data);
    const result = await registerForEvent(validatedData);

    return { success: true, result };
  } catch (error: any) {
    console.error("createRegistrantAction error:", error);
    return { success: false, error: error.message || "Failed to create registration" };
  }
}

export async function updateGuestStatusAction(data: any, slug: string) {
  try {
    const validatedData = UpdateGuestStatusSchema.parse(data);
    
    if (!(await canManageEvent(slug))) {
      logger.warn(`Unauthorized guest update attempt by user for guest ${validatedData.guestId}`);
      return { success: false, error: "Unauthorized" };
    }

    await updateGuestStatus(validatedData.guestId, validatedData.isRegistered);
    revalidatePath(`/event/${slug}/manage`);
    logger.info(`Successfully updated guest ${validatedData.guestId} status`);
    return { success: true };
  } catch (error: any) {
    logger.error("Failed to update guest status", error);
    return { success: false, error: error.message || "Failed to update guest status" };
  }
}

export async function deleteGuestAction(data: any, slug: string) {
  try {
    const validatedData = DeleteGuestSchema.parse(data);
    
    if (!(await canManageEvent(slug))) {
      logger.warn(`Unauthorized guest deletion attempt by user for guest ${validatedData.guestId}`);
      return { success: false, error: "Unauthorized" };
    }

    await deleteGuest(validatedData.guestId);
    revalidatePath(`/event/${slug}/manage`);
    logger.info(`Successfully deleted guest ${validatedData.guestId}`);
    return { success: true };
  } catch (error: any) {
    logger.error("Failed to delete guest", error);
    return { success: false, error: error.message || "Failed to delete guest" };
  }
}

export async function exportGuestsAction(slug: string) {
  try {
    if (!(await canManageEvent(slug))) {
      logger.warn(`Unauthorized guest export attempt for event ${slug}`);
      return { success: false, error: "Unauthorized" };
    }

    const { exportGuestsToCSV } = await import("@/services/guestService");
    const result = await exportGuestsToCSV(slug);
    
    if (result.success) {
      logger.info(`Successfully exported guests for event ${slug}`);
    }
    
    return result;
  } catch (error: any) {
    logger.error("Failed to export guests", error);
    return { success: false, error: error.message || "Failed to export guests" };
  }
}
