"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type LoginResult = { error?: string; success?: boolean };

export async function login(prevState: LoginResult | null, formData: FormData): Promise<LoginResult> {
  const supabase = await createClient();

  const email = (formData.get("email") as string)?.trim() ?? "";
  const password = formData.get("password") as string ?? "";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    return { error: loginError.message };
  }
  revalidatePath("/", "layout");
  return { success: true };
}
