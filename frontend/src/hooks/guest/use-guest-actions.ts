import { useCallback, useTransition } from "react";
import { Guest } from "@/types/guest";
import {
  updateGuestStatusAction,
  deleteGuestAction,
  exportGuestsAction
} from "@/actions/registrantActions";
import { generateSingleQRAction, generateBulkQRAction } from "@/actions/qrClientActions";
import { downloadCSV } from "@/utils/fileDownload";
import { useNotification } from "@/hooks/use-notification";

/**
 * Hook for handling guest actions
 * Coordinates between UI, actions, and services
 */
export function useGuestActions(slug: string, onRefresh: () => void) {
  const [isPending, startTransition] = useTransition();
  const { showSuccess, showError, showConfirm } = useNotification();

  const handleDeleteGuest = useCallback((guestId: string) => {
    if (!showConfirm("Are you sure you want to remove this guest?")) return;

    startTransition(async () => {
      const result = await deleteGuestAction({ guestId }, slug);

      if (result.success) {
        onRefresh();
        showSuccess("Guest removed successfully");
      } else {
        showError(result.error || "Failed to delete guest");
      }
    });
  }, [slug, onRefresh, showConfirm, showSuccess, showError]);

  const handleStatusChange = useCallback((guestId: string, newStatus: string) => {
    const isRegistered = newStatus === "registered";

    startTransition(async () => {
      const result = await updateGuestStatusAction({ guestId, isRegistered }, slug);

      if (result.success) {
        onRefresh();
        showSuccess("Status updated successfully");
      } else {
        showError(result.error || "Failed to update status");
      }
    });
  }, [slug, onRefresh, showSuccess, showError]);

  const handleExport = useCallback(async () => {
    const result = await exportGuestsAction(slug);

    if (result.success && 'csvData' in result && result.csvData) {
      downloadCSV(result.csvData, `event-guests-${slug}.csv`);
      showSuccess("Guest list exported successfully");
    } else {
      showError('error' in result ? result.error || "Failed to export guests" : "Failed to export guests");
    }
  }, [slug, showSuccess, showError]);

  const handleGenerateQR = useCallback(async (guest: Guest) => {
    const result = await generateSingleQRAction(guest, slug);

    if (result.success) {
      showSuccess(`QR code uploaded successfully!\nURL: ${result.url}`);
    } else {
      showError(result.error || "Failed to generate QR code");
    }
  }, [slug, showSuccess, showError]);

  const handleBulkGenerateQR = useCallback(async (guests: Guest[]) => {
    if (guests.length === 0) {
      showError('No guests selected');
      return;
    }

    const result = await generateBulkQRAction(guests, slug);

    if (result.success) {
      const count = result.count ?? 0;
      showSuccess(`Uploaded ${count} QR code${count > 1 ? 's' : ''} successfully!`);
    } else {
      showError(result.error || "Failed to generate QR codes");
    }
  }, [slug, showSuccess, showError]);

  return {
    isPending,
    handleDeleteGuest,
    handleStatusChange,
    handleExport,
    handleGenerateQR,
    handleBulkGenerateQR,
  };
}
