import { useState, useEffect, useCallback } from "react";
import { EventData } from "@/types/event";
import { eventStorage } from "@/lib/storage/event-storage";

interface UseEventReturn {
  event: EventData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch and manage a single event by slug
 * @param slug - The event slug to fetch
 * @returns Event data, loading state, error state, and refetch function
 */
export function useEvent(slug: string): UseEventReturn {
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const loadEvent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 0));

      const foundEvent = eventStorage.getBySlug(slug);
      setEvent(foundEvent);

      if (!foundEvent) {
        setError("Event not found");
      }
    } catch (err) {
      setError("Failed to load event");
      console.error("Error loading event:", err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      loadEvent();
    }
  }, [slug, loadEvent, refetchTrigger]);

  const refetch = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, []);

  return { event, loading, error, refetch };
}
