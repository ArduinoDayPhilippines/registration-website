import { useState, useEffect } from 'react';
import { EventData } from '@/types/event';
import { eventStorage } from '@/lib/storage/event-storage';

interface UseEventReturn {
  event: EventData | null;
  loading: boolean;
  error: string | null;
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

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const foundEvent = eventStorage.getBySlug(slug);
        setEvent(foundEvent);
        
        if (!foundEvent) {
          setError('Event not found');
        }
      } catch (err) {
        setError('Failed to load event');
        console.error('Error loading event:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadEvent();
    }
  }, [slug]);

  return { event, loading, error };
}
