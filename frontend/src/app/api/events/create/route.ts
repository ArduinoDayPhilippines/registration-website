import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type CreateEventBody = {
  title?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  location?: string;
  description?: string;
  coverImage?: string;
  ticketPrice?: number;
  maxAttendees?: number;
  requireApproval?: boolean;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateEventBody;

    const {
      title,
      startDate,
      startTime,
      endDate,
      endTime,
      location,
      description,
      coverImage,
      ticketPrice,
      maxAttendees,
      requireApproval,
    } = body;

    // Validate required fields
    if (!title || !startDate || !startTime || !location) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Insert event into database
    const { data, error } = await supabase
      .from("events")
      .insert({
        title,
        start_date: startDate,
        start_time: startTime,
        end_date: endDate || null,
        end_time: endTime || null,
        location,
        description: description || null,
        cover_image: coverImage || null,
        ticket_price: ticketPrice || 0,
        max_attendees: maxAttendees || null,
        require_approval: requireApproval || false,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { ok: false, error: "Failed to create event" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, event: data });
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
