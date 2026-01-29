"use client";

import React, { useRef } from 'react';
import { MapPin } from 'lucide-react';
import { Question } from '@/types/event';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useScrollLock } from '@/hooks/use-scroll-lock';
import { useEventForm } from '@/hooks/event/use-event-form';
import { ParallaxBackground } from '@/components/create-event/parallax-background';
import { Navbar } from '@/components/navbar';
import { CoverImageUpload } from '@/components/create-event/cover-image-upload';
import { ThemePreview } from '@/components/create-event/theme-preview';
import { EventTitleInput } from '@/components/create-event/event-title-input';
import { DateTimeInputs } from '@/components/create-event/date-time-inputs';
import { DescriptionInput } from '@/components/create-event/description-input';
import { EventOptions } from '@/components/create-event/event-options';
import { RegistrationQuestions } from '@/components/create-event/registration-questions';

export default function CreateEventPage() {
  const {
    formData,
    updateField,
    addQuestion,
    removeQuestion,
    updateQuestion,
    handleSubmit,
    isSubmitting,
  } = useEventForm();

  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useScrollLock();

  const handleScroll = () => {
    if (containerRef.current && parallaxRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      parallaxRef.current.style.transform = `translateY(${scrollTop * 0.2}px)`;
    }
  };

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className="h-screen w-full bg-[#0a0a0a] text-white-100 relative overflow-y-auto overflow-x-hidden font-montserrat flex flex-col custom-scrollbar"
    >
      <ParallaxBackground ref={parallaxRef} />

      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 relative z-10 px-4 md:px-12 pb-10 items-start">
        
        {/* Left Column: Visuals & Preview */}
        <div className="lg:col-span-5 flex flex-col gap-5 lg:sticky lg:top-24 pt-4 lg:pt-10">
          <CoverImageUpload 
            value={formData.coverImage} 
            onChange={(value) => updateField('coverImage', value)} 
          />
          <ThemePreview 
            value={formData.theme} 
            onChange={(value) => updateField('theme', value)} 
          />
        </div>

        {/* Right Column: Event Details Form */}
        <div className="lg:col-span-7 flex flex-col gap-5 pt-4 lg:pt-10">
           
           <EventTitleInput 
             value={formData.title} 
             onChange={(value) => updateField('title', value)} 
           />

           <DateTimeInputs 
              startDate={formData.startDate}
              startTime={formData.startTime}
              endDate={formData.endDate}
              endTime={formData.endTime}
              onStartDateChange={(value) => updateField('startDate', value)}
              onStartTimeChange={(value) => updateField('startTime', value)}
              onEndDateChange={(value) => updateField('endDate', value)}
              onEndTimeChange={(value) => updateField('endTime', value)}
           />

           <Input 
              label="Location" 
              icon={MapPin} 
              type="text" 
              placeholder="Add Event Location..."
              value={formData.location}
              onChange={(e) => updateField('location', e.target.value)}
           />

           <DescriptionInput 
             value={formData.description} 
             onChange={(value) => updateField('description', value)} 
           />

           <EventOptions 
              ticketPrice={formData.ticketPrice} 
              setTicketPrice={(value) => updateField('ticketPrice', value)}
              capacity={formData.capacity}
              setCapacity={(value) => updateField('capacity', value)}
              requireApproval={formData.requireApproval}
              setRequireApproval={(value) => updateField('requireApproval', value)}
           />

           <RegistrationQuestions 
              questions={formData.questions}
              addQuestion={addQuestion}
              removeQuestion={removeQuestion}
              updateQuestion={(id: number, field: keyof Question, value: string | boolean) => 
                updateQuestion(id, field, value)
              }
           />

           <div className="pt-6">
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                fullWidth
                size="lg"
              >
                {isSubmitting ? 'Creating Event...' : 'Create Event'}
              </Button>
           </div>
           
        </div>
      </main>
    </div>
  );
}
