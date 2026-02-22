"use server";

import { SaveSurveySchema, SubmitSurveyResponseSchema } from "@/validators/surveyValidators";
import { saveEventSurveySettings, submitSurvey } from "@/services/surveyService";
import { logger } from "@/utils/logger";
import { canManageEvent } from "@/services/authService";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveEventSurveyAction(slug: string, surveyData: any) {
  try {
    const validatedData = SaveSurveySchema.parse({ slug, surveyData });
    
    if (!(await canManageEvent(validatedData.slug))) {
      logger.warn(`Unauthorized survey update attempt for slug: ${validatedData.slug}`);
      return { success: false, error: "Unauthorized. You must be the event organizer." };
    }

    await saveEventSurveySettings(validatedData.slug, validatedData.surveyData);
    revalidatePath(`/event/${validatedData.slug}/manage`);
    logger.info(`Successfully saved survey config for event: ${validatedData.slug}`);
    return { success: true };
  } catch (error: any) {
    logger.error("Failed to save survey", error);
    return { success: false, error: error.message || "Failed to save survey configuration" };
  }
}

export async function submitSurveyResponseAction(slug: string, answers: Record<string, any>) {
  try {
    const validatedData = SubmitSurveyResponseSchema.parse({ slug, answers });
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      logger.warn(`Unauthenticated survey submission attempt for slug: ${validatedData.slug}`);
      return { success: false, error: "You must be logged in to submit a survey." };
    }

    await submitSurvey(validatedData.slug, user.id, validatedData.answers);
    
    revalidatePath(`/event/${validatedData.slug}/manage`);
    logger.info(`Successfully submitted survey response for event: ${validatedData.slug} by user: ${user.id}`);
    return { success: true };
  } catch (error: any) {
    logger.error("Failed to submit survey", error);
    return { success: false, error: error.message || "Failed to submit survey" };
  }
}
