import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { EventData, Question } from "@/types/event";

// Shape of the row as it exists in your `events` table
type EventRow = {
  slug: string;
  event_name: string;
  organizer_id: string | null;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  description: string | null;
  price: string | null;
  capacity: number | null;
  registered: number | null;
  require_approval: boolean | null;
  form_questions: any;
  created_at: string | null;
  post_event_survey: any;
};

function mapRowToEvent(row: EventRow): EventData {
  const startDateObj = row.start_date ? new Date(row.start_date) : null;
  const endDateObj = row.end_date ? new Date(row.end_date) : null;

  // Transform form_questions from JSONB object to Question array
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

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if ((error as { code?: string }).code === "PGRST116") {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: error.message || "Failed to fetch event" },
      { status: 500 },
    );
  }

  const event = mapRowToEvent(data as EventRow);

  // Use the registered column from the events table if available,
  // otherwise fall back to counting from the guests table
  if (data.registered !== null && data.registered !== undefined) {
    event.registeredCount = data.registered;
  } else {
    // Fallback: Get registered guest count from guests table
    const { count } = await supabase
      .from("guests")
      .select("*", { count: "exact", head: true })
      .eq("event_slug", slug)
      .in("status", ["approved", "pending"]);

    event.registeredCount = count ?? 0;
  }

  return NextResponse.json({ event });
}
