import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { EventFormData, Question, EventData } from '@/types/event';
import { eventStorage } from '@/lib/storage/event-storage';
import { generateSlug } from '@/lib/utils/slug';
import { validateEventData, createEvent } from '@/app/create-event/action';

interface UseEventFormReturn {
  formData: EventFormData;
  updateField: <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => void;
  addQuestion: () => void;
  removeQuestion: (id: number) => void;
  updateQuestion: (id: number, field: keyof Question, value: string | boolean) => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
}

const initialFormData: EventFormData = {
  title: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  location: '',
  description: '',
  coverImage: '',
  theme: 'Minimal Dark',
  ticketPrice: 'Free',
  capacity: 'Unlimited',
  requireApproval: false,
  questions: [{ id: 1, text: '', required: true }],
};

/**
 * Custom hook to manage event creation form state and logic
 * @returns Form data, update functions, and submit handler
 */
export function useEventForm(): UseEventFormReturn {
  const router = useRouter();
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback(<K extends keyof EventFormData>(
    field: K,
    value: EventFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const addQuestion = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, { id: Date.now(), text: '', required: false }],
    }));
  }, []);

  const removeQuestion = useCallback((id: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id),
    }));
  }, []);

  const updateQuestion = useCallback((
    id: number,
    field: keyof Question,
    value: string | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === id ? { ...q, [field]: value } : q
      ),
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    console.log('Form submission started');
    console.log('Sending data to server action for validation...');
    
    try {
      setIsSubmitting(true);

      // Call server action to validate data
      const validation = await validateEventData(formData);
      
      if (!validation.success) {
        console.error('Server validation failed:', validation.errors);
        alert(`Validation errors:\n${validation.errors?.join('\n')}`);
        return;
      }

      console.log('Server validation passed!');
      console.log('Creating event...');

      // Call server action to create event
      const result = await createEvent(formData);
      
      if (!result.success) {
        console.error('Event creation failed:', result.error);
        alert(`Failed to create event: ${result.error}`);
        return;
      }

      console.log(' Event created successfully!');
      console.log('Event slug:', result.slug);

      // For now, still save to local storage as well
      const slug = result.slug || generateSlug(formData.title);
      const eventData: EventData = {
        slug,
        title: formData.title,
        startDate: formData.startDate,
        startTime: formData.startTime,
        endDate: formData.endDate || formData.startDate,
        endTime: formData.endTime || formData.startTime,
        location: formData.location,
        description: formData.description,
        ticketPrice: formData.ticketPrice,
        capacity: formData.capacity,
        requireApproval: formData.requireApproval,
        coverImage: formData.coverImage,
        theme: formData.theme,
        questions: formData.questions.filter(q => q.text.trim() !== ''),
        createdAt: new Date().toISOString(),
      };

      console.log('Saving to local storage...');
      eventStorage.save(eventData);
      console.log('Local storage updated');
      console.log('Redirecting to event page...');
      router.push(`/event/${slug}`);
    } catch (error) {
      console.error('Error during submission:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
      console.log('Form submission complete');
    }
  }, [formData, router]);

  return {
    formData,
    updateField,
    addQuestion,
    removeQuestion,
    updateQuestion,
    handleSubmit,
    isSubmitting,
  };
}
