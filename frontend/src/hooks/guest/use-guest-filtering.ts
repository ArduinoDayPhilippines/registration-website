import { useMemo, useState } from "react";
import { Guest } from "@/types/guest";

interface UseGuestFilteringReturn {
  searchQuery: string;
  statusFilter: string;
  filteredGuests: Guest[];
  setSearchQuery: (query: string) => void;
  setStatusFilter: (filter: string) => void;
}

/**
 * Custom hook to handle guest filtering logic
 */
export function useGuestFiltering(guests: Guest[]): UseGuestFilteringReturn {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      if (!guest.users) return false;

      const matchesSearch =
        guest.users.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.users.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.users.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "registered" && guest.is_registered) ||
        (statusFilter === "pending" && !guest.is_registered);

      return matchesSearch && matchesStatus;
    });
  }, [guests, searchQuery, statusFilter]);

  return {
    searchQuery,
    statusFilter,
    filteredGuests,
    setSearchQuery,
    setStatusFilter,
  };
}
