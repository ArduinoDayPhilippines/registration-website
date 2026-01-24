import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { EventFormData, Question, EventData } from '@/types/event';
import { eventStorage } from '@/lib/storage/event-storage';
import { generateSlug } from '@/lib/utils/slug';

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

  const validateForm = (): string | null => {
    if (!formData.title.trim()) {
      return 'Please enter an event title';
    }
    if (!formData.startDate || !formData.startTime) {
      return 'Please enter event start date and time';
    }
    return null;
  };

  const handleSubmit = useCallback(() => {
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      const slug = generateSlug(formData.title);
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

      eventStorage.save(eventData);
      router.push(`/event/${slug}`);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
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
