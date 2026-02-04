import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createHash } from "crypto";

// Generate deterministic UUID from email
function generateRegistrantId(email: string, eventId: string): string {
  const hash = createHash('sha256')
    .update(`${email}-${eventId}`)
    .digest('hex');

  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_id, email, first_name, last_name, terms_approval, form_answers } = body;

    // Validate required fields
    if (!event_id || !email || !first_name || !last_name) {
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

    // Generate deterministic registrant_id from email and event_id
    const registrant_id = generateRegistrantId(email, eventData.event_id);

    // Check if user already registered for this event
    const { data: existingRegistrant, error: checkError } = await supabase
      .from("registrants")
      .select("registrant_id")
      .eq("registrant_id", registrant_id)
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
        registrant_id,
        event_id: eventData.event_id,
        email,
        first_name,
        last_name,
        terms_approval: true, 
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
