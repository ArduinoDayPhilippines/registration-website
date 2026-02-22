import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_id, user_id, terms_approval, form_answers } = body;

    // Validate required fields
    if (!event_id || !user_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get the actual event_id from the slug
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("event_id, require_approval")
      .eq("slug", event_id)
      .single();

    if (eventError) {
      console.error("Event query error:", eventError);
      return NextResponse.json(
        { error: `Event query failed: ${eventError.message}` },
        { status: 404 }
      );
    }

    if (!eventData) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Determine is_registered based on require_approval
    const is_registered = !eventData.require_approval;

    // Check if user already registered for this event
    const { data: existingRegistrant, error: checkError } = await supabase
      .from("registrants")
      .select("registrant_id")
      .eq("users_id", user_id)
      .eq("event_id", eventData.event_id)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing registration:", checkError);
      return NextResponse.json(
        { error: "Failed to check registration status" },
        { status: 500 }
      );
    }

    if (existingRegistrant) {
      return NextResponse.json(
        { error: "You have already registered for this event" },
        { status: 409 }
      );
    }

    // Insert registrant
    const { data, error } = await supabase
      .from("registrants")
      .insert({
        event_id: eventData.event_id,
        users_id: user_id,
        terms_approval: terms_approval || true, 
        form_answers: form_answers || {},
        is_registered,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating registrant:", error);
      return NextResponse.json(
        { error: error.message || "Failed to create registration" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      registrant: data,
      message: is_registered 
        ? "Registration successful" 
        : "Registration pending approval"
    });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
