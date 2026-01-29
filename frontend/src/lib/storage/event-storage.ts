import { EventData } from '@/types/event';

const EVENTS_STORAGE_KEY = 'events';

export const eventStorage = {
  /**
   * Get all events from localStorage
   */
  getAll(): EventData[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
      return storedEvents ? JSON.parse(storedEvents) : [];
    } catch (error) {
      console.error('Error reading events from localStorage:', error);
      return [];
    }
  },

  /**
   * Get a single event by slug
   */
  getBySlug(slug: string): EventData | null {
    const events = this.getAll();
    return events.find(event => event.slug === slug) || null;
  },

  /**
   * Save a new event
   */
  save(event: EventData): void {
    try {
      const events = this.getAll();
      events.push(event);
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    } catch (error) {
      console.error('Error saving event to localStorage:', error);
      throw new Error('Failed to save event');
    }
  },

  /**
   * Update an existing event
   */
  update(slug: string, updatedEvent: EventData): void {
    try {
      const events = this.getAll();
      const index = events.findIndex(event => event.slug === slug);
      
      if (index !== -1) {
        events[index] = updatedEvent;
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
      } else {
        throw new Error('Event not found');
      }
    } catch (error) {
      console.error('Error updating event in localStorage:', error);
      throw new Error('Failed to update event');
    }
  },

  /**
   * Delete an event by slug
   */
  delete(slug: string): void {
    try {
      const events = this.getAll();
      const filteredEvents = events.filter(event => event.slug !== slug);
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(filteredEvents));
    } catch (error) {
      console.error('Error deleting event from localStorage:', error);
      throw new Error('Failed to delete event');
    }
  },
};
