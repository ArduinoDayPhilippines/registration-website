import { getEventBySlug } from "@/repositories/eventRepository";
import { getGuestCountByEvent } from "@/repositories/guestRepository";
import { EventData, Question } from "@/types/event";

function mapRowToEvent(row: any): EventData {
  const startDateObj = row.start_date ? new Date(row.start_date) : null;
  const endDateObj = row.end_date ? new Date(row.end_date) : null;

  let questions: Question[] = [];
  if (row.form_questions) {
    if (Array.isArray(row.form_questions)) {
      questions = row.form_questions;
    } else if (typeof row.form_questions === "object") {
      questions = Object.entries(row.form_questions).map(
        ([key, value], index) => ({
          id: index + 1,
          text: String(value),
          required: true,
        }),
      );
    }
  }

  return {
    slug: row.slug,
    title: row.event_name ?? "Untitled Event",
    organizerId: row.organizer_id,
    startDate: startDateObj ? startDateObj.toISOString().slice(0, 10) : "",
    startTime: startDateObj ? startDateObj.toISOString().slice(11, 16) : "",
    endDate: endDateObj ? endDateObj.toISOString().slice(0, 10) : "",
    endTime: endDateObj ? endDateObj.toISOString().slice(11, 16) : "",
    location: row.location ?? "",
    description: row.description ?? "",
    ticketPrice: row.price ?? "",
    capacity:
      row.capacity !== null && row.capacity !== undefined
        ? String(row.capacity)
        : "",
    requireApproval: row.require_approval ?? false,
    coverImage: undefined,
    theme: "Minimal Dark",
    questions,
    createdAt: row.created_at ?? new Date().toISOString(),
    postEventSurvey: row.post_event_survey,
  };
}

export async function getEventDetails(slug: string) {
  if (!slug) {
    throw new Error("Missing slug");
  }

  const row = await getEventBySlug(slug);
  const event = mapRowToEvent(row);

  if (row.registered !== null && row.registered !== undefined) {
    event.registeredCount = row.registered;
  } else {
    event.registeredCount = await getGuestCountByEvent(slug, ["approved", "pending"]);
  }

  return event;
}


export async function listAllEvents() {
  const { listEvents } = await import("@/repositories/eventRepository");
  return await listEvents();
}

export async function updateEventDetails(slug: string, details: any) {
  const { updateEventDetails: repoUpdate } = await import("@/repositories/eventRepository");
  await repoUpdate(slug, details);
}

export async function updateEventSettings(slug: string, requireApproval: boolean) {
  const { updateEventSettings: repoUpdateSettings } = await import("@/repositories/eventRepository");
  await repoUpdateSettings(slug, requireApproval);
}

export async function addRegistrationQuestion(slug: string, text: string, required: boolean) {
  const { getEventQuestions, updateEventQuestions } = await import("@/repositories/eventRepository");
  
  const raw = await getEventQuestions(slug);
  const existingQuestions = Array.isArray(raw?.form_questions) ? raw.form_questions : [];
  
  const newQuestion = {
    id: Date.now(),
    text,
    required,
  };
  
  const updatedQuestions = [...existingQuestions, newQuestion];
  await updateEventQuestions(slug, updatedQuestions);
}

export async function updateRegistrationQuestion(slug: string, questionId: number, text: string, required: boolean) {
  const { getEventQuestions, updateEventQuestions } = await import("@/repositories/eventRepository");
  
  const raw = await getEventQuestions(slug);
  const existingQuestions = Array.isArray(raw?.form_questions) ? raw.form_questions : [];
  
  const updatedQuestions = existingQuestions.map((q: any) =>
    q.id === questionId ? { ...q, text, required } : q
  );
  
  await updateEventQuestions(slug, updatedQuestions);
}

export async function removeRegistrationQuestion(slug: string, questionId: number) {
  const { getEventQuestions, updateEventQuestions } = await import("@/repositories/eventRepository");
  
  const raw = await getEventQuestions(slug);
  const existingQuestions = Array.isArray(raw?.form_questions) ? raw.form_questions : [];
  
  const updatedQuestions = existingQuestions.filter((q: any) => q.id !== questionId);
  
  await updateEventQuestions(slug, updatedQuestions);
}

export async function createEvent(eventData: any, userId: string): Promise<string> {
  const { insertEvent } = await import("@/repositories/eventRepository");
  const { generateSlug } = await import("@/utils/slug");

  const {
    title,
    startDate,
    startTime,
    endDate,
    endTime,
    location,
    description,
    ticketPrice,
    requireApproval,
    capacity,
    questions,
  } = eventData;

  const parsedCapacity = capacity && capacity !== "Unlimited" ? parseInt(capacity) : null;
  
  const parsedQuestions = questions && questions.length > 0
    ? questions.reduce((acc: any, question: any, index: number) => {
        acc[`q${index + 1}`] = question.text;
        return acc;
      }, {})
    : null;

  const slug = generateSlug(title);

  const mappedData = {
    organizer_id: userId,
    event_name: title,
    slug,
    start_date: new Date(`${startDate}T${startTime}`).toISOString(),
    end_date:
      endDate && endTime
        ? new Date(`${endDate}T${endTime}`).toISOString()
        : null,
    location,
    description: description || null,
    price: ticketPrice || "free",
    capacity: parsedCapacity,
    require_approval: requireApproval || false,
    form_questions: parsedQuestions,
    status: "upcoming",
  };

  await insertEvent(mappedData);
  return slug;
}
