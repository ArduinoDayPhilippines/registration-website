"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;

  const password = formData.get("password") as string;

  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    console.error("Login error:", loginError.message);
    redirect("/?error=Invalid credentials");
  }
  revalidatePath("/", "layout");
  redirect("/dashboard");
}
