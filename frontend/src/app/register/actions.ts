"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type RegisterResult = { error?: string };

export async function register(prevState: RegisterResult | null, formData: FormData): Promise<RegisterResult> {
  const supabase = await createClient();

  const firstName = (formData.get("firstName") as string)?.trim() ?? "";
  const lastName = (formData.get("lastName") as string)?.trim() ?? "";
  const email = (formData.get("email") as string)?.trim() ?? "";
  const password = formData.get("password") as string ?? "";

  if (!email || !password || !firstName || !lastName) {
    return { error: "All fields are required." };
  }

  // First, sign up the user in auth
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`.trim() || null,
        role: "user",
      },
    },
  });

  if (signUpError) {
    return { error: signUpError.message };
  }

  if (data?.user) {
    // Insert user data into the users table
    const { error: insertError } = await supabase
      .from("users")
      .insert({
        users_id: data.user.id,
        email: email,
        first_name: firstName,
        last_name: lastName,
      });

    if (insertError) {
      console.error("Error inserting user data:", insertError);
      return { error: "Failed to create user profile." };
    }

    revalidatePath("/", "layout");
    redirect("/?registered=1");
  }

  return { error: "Something went wrong. Please try again." };
}
