"use server";

import { canManageEvent } from "@/services/authService";
import { uploadQRBufferToStorage } from "@/repositories/qrServerRepository";
import { logger } from "@/utils/logger";

export interface QRUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadQRCodeAction(
  blob: Blob,
  fileName: string,
  eventSlug: string
): Promise<QRUploadResult> {
  try {
    const canManage = await canManageEvent(eventSlug);
    if (!canManage) {
      logger.warn("Unauthorized QR upload attempt", { eventSlug });
      return { success: false, error: "Unauthorized" };
    }

    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadQRBufferToStorage(fileName, buffer);

    if (result.success) {
      logger.info("QR code uploaded successfully", { fileName });
    } else {
      logger.error("QR upload failed", result.error);
    }

    return result;
  } catch (error) {
    logger.error("Error uploading QR code", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
