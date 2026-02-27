import { z } from "zod";

export const EventSlugSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});

export const UpdateEventDetailsSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  capacity: z.string().optional().nullable(),
  ticketPrice: z.string().optional().nullable(),
  requireApproval: z.boolean().optional(),
});

export const UpdateEventSettingsSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  requireApproval: z.boolean(),
});

export const RegistrationQuestionSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  questionId: z.number().optional().nullable(),
  text: z.string().optional().nullable(),
  required: z.boolean().optional(),
});

export const CreateEventSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  startDate: z.string().min(1, "Start date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endDate: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  ticketPrice: z.enum(["free", "paid"]).optional().nullable(),
  requireApproval: z.boolean().optional(),
  capacity: z.string().optional().nullable(),
  questions: z.array(z.object({
    id: z.number(),
    text: z.string().min(1, "Question text cannot be empty"),
    required: z.boolean(),
    type: z.enum(['text', 'multiple_choice', 'dropdown', 'file_upload']),
    options: z.array(z.string()).optional(),
    allowedFileTypes: z.array(z.string()).optional(),
    validationPattern: z.string().optional(),
    validationMessage: z.string().optional(),
  })).optional().nullable(),
});
