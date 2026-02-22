import { useState, useCallback } from "react";
import { Guest } from "@/types/guest";

interface UseGuestModalReturn {
  selectedGuest: Guest | null;
  showAnswersModal: boolean;
  openAnswersModal: (guest: Guest) => void;
  closeAnswersModal: () => void;
}

/**
 * Custom hook to manage guest modal state
 * Responsibilities: Modal open/close state and selected guest tracking
 */
export function useGuestModal(): UseGuestModalReturn {
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [showAnswersModal, setShowAnswersModal] = useState(false);

  const openAnswersModal = useCallback((guest: Guest) => {
    setSelectedGuest(guest);
    setShowAnswersModal(true);
  }, []);

  const closeAnswersModal = useCallback(() => {
    setShowAnswersModal(false);
    setSelectedGuest(null);
  }, []);

  return {
    selectedGuest,
    showAnswersModal,
    openAnswersModal,
    closeAnswersModal,
  };
}
