import { useState, useEffect, useCallback } from "react";
import { Guest, GuestStats } from "@/types/guest";

interface UseGuestsReturn {
  guests: Guest[];
  stats: GuestStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface GuestsAPIResponse {
  success: boolean;
  guests?: Guest[];
  error?: string;
}

/**
 * Calculate guest statistics from guest list
 */
function calculateStats(guests: Guest[]): GuestStats {
  const totalRegistered = guests.filter((g) => g.is_registered).length;

  return {
    totalRegistered,
    going: totalRegistered,
    checkedIn: 0,
    waitlist: 0,
  };
}

/**
 * Fetch guests from API
 */
async function fetchGuests(slug: string): Promise<GuestsAPIResponse> {
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

/**
 * Custom hook to fetch and manage event guests
 * Optimized to make a single API call and calculate stats from the response
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

      // Single API call to fetch guests
      const result = await fetchGuests(slug);

      if (result.success && result.guests) {
        setGuests(result.guests);
        // Calculate stats from the fetched guests
        const calculatedStats = calculateStats(result.guests);
        setStats(calculatedStats);
      } else {
        setError(result.error || "Failed to load guests");
        setGuests([]);
        setStats(null);
      }
    } catch (err) {
      setError("Failed to load guests");
      setGuests([]);
      setStats(null);
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
