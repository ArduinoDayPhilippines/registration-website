import { useState, useEffect, useCallback } from "react";
import { EventData } from "@/types/event";

interface UseEventReturn {
  event: EventData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch and manage a single event by slug
 * @param slug - The event slug to fetch
 * @returns Event data, loading state, and error state
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

      const response = await fetch(`/api/events/${slug}`);

      if (!response.ok) {
        setEvent(null);
        setError("Event not found");
        return;
      }

      const json = await response.json();
      const apiEvent = json.event as EventData | undefined;

      if (!apiEvent) {
        setEvent(null);
        setError("Event not found");
        return;
      }

      // API already returns EventData shape
      setEvent(apiEvent);
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
