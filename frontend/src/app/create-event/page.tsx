"use client";

import { MapPin } from 'lucide-react';
import { Question } from '@/types/event';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useScrollLock } from '@/hooks/use-scroll-lock';
import { useEventForm } from '@/hooks/event/use-event-form';
import { AdminNavbar } from '@/components/admin/admin-navbar';
import BokehBackground from '@/components/create-event/bokeh-background';
import Squares from '@/components/create-event/squares-background';
import { CoverImageUpload } from '@/components/create-event/cover-image-upload';
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

  useScrollLock();

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#0a1f14] via-[#0a1520] to-[#120c08] text-white-100 relative isolate overflow-hidden font-urbanist flex flex-col custom-scrollbar">
      {/* Bokeh Background Effect */}
      <BokehBackground />
      
      {/* Grid Background */}
      <Squares direction="diagonal" speed={0.3} />

      <AdminNavbar activeTab="create-event" />

      <main className="flex-1 w-full max-w-[1600px] mx-auto relative z-10 px-6 md:px-12 py-8 overflow-hidden h-[calc(100vh-4rem)] mt-16">
        
        <div className="h-full flex items-center justify-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-h-full">
            
            {/* Left Column: Visuals & Preview */}
            <div className="flex flex-col gap-4 justify-center">
              <CoverImageUpload 
                value={formData.coverImage} 
                onChange={(value) => updateField('coverImage', value)} 
              />
            </div>

            {/* Right Column: Event Details Form */}
            <div className="flex flex-col justify-center max-h-full">
              <div className="overflow-y-auto custom-scrollbar pr-2 space-y-3.5">
                
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

                <div className="pt-2">
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
