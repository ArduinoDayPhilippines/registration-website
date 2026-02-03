'use client';

import { useRef, useState } from 'react';
import { MapPin, Calendar, Clock, FileText, Image as ImageIcon, X, Ticket, Users, Lock, LockOpen, Plus, HelpCircle, Trash2 } from 'lucide-react';
import { Question } from '@/types/event';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createEvent } from '@/app/create-event/action';

interface EventFormProps {
  formData: any;
  updateField: (field: any, value: any) => void;
  addQuestion: () => void;
  removeQuestion: (id: number) => void;
  updateQuestion: (id: number, field: keyof Question, value: string | boolean) => void;
}

export default function EventForm({
  formData,
  updateField,
  addQuestion,
  removeQuestion,
  updateQuestion,
}: EventFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('coverImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateField('coverImage', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const [date, time] = value.split('T');
      updateField('startDate', date);
      updateField('startTime', time);
    }
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const [date, time] = value.split('T');
      updateField('endDate', date);
      updateField('endTime', time);
    }
  };


  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    
   
    if (!formData.title || !formData.startDate || !formData.startTime || !formData.location) {
      setError('Please fill in all required fields');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
     
      const data = new FormData();
      data.append('title', formData.title);
      data.append('startDate', formData.startDate);
      data.append('startTime', formData.startTime);
      data.append('location', formData.location);
      data.append('description', formData.description || '');
      
     
      await createEvent(data);
      
      
    } catch (err) {
      console.error('Create event error:', err);
      setError('Failed to create event. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-h-full">
      {/* Left Column: Cover Image Upload */}
      <div className="flex flex-col gap-4 justify-center">
        <div 
          onClick={handleImageClick}
          className="aspect-[4/4] w-full rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer md:hover:border-primary transition-all duration-300 shadow-2xl shadow-black/50"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {formData.coverImage ? (
            <>
              <img 
                src={formData.coverImage} 
                alt="Cover" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <button
                onClick={handleImageRemove}
                className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors z-10"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-3 md:inset-4 border-2 border-dashed border-white/10 rounded-2xl md:group-hover:border-primary/50 transition-colors" />
              <div className="text-center p-4 relative z-10">
                <div className="bg-white/5 p-2.5 rounded-full mb-2.5 mx-auto w-fit">
                  <ImageIcon className="w-6 h-6 text-white/50" />
                </div>
                <p className="text-base font-bold text-white mb-1 uppercase tracking-wide">Upload Cover Image</p>
                <p className="text-[9px] text-white/40 uppercase tracking-widest">1080x1080 Recommended</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Column: Event Details Form */}
      <div className="flex flex-col justify-center max-h-full">
        <div className="overflow-y-auto custom-scrollbar pr-2 space-y-3.5">
          
          {/* Error message */}
          {error && (
            <div className="bg-red-500/10 border border-red-400/30 rounded-xl px-4 py-3 mb-4">
              <p className="text-red-200 text-xs text-center">{error}</p>
            </div>
          )}

          {/* Event Title */}
          <div className="group relative">
            <label className="text-xs text-secondary font-bold uppercase tracking-widest mb-1 md:mb-2 block">Event Name</label>
            <input 
              type="text" 
              placeholder="Event Name"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full bg-transparent border-none text-3xl md:text-5xl font-urbanist font-bold placeholder-white/10 focus:ring-0 p-0 text-white outline-none"
            />
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white-50/10 group-focus-within:bg-gradient-to-r group-focus-within:from-primary group-focus-within:to-secondary transition-colors" />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input 
              label="Start" 
              icon={Calendar} 
              type="datetime-local" 
              iconAlwaysActive={true}
              value={formData.startDate && formData.startTime ? `${formData.startDate}T${formData.startTime}` : ''}
              onChange={handleStartChange}
            />
            <Input 
              label="End" 
              icon={Clock} 
              type="datetime-local" 
              variant="secondary"
              iconAlwaysActive={true}
              value={formData.endDate && formData.endTime ? `${formData.endDate}T${formData.endTime}` : ''}
              onChange={handleEndChange}
            />
          </div>

          {/* Location */}
          <Input 
            label="Location" 
            icon={MapPin} 
            type="text" 
            placeholder="Add Event Location..."
            value={formData.location}
            onChange={(e) => updateField('location', e.target.value)}
          />

          {/* Description */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-start gap-2.5 hover:border-primary/30 transition-all group focus-within:border-primary">
            <div className="p-2 bg-white-50/5 rounded-lg mt-0.5">
              <FileText className="w-4 h-4 text-white/50" />
            </div>
            <div className="flex-1">
              <label className="text-[9px] text-white/40 uppercase tracking-widest font-bold block">Description</label>
              <textarea 
                placeholder="Details about your event..."
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="bg-transparent border-none outline-none text-sm focus:ring-0 w-full p-0 placeholder-white/20 resize-none h-16 text-white leading-relaxed"
              />
            </div>
          </div>

          {/* Event Options (Visual Only for now as your Action doesn't handle these yet) */}
          <div className="pt-2 space-y-2">
            <h3 className="text-sm font-urbanist font-bold text-white tracking-wide">Event Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 opacity-60">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-white text-xs">Ticket Price: {formData.ticketPrice}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-white text-xs">Approval Required: {formData.requireApproval ? 'Yes' : 'No'}</span>
                </div>
            </div>
          </div>

          {/* Submit Button */}
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
  );
}