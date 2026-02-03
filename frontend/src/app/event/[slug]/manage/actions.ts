"use server";

import { createClient } from "@/lib/supabase/server";

const TEMP_EVENT_ID = "fac53a2f-fcb7-4765-9841-9d0b052dc7e7";

type StoredQuestion = {
  id: number;
  text: string;
  required: boolean;
};

export async function eventManage(formData: FormData) {
  const operation = (formData.get("operation") as string | null) ?? "";
  const slug = formData.get("slug") as string;

  const title = formData.get("title") as string | null;
  const description = formData.get("description") as string | null;
  const startDate = formData.get("startDate") as string | null;
  const startTime = formData.get("startTime") as string | null;
  const endTime = formData.get("endTime") as string | null;
  const location = formData.get("location") as string | null;
  const capacity = formData.get("capacity") as string | null;
  const ticketPrice = formData.get("ticketPrice") as string | null;

  const requireApprovalRaw = formData.get("requireApproval");
  const requireApproval =
    typeof requireApprovalRaw === "string"
      ? requireApprovalRaw === "on"
      : Boolean(requireApprovalRaw);

  const supabase = await createClient();
  if (operation === "updateEventDetails") {
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = endTime ? new Date(`${startDate}T${endTime}`) : null;

    const { error } = await supabase
      .from("events")
      .update({
        event_name: title,
        description,
        start_date: startDateTime.toISOString(),
        end_date: endDateTime ? endDateTime.toISOString() : null,
        location,
        price: ticketPrice,
        capacity: capacity ? Number(capacity) : null,
        require_approval: requireApproval,
        modified_at: new Date().toISOString(),
      })
      .eq("event_id", TEMP_EVENT_ID);

    if (error) {
      console.error("Error updating event details:", error);
    }
  } else if (operation === "updateEventSettings") {
    const { error } = await supabase
      .from("events")
      .update({
        require_approval: requireApproval,
        modified_at: new Date().toISOString(),
      })
      .eq("event_id", TEMP_EVENT_ID);

    if (error) {
      console.error("Error updating event settings:", error);
    }
  } else if (
    operation === "addRegistrationQuestion" ||
    operation === "updateRegistrationQuestion" ||
    operation === "removeRegistrationQuestion"
  ) {
    const { data, error } = await supabase
      .from("events")
      .select("form_questions")
      .eq("event_id", TEMP_EVENT_ID)
      .single();

    if (error) {
      console.error("Error loading form questions:", error);
    }

    const raw = data?.form_questions as unknown;
    const existingQuestions: StoredQuestion[] = Array.isArray(raw)
      ? raw.map((q: Record<string, unknown>) => ({
          id: Number(q.id),
          text: typeof q.text === "string" ? q.text : "",
          required: Boolean(q.required),
        }))
      : [];

    let updatedQuestions: StoredQuestion[] = existingQuestions;

    if (operation === "addRegistrationQuestion") {
      const text = (formData.get("text") as string | null) ?? "";
      const requiredRaw = formData.get("required");
      const required =
        typeof requiredRaw === "string"
          ? requiredRaw === "on"
          : Boolean(requiredRaw);

      if (!text.trim()) {
      }
      const newQuestion: StoredQuestion = {
        id: Date.now(),
        text,
        required,
      };

      updatedQuestions = [...existingQuestions, newQuestion];
    } else {
      const questionIdRaw = formData.get("questionId");
      const questionId = questionIdRaw ? Number(questionIdRaw) : NaN;

      if (!Number.isFinite(questionId)) {
      }

      if (operation === "updateRegistrationQuestion") {
        const text = (formData.get("text") as string | null) ?? "";
        const requiredRaw = formData.get("required");
        const required =
          typeof requiredRaw === "string"
            ? requiredRaw === "on"
            : Boolean(requiredRaw);

        updatedQuestions = existingQuestions.map((q) =>
          q.id === questionId ? { ...q, text, required } : q
        );
      } else if (operation === "removeRegistrationQuestion") {
        updatedQuestions = existingQuestions.filter((q) => q.id !== questionId);
      }
    }

    const { error: updateQuestionsError } = await supabase
      .from("events")
      .update({
        form_questions: updatedQuestions,
        modified_at: new Date().toISOString(),
      })
      .eq("event_id", TEMP_EVENT_ID);

    if (updateQuestionsError) {
      console.error("Error updating form questions:", updateQuestionsError);
    }
  }
}
