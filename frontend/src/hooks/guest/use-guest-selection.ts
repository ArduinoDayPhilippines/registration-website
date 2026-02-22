import { useState, useMemo, useCallback } from "react";
import { Guest } from "@/types/guest";

interface UseGuestSelectionReturn {
  selectedGuestIds: Set<string>;
  showSelectMenu: boolean;
  allSelected: boolean;
  someSelected: boolean;
  selectedCount: number;
  handleSelectAll: (checked: boolean) => void;
  handleSelectGuest: (guestId: string, checked: boolean) => void;
  handleSelectByStatus: (status: "all" | "registered" | "pending") => void;
  handleDeselectAll: () => void;
  toggleSelectMenu: () => void;
  getSelectedGuests: () => Guest[];
}

/**
 * Custom hook to handle guest selection state and logic
 */
export function useGuestSelection(
  filteredGuests: Guest[],
  allGuests: Guest[]
): UseGuestSelectionReturn {
  const [selectedGuestIds, setSelectedGuestIds] = useState<Set<string>>(new Set());
  const [showSelectMenu, setShowSelectMenu] = useState(false);

  const allSelected = useMemo(() => {
    return (
      filteredGuests.length > 0 &&
      filteredGuests.every((g) => selectedGuestIds.has(g.registrant_id))
    );
  }, [filteredGuests, selectedGuestIds]);

  const someSelected = useMemo(() => {
    return selectedGuestIds.size > 0 && !allSelected;
  }, [selectedGuestIds.size, allSelected]);

  const selectedCount = selectedGuestIds.size;

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        const allIds = new Set(filteredGuests.map((g) => g.registrant_id));
        setSelectedGuestIds(allIds);
      } else {
        setSelectedGuestIds(new Set());
      }
    },
    [filteredGuests]
  );

  const handleSelectGuest = useCallback((guestId: string, checked: boolean) => {
    setSelectedGuestIds((prev) => {
      const newSelected = new Set(prev);
      if (checked) {
        newSelected.add(guestId);
      } else {
        newSelected.delete(guestId);
      }
      return newSelected;
    });
  }, []);

  const handleSelectByStatus = useCallback(
    (status: "all" | "registered" | "pending") => {
      let guestsToSelect: Guest[] = [];

      if (status === "all") {
        guestsToSelect = filteredGuests;
      } else if (status === "registered") {
        guestsToSelect = filteredGuests.filter((g) => g.is_registered);
      } else if (status === "pending") {
        guestsToSelect = filteredGuests.filter((g) => !g.is_registered);
      }

      const selectedIds = new Set(guestsToSelect.map((g) => g.registrant_id));
      setSelectedGuestIds(selectedIds);
      setShowSelectMenu(false);
    },
    [filteredGuests]
  );

  const handleDeselectAll = useCallback(() => {
    setSelectedGuestIds(new Set());
    setShowSelectMenu(false);
  }, []);

  const toggleSelectMenu = useCallback(() => {
    setShowSelectMenu((prev) => !prev);
  }, []);

  const getSelectedGuests = useCallback(() => {
    return allGuests.filter((g) => selectedGuestIds.has(g.registrant_id));
  }, [allGuests, selectedGuestIds]);

  return {
    selectedGuestIds,
    showSelectMenu,
    allSelected,
    someSelected,
    selectedCount,
    handleSelectAll,
    handleSelectGuest,
    handleSelectByStatus,
    handleDeselectAll,
    toggleSelectMenu,
    getSelectedGuests,
  };
}
