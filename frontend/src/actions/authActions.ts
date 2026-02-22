"use server";

import { CheckEmailSchema } from "@/validators/authValidators";
import { checkEmailExists, getUserRole } from "@/services/authService";
import { logger } from "@/utils/logger";

// check email action
export async function checkEmailAction(data: { email: string }) {
  try {
    // Validate email - Zod
    const validatedData = CheckEmailSchema.parse(data);
    
    // Check if exists
    const exists = await checkEmailExists(validatedData.email);
    logger.info(`Checked email existence for ${validatedData.email}`);

    return { success: true, exists };
  } catch (error: any) {
    logger.error("checkEmailAction error", error);
    return { success: false, error: error.message || "Failed to check email" };
  }
}

// get user role action
export async function getUserRoleAction() {
  try {
    const data = await getUserRole();
    logger.info(`Fetched user role: ${data.role}`);
    return { success: true, data };
  } catch (error: any) {
    logger.error("getUserRoleAction error", error);
    return { success: false, error: error.message || "Failed to get user role" };
  }
}

// login action
export async function loginAction(prevState: AuthResult | null, formData: FormData): Promise<AuthResult> {
  try {
    const email = (formData.get("email") as string)?.trim() ?? "";
    const password = formData.get("password") as string ?? "";

    const { loginUser } = await import("@/services/authService");
    const { LoginSchema } = await import("@/validators/authValidators");
    
    LoginSchema.parse({ email, password });
    await loginUser(email, password);
    
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/", "layout");
    
    logger.info(`User logged in with email: ${email}`);
    return { success: true };
  } catch (error: any) {
    logger.error("loginAction error", error);
    return { error: error.message || "Failed to log in" };
  }
}

// register action
export async function registerAction(prevState: AuthResult | null, formData: FormData): Promise<AuthResult> {
  try {
    const firstName = (formData.get("firstName") as string)?.trim() ?? "";
    const lastName = (formData.get("lastName") as string)?.trim() ?? "";
    const email = (formData.get("email") as string)?.trim() ?? "";
    const password = (formData.get("password") as string) ?? "";

    const { registerUser } = await import("@/services/authService");
    const { RegisterSchema } = await import("@/validators/authValidators");

    RegisterSchema.parse({ firstName, lastName, email, password });
    const data = await registerUser(firstName, lastName, email, password);

    if (data?.user) {
      const { revalidatePath } = await import("next/cache");
      const { redirect } = await import("next/navigation");
      
      revalidatePath("/", "layout");
      logger.info(`New user registered with email: ${email}`);
      const next = (formData.get("next") as string)?.trim();
      if (next && next.startsWith("/") && !next.startsWith("//")) {
        redirect(next);
      }
      redirect("/?registered=1");
    }
    
    return { error: "Something went wrong. Please try again." };
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") {
      throw error; // Let Next.js handle redirects
    }
    logger.error("registerAction error", error);
    return { error: error.message || "Failed to register" };
  }
}

// auth result type
export type AuthResult = { error?: string; success?: boolean };

// logout action
export async function logoutAction(): Promise<AuthResult> {
  try {
    const { logoutUser } = await import("@/services/authService");
    await logoutUser();
    
    // It's important to revalidate so layout knows the user is logged out
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/", "layout");
    
    logger.info("User logged out successfully");
    return { success: true };
  } catch (error: any) {
    logger.error("logoutAction error", error);
    return { error: error.message || "Failed to log out" };
  }
}
