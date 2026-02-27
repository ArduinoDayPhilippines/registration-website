import { SurveyConfig } from "./survey";

export type QuestionType = 'text' | 'multiple_choice' | 'dropdown' | 'file_upload';

export interface Question {
  id: number;
  text: string;
  required: boolean;
  type: QuestionType;
  options?: string[]; 
  allowedFileTypes?: string[]; 
  validationPattern?: string; 
  validationMessage?: string; 
}

export type QuestionFieldValue = string | boolean | QuestionType | string[];

export interface EventData {
  slug: string;
  title: string;
  // ID of the Supabase auth user who created the event
  organizerId?: string | null;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: string;
  description: string;
  ticketPrice: string;
  capacity: string;
  registeredCount?: number;
  requireApproval: boolean;
  coverImage?: string;
  theme: string;
  questions: Question[];
  createdAt: string;
  postEventSurvey?: SurveyConfig;
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
