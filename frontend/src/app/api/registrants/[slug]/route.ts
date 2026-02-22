import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCanManageEvent } from "@/lib/auth/can-manage-event";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const canManage = await getCanManageEvent(slug);
    const supabase = canManage ? createAdminClient() : await createClient();

    console.log("Fetching registrants for slug:", slug);

    // First, get the event_id from the slug
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("event_id")
      .eq("slug", slug)
      .single();

    console.log("Event query result:", { event, eventError });

    if (eventError || !event) {
      return NextResponse.json(
        { success: false, error: "Event not found", details: eventError },
        { status: 404 }
      );
    }

    // Fetch registrants for this event with user data
    const { data: registrants, error: registrantsError } = await supabase
      .from("registrants")
      .select(`
        *,
        users (
          first_name,
          last_name,
          email
        )
      `)
      .eq("event_id", event.event_id);

    console.log("Registrants query result:", { 
      count: registrants?.length, 
      error: registrantsError,
      sampleData: registrants?.[0] 
    });

    if (registrantsError) {
      console.error("Error fetching registrants:", registrantsError);
      return NextResponse.json(
        { success: false, error: "Failed to fetch registrants", details: registrantsError },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      guests: registrants || [],
      count: registrants?.length || 0,
    });
  } catch (error) {
    console.error("Error in registrants API:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
