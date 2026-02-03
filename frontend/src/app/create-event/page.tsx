"use client";

import { useScrollLock } from '@/hooks/use-scroll-lock';
import { useEventForm } from '@/hooks/event/use-event-form';
import { AdminNavbar } from '@/components/admin/admin-navbar';
import BokehBackground from '@/components/create-event/bokeh-background';
import Squares from '@/components/create-event/squares-background';
import EventForm from '@/components/create-event/EventForm';

export default function CreateEventPage() {
  const {
    formData,
    updateField,
    addQuestion,
    removeQuestion,
    updateQuestion,
  } = useEventForm();

  useScrollLock();

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#0a1f14] via-[#0a1520] to-[#120c08] text-white-100 relative isolate overflow-hidden font-urbanist flex flex-col custom-scrollbar">
      <BokehBackground />
      <Squares direction="diagonal" speed={0.3} />

      <AdminNavbar activeTab="create-event" />

      <main className="flex-1 w-full max-w-[1600px] mx-auto relative z-10 px-6 md:px-12 py-8 overflow-hidden h-[calc(100vh-4rem)] mt-16">
        <div className="h-full flex items-center justify-center">
          <EventForm
            formData={formData}
            updateField={updateField}
            addQuestion={addQuestion}
            removeQuestion={removeQuestion}
            updateQuestion={updateQuestion}
          />
        </div>
      </main>
    </div>
  );
}
