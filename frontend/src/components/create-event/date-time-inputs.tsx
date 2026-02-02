import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DateTimeInputsProps {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  onStartDateChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}

export function DateTimeInputs({
  startDate,
  startTime,
  endDate,
  endTime,
  onStartDateChange,
  onStartTimeChange,
  onEndDateChange,
  onEndTimeChange,
}: DateTimeInputsProps) {
  // Combine date and time for datetime-local input
  const startDateTime = startDate && startTime ? `${startDate}T${startTime}` : '';
  const endDateTime = endDate && endTime ? `${endDate}T${endTime}` : '';

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const [date, time] = value.split('T');
      onStartDateChange(date);
      onStartTimeChange(time);
    }
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const [date, time] = value.split('T');
      onEndDateChange(date);
      onEndTimeChange(time);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Input 
        label="Start" 
        icon={Calendar} 
        type="datetime-local" 
        iconAlwaysActive={true}
        value={startDateTime}
        onChange={handleStartChange}
      />
      <Input 
        label="End" 
        icon={Clock} 
        type="datetime-local" 
        variant="secondary"
        iconAlwaysActive={true}
        value={endDateTime}
        onChange={handleEndChange}
      />
    </div>
  );
}
