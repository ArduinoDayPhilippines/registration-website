"use client";

import React, { useState, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useScrollLock } from '@/hooks/use-scroll-lock';
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
  const [ticketPrice, setTicketPrice] = useState("Free");
  const [capacity, setCapacity] = useState("Unlimited");
  const [requireApproval, setRequireApproval] = useState(false);
  const [questions, setQuestions] = useState([
    { id: 1, text: "", required: true },
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Lock body scroll to prevent double scrollbars
  useScrollLock();

  const handleScroll = () => {
    if (containerRef.current && parallaxRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      // Move background slower than foreground (0.2 speed)
      parallaxRef.current.style.transform = `translateY(${scrollTop * 0.2}px)`;
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), text: "", required: false }]);
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: number, field: string, value: string | boolean) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className="h-screen w-full bg-[#0a0a0a] text-white-100 relative overflow-y-auto overflow-x-hidden font-montserrat flex flex-col custom-scrollbar"
    >
      <ParallaxBackground ref={parallaxRef} />

      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 px-6 md:px-12 pb-10 items-start">
        
        {/* Left Column: Visuals & Preview */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24 pt-10">
          <CoverImageUpload />
          <ThemePreview />
        </div>

        {/* Right Column: Event Details Form */}
        <div className="lg:col-span-7 flex flex-col gap-8 pt-10">
           
           <EventTitleInput />

           <DateTimeInputs />

           {/* Location */}
           <Input 
              label="Location" 
              icon={MapPin} 
              type="text" 
              placeholder="Add Event Location..." 
           />

           <DescriptionInput />

           <EventOptions 
              ticketPrice={ticketPrice} 
              setTicketPrice={setTicketPrice}
              capacity={capacity}
              setCapacity={setCapacity}
              requireApproval={requireApproval}
              setRequireApproval={setRequireApproval}
           />

           <RegistrationQuestions 
              questions={questions}
              addQuestion={addQuestion}
              removeQuestion={removeQuestion}
              updateQuestion={updateQuestion}
           />

           {/* Main Action Action */}
           <div className="pt-6">
                <button className="w-full py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(0,128,128,0.3)] hover:shadow-[0_0_30px_rgba(0,128,128,0.5)] active:scale-[0.99] transform duration-200">
                    Create Event
                </button>
           </div>
           
        </div>
      </main>
    </div>
  );
}
