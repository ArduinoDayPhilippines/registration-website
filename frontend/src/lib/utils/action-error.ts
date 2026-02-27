/**
 * Shared utility for standardized Action Error handling across Service and Action layers.
 */
import { ActionResponse } from "@/types/action";

export class ActionError extends Error {
  code: number;

  constructor(message: string, code: number = 500) {
    super(message);
    this.name = "ActionError";
    this.code = code;
  }
}

/**
 * 401 Unauthorized Action Error
 * Use this when a user is not logged in or lacks a valid session.
 */
export class UnauthorizedError extends ActionError {
  constructor(message: string = "Unauthorized. Please log in.") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

/**
 * 403 Forbidden Action Error
 * Use this when a logged-in user lacks specific permissions to perform an action.
 */
export class ForbiddenError extends ActionError {
  constructor(
    message: string = "Forbidden. You do not have permission to perform this action.",
  ) {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}


/**
 * Standard utility to handle and format Server Action errors consistently.
 */
export function handleActionError(error: unknown): ActionResponse {
  // 1. If we intentionally threw an ActionError (or its subclasses like Unauthorized, Forbidden)
  if (error instanceof ActionError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }

  // 2. If it's a known Supabase error
  if (error && typeof error === "object" && "code" in error) {
    const dbError = error as {
      message?: string;
      code: string;
      details?: string;
    };
    console.error("[Database Action Error]:", dbError);

    // Handle Postgres constraint errors
    if (dbError.code === "23505") {
      return {
        success: false,
        error: "Resource already exists.",
        code: 409,
      };
    }

    return {
      success: false,
      error: "Database operation failed.",
      code: 500,
    };
  }

  // 3. Handle standard JS errors
  if (error instanceof Error) {
    console.error("[Server Action Error]:", error.message);
    // Be careful not to expose internal stack traces/database queries to the client
    return {
      success: false,
      error: "An unexpected server error occurred.",
      code: 500,
    };
  }

  // 4. Ultimate fallback
  console.error("[Unknown Action Error]:", error);
  return {
    success: false,
    error: "An unexpected error occurred.",
    code: 500, // Generic Internal Server Error
  };
}

/**
 * Higher-order wrapper to wrap any Server Action
 * This automatically catches any thrown ActionError and returns a formatted JSON object.
 *
 * Usage:
 * export const myAction = withActionErrorHandler(async (formData) => { ... })
 */
export function withActionErrorHandler<TArgs extends unknown[], TReturn>(
  action: (...args: TArgs) => Promise<TReturn>,
) {
  return async (...args: TArgs): Promise<ActionResponse<TReturn>> => {
    try {
      const data = await action(...args);
      return { success: true, data };
    } catch (error) {
      return handleActionError(error) as ActionResponse<TReturn>;
    }
  };
}
