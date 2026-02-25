"use server";

import { CreateRegistrantSchema, CreateRegistrantInput } from "@/validators/registrantValidators";
import { registerForEvent } from "@/services/registrantService";

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

import { logger } from "@/utils/logger";
import { canManageEvent } from "@/services/authService";
import { revalidatePath } from "next/cache";
import { UpdateGuestStatusSchema, DeleteGuestSchema } from "@/validators/registrantValidators";
import { updateGuestStatus, deleteGuest } from "@/services/registrantService";

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
