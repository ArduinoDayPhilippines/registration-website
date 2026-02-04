import { useState, useEffect, useCallback } from "react";
import { Guest, GuestStats } from "@/types/guest";

interface UseGuestsReturn {
  guests: Guest[];
  stats: GuestStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface GuestsResult {
  success: boolean;
  guests?: Guest[];
  error?: string;
}

interface GuestStatsResult {
  success: boolean;
  stats?: GuestStats;
  error?: string;
}

async function getEventGuests(slug: string): Promise<GuestsResult> {
  try {
    const response = await fetch(`/api/registrants/${slug}`);
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || "Failed to fetch guests" };
    }
    
    return { success: true, guests: data.guests || [] };
  } catch (error) {
    console.error("Error fetching guests:", error);
    return { success: false, error: "Failed to fetch guests" };
  }
}

async function getGuestStatistics(slug: string): Promise<GuestStatsResult> {
  try {
    const response = await fetch(`/api/registrants/${slug}`);
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || "Failed to fetch statistics" };
    }
    
    const guests = data.guests || [];
    const totalRegistered = guests.filter((g: Guest) => g.is_registered).length;
    
    return {
      success: true,
      stats: {
        totalRegistered,
        going: totalRegistered,
        checkedIn: 0,
        waitlist: 0,
      },
    };
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return {
      success: true,
      stats: {
        totalRegistered: 0,
        going: 0,
        checkedIn: 0,
        waitlist: 0,
      },
    };
  }
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
