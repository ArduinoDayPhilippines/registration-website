import { useState, useEffect, useCallback } from "react";
import { Guest, GuestStats } from "@/types/guest";
import {
  getEventGuests,
  getGuestStatistics,
} from "@/app/event/[slug]/manage/actions";

interface UseGuestsReturn {
  guests: Guest[];
  stats: GuestStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch and manage event guests
 * @param slug - The event slug
 * @returns Guests data, statistics, loading state, error state, and refetch function
 */
export function useGuests(slug: string): UseGuestsReturn {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState<GuestStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const loadGuests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch guests and statistics in parallel
      const [guestsResult, statsResult] = await Promise.all([
        getEventGuests(slug),
        getGuestStatistics(slug),
      ]);

      if (guestsResult.success && guestsResult.guests) {
        setGuests(guestsResult.guests);
      } else {
        setError(guestsResult.error || "Failed to load guests");
      }

      if (statsResult.success && statsResult.stats) {
        setStats(statsResult.stats);
      }
    } catch (err) {
      setError("Failed to load guests");
      console.error("Error loading guests:", err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      loadGuests();
    }
  }, [slug, loadGuests, refetchTrigger]);

  const refetch = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, []);

  return { guests, stats, loading, error, refetch };
}
