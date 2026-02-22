import { useTransition } from "react";
import {
  updateGuestStatus,
  deleteGuest,
  exportGuestsToCSV,
} from "@/app/event/[slug]/manage/guest-actions";
import { generateGuestQRCode, bulkGenerateGuestQRCodes } from "@/lib/services/qr-code-service";
import { Guest } from "@/types/guest";

interface UseGuestActionsProps {
  slug: string;
  onRefresh: () => void;
  getSelectedGuests?: () => Guest[];
}

interface UseGuestActionsReturn {
  isPending: boolean;
  handleStatusChange: (guestId: string, newStatus: string) => void;
  handleDelete: (guestId: string) => void;
  handleExport: () => Promise<void>;
  handleGenerateQR: (guest: Guest) => Promise<void>;
  handleBulkGenerateQR: (guests?: Guest[]) => Promise<void>;
}

/**
 * Custom hook to handle guest CRUD operations and actions
 */
export function useGuestActions({
  slug,
  onRefresh,
  getSelectedGuests,
}: UseGuestActionsProps): UseGuestActionsReturn {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (guestId: string, newStatus: string) => {
    const isRegistered = newStatus === "registered";

    startTransition(async () => {
      const result = await updateGuestStatus(guestId, isRegistered, slug);

      if (result.success) {
        onRefresh();
      } else {
        alert(result.error || "Failed to update status");
      }
    });
  };

  const handleDelete = (guestId: string) => {
    if (!confirm("Are you sure you want to remove this guest?")) return;

    startTransition(async () => {
      const result = await deleteGuest(guestId, slug);

      if (result.success) {
        onRefresh();
      } else {
        alert(result.error || "Failed to delete guest");
      }
    });
  };

  const handleExport = async () => {
    const result = await exportGuestsToCSV(slug);

    if (result.success && result.csvData) {
      const blob = new Blob([result.csvData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `event-guests-${slug}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      alert(result.error || "Failed to export guests");
    }
  };

  const handleGenerateQR = async (guest: Guest) => {
    const result = await generateGuestQRCode(guest, slug);

    if (result.success && result.publicUrl) {
      alert(`QR code uploaded successfully!\nURL: ${result.publicUrl}`);
    } else {
      alert(`Failed to generate QR code: ${result.error || "Unknown error"}`);
    }
  };

  const handleBulkGenerateQR = async (guestsParam?: Guest[]) => {
    const guests = guestsParam || (getSelectedGuests ? getSelectedGuests() : []);
    
    if (guests.length === 0) {
      alert("No guests selected");
      return;
    }

    const result = await bulkGenerateGuestQRCodes(guests, slug);

    if (result.success) {
      alert(
        `Uploaded ${result.uploadedCount} QR code${result.uploadedCount > 1 ? "s" : ""} successfully to ticket bucket!`
      );
    } else {
      alert(`Failed to generate QR codes: ${result.error || "Unknown error"}`);
    }
  };

  return {
    isPending,
    handleStatusChange,
    handleDelete,
    handleExport,
    handleGenerateQR,
    handleBulkGenerateQR,
  };
}
