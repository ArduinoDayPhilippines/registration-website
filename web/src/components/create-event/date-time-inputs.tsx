import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function DateTimeInputs() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Input 
        label="Start" 
        icon={Calendar} 
        type="datetime-local" 
        className="[color-scheme:dark]"
        iconAlwaysActive={true}
      />
      <Input 
        label="End" 
        icon={Clock} 
        type="datetime-local" 
        variant="secondary"
        className="[color-scheme:dark]"
        iconAlwaysActive={true}
      />
    </div>
  );
}
