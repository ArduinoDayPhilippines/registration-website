"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type RegisterResult = { error?: string };

export async function register(prevState: RegisterResult | null, formData: FormData): Promise<RegisterResult> {
  const supabase = await createClient();

  const fullName = (formData.get("fullName") as string)?.trim() ?? "";
  const email = (formData.get("email") as string)?.trim() ?? "";
  const password = formData.get("password") as string ?? "";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const nameParts = fullName.split(/\s+/).filter(Boolean);
  const first_name = nameParts[0] ?? "";
  const last_name = nameParts.slice(1).join(" ") ?? null;

  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: first_name || null,
        last_name: last_name || null,
        full_name: fullName || null,
      },
    },
  });

  if (signUpError) {
    return { error: signUpError.message };
  }

  if (data?.user) {
    revalidatePath("/", "layout");
    redirect("/?registered=1");
  }

  return { error: "Something went wrong. Please try again." };
}
