export interface Question {
  id: number;
  text: string;
  required: boolean;
}

export interface EventData {
  slug: string;
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: string;
  description: string;
  ticketPrice: string;
  capacity: string;
  requireApproval: boolean;
  coverImage?: string;
  theme: string;
  questions: Question[];
  createdAt: string;
}

export interface EventFormData {
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: string;
  description: string;
  coverImage: string;
  theme: string;
  ticketPrice: string;
  capacity: string;
  requireApproval: boolean;
  questions: Question[];
}
