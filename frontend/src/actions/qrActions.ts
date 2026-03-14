"use server";

import { canManageEvent } from "@/services/authService";
import { logger } from "@/utils/logger";
import {
  withActionErrorHandler,
  UnauthorizedError,
} from "@/lib/utils/actionError";
import {
  checkInRegistrant,
  getRegistrantByQrData,
} from "@/repositories/registrantRepository";
import { getEventIdAndApprovalBySlug } from "@/repositories/eventRepository";
import { parseRegistrantQrData } from "@/services/qrService";

export interface QRValidationResult {
  success: boolean;
  guestName?: string;
  guestEmail?: string;
  error?: string;
}

export const validateQRCodeAction = withActionErrorHandler(
  async (qrData: string, eventSlug: string): Promise<QRValidationResult> => {
    const canManage = await canManageEvent(eventSlug);
    if (!canManage) {
      logger.warn("Unauthorized QR validation attempt", { eventSlug });
      throw new UnauthorizedError("Unauthorized to validate tickets");
    }

    const normalizedQrData = qrData.trim();
    if (!normalizedQrData) {
      return {
        success: false,
        error: "Invalid ticket - missing QR data.",
      };
    }

    const parsedPayload = parseRegistrantQrData(normalizedQrData);
    if (parsedPayload?.event.slug && parsedPayload.event.slug !== eventSlug) {
      return {
        success: false,
        error: "Invalid ticket - event mismatch",
      };
    }

    const [eventData, registrant] = await Promise.all([
      getEventIdAndApprovalBySlug(eventSlug),
      getRegistrantByQrData(normalizedQrData),
    ]);

    if (!registrant) {
      return {
        success: false,
        error: "Invalid ticket - registrant not found",
      };
    }

    if (registrant.event_id !== eventData.event_id) {
      return {
        success: false,
        error: "Invalid ticket - event mismatch",
      };
    }

    if (!registrant.is_registered || registrant.is_going === false) {
      return {
        success: false,
        error: "Invalid ticket - registrant is not cleared for entry",
      };
    }

    const guestName = [
      registrant.users?.first_name,
      registrant.users?.last_name,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    await checkInRegistrant(registrant.registrant_id);

    return {
      success: true,
      guestName: guestName || "Guest",
      guestEmail: registrant.users?.email ?? undefined,
    };
  },
);
