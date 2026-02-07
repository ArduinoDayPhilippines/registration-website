import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/auth/check-email
 * Body: { email: string }
 * Returns: { exists: boolean }
 * Used to determine if user should log in (exists) or register (not exists).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return NextResponse.json(
        { error: "Email is required", exists: false },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("users")
      .select("users_id")
      .ilike("email", email)
      .maybeSingle();

    if (error) {
      console.error("check-email error:", error);
      return NextResponse.json(
        { error: "Failed to check email", exists: false },
        { status: 500 }
      );
    }

    return NextResponse.json({ exists: !!data });
  } catch (err) {
    console.error("check-email:", err);
    return NextResponse.json(
      { error: "Invalid request", exists: false },
      { status: 400 }
    );
  }
}
