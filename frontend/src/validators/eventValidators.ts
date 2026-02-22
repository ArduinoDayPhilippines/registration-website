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
  title: z.string()
    .min(1, "Event title is required")
    .max(200, "Event title must be at most 200 characters")
    .trim(),
  startDate: z.string()
    .min(1, "Start date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format")
    .refine((date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, "Start date must be a valid date"),
  startTime: z.string()
    .min(1, "Start time is required")
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Start time must be in HH:MM format (24-hour)"),
  endDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format")
    .refine((date) => {
      if (!date) return true;
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, "End date must be a valid date")
    .optional()
    .nullable(),
  endTime: z.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "End time must be in HH:MM format (24-hour)")
    .optional()
    .nullable(),
  location: z.string()
    .max(500, "Location must be at most 500 characters")
    .optional()
    .nullable(),
  description: z.string()
    .max(5000, "Description must be at most 5000 characters")
    .optional()
    .nullable(),
  ticketPrice: z.enum(["free", "paid"]).optional().nullable(),
  requireApproval: z.boolean().optional(),
  capacity: z.string()
    .refine((val) => {
      if (!val) return true;
      const num = Number(val);
      return !isNaN(num) && num > 0 && Number.isInteger(num);
    }, "Capacity must be a positive integer")
    .optional()
    .nullable(),
  questions: z.array(z.object({
    id: z.string().or(z.number()),
    text: z.string()
      .min(1, "Question text cannot be empty")
      .max(500, "Question text must be at most 500 characters")
      .trim(),
  })).optional().nullable(),
}).refine((data) => {
  if (data.endDate && data.startDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end >= start;
  }
  return true;
}, {
  message: "End date must be on or after start date",
  path: ["endDate"],
}).refine((data) => {
  if (data.startDate && data.endDate && data.startDate === data.endDate && data.startTime && data.endTime) {
    const [startHour, startMin] = data.startTime.split(':').map(Number);
    const [endHour, endMin] = data.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    return endMinutes > startMinutes;
  }
  return true;
}, {
  message: "End time must be after start time on the same day",
  path: ["endTime"],
});
