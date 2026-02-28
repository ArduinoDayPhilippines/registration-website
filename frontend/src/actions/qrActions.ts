"use server";

import { canManageEvent } from "@/services/authService";
import { uploadQRBufferToStorage } from "@/repositories/qrServerRepository";
import { logger } from "@/utils/logger";
import {
  withActionErrorHandler,
  UnauthorizedError,
} from "@/lib/utils/actionError";

export interface QRUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const uploadQRCodeAction = withActionErrorHandler(
  async (blob: Blob, fileName: string, eventSlug: string) => {
    const canManage = await canManageEvent(eventSlug);
    if (!canManage) {
      logger.warn("Unauthorized QR upload attempt", { eventSlug });
      throw new UnauthorizedError("Unauthorized");
    }

    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadQRBufferToStorage(fileName, buffer);

    if (result.success) {
      logger.info("QR code uploaded successfully", { fileName });
      return result;
    } else {
      logger.error("QR upload failed", result.error);
      throw new Error(result.error);
    }
  },
);
