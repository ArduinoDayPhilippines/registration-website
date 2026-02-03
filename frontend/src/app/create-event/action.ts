'use server';

import { EventFormData, Question } from '@/types/event';

/**
 * Validation result type
 */
interface ValidationResult {
  success: boolean;
  errors?: string[];
  data?: EventFormData;
}

/**
 * Validates event title
 */
function validateTitle(title: string): string | null {
  console.log('🔍 Validating title:', title);
  
  if (!title || !title.trim()) {
    return 'Event title is required';
  }
  
  if (title.trim().length < 3) {
    return 'Event title must be at least 3 characters long';
  }
  
  if (title.trim().length > 200) {
    return 'Event title must be less than 200 characters';
  }
  
  console.log('✅ Title validation passed');
  return null;
}

/**
 * Validates date and time fields
 */
function validateDateTime(
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string
): string | null {
  console.log('🔍 Validating date/time:', { startDate, startTime, endDate, endTime });
  
  if (!startDate || !startTime) {
    return 'Event start date and time are required';
  }
  
  // Create datetime objects for comparison
  const startDateTime = new Date(`${startDate}T${startTime}`);
  const now = new Date();
  
  if (isNaN(startDateTime.getTime())) {
    return 'Invalid start date or time format';
  }
  
  // Check if event is in the past
  if (startDateTime < now) {
    return 'Event start time cannot be in the past';
  }
  
  // Validate end date/time if provided
  if (endDate && endTime) {
    const endDateTime = new Date(`${endDate}T${endTime}`);
    
    if (isNaN(endDateTime.getTime())) {
      return 'Invalid end date or time format';
    }
    
    if (endDateTime <= startDateTime) {
      return 'Event end time must be after start time';
    }
    
    // Check if event duration is reasonable (not more than 30 days)
    const durationMs = endDateTime.getTime() - startDateTime.getTime();
    const durationDays = durationMs / (1000 * 60 * 60 * 24);
    
    if (durationDays > 30) {
      return 'Event duration cannot exceed 30 days';
    }
  }
  
  console.log('✅ Date/time validation passed');
  return null;
}

/**
 * Validates location field
 */
function validateLocation(location: string): string | null {
  console.log('🔍 Validating location:', location);
  
  if (!location || !location.trim()) {
    return 'Event location is required';
  }
  
  if (location.trim().length < 3) {
    return 'Event location must be at least 3 characters long';
  }
  
  if (location.trim().length > 300) {
    return 'Event location must be less than 300 characters';
  }
  
  console.log('✅ Location validation passed');
  return null;
}

/**
 * Validates description field
 */
function validateDescription(description: string): string | null {
  console.log('🔍 Validating description length:', description?.length || 0);
  
  if (!description || !description.trim()) {
    return 'Event description is required';
  }
  
  if (description.trim().length < 10) {
    return 'Event description must be at least 10 characters long';
  }
  
  if (description.trim().length > 5000) {
    return 'Event description must be less than 5000 characters';
  }
  
  console.log('✅ Description validation passed');
  return null;
}

/**
 * Validates capacity field
 */
function validateCapacity(capacity: string): string | null {
  console.log('🔍 Validating capacity:', capacity);
  
  if (capacity === 'Unlimited') {
    console.log('✅ Capacity is unlimited');
    return null;
  }
  
  const capacityNum = parseInt(capacity);
  
  if (isNaN(capacityNum)) {
    return 'Capacity must be a number or "Unlimited"';
  }
  
  if (capacityNum < 1) {
    return 'Capacity must be at least 1';
  }
  
  if (capacityNum > 100000) {
    return 'Capacity cannot exceed 100,000';
  }
  
  console.log('✅ Capacity validation passed');
  return null;
}

/**
 * Validates ticket price field
 */
function validateTicketPrice(ticketPrice: string): string | null {
  console.log('🔍 Validating ticket price:', ticketPrice);
  
  if (ticketPrice === 'Free') {
    console.log('✅ Event is free');
    return null;
  }
  
  // Remove currency symbols and whitespace
  const priceStr = ticketPrice.replace(/[$,\s]/g, '');
  const price = parseFloat(priceStr);
  
  if (isNaN(price)) {
    return 'Ticket price must be a valid number or "Free"';
  }
  
  if (price < 0) {
    return 'Ticket price cannot be negative';
  }
  
  if (price > 10000) {
    return 'Ticket price cannot exceed $10,000';
  }
  
  console.log('✅ Ticket price validation passed');
  return null;
}

/**
 * Validates registration questions
 */
function validateQuestions(questions: Question[]): string | null {
  console.log('🔍 Validating questions:', questions.length, 'questions found');
  
  if (!Array.isArray(questions)) {
    return 'Questions must be an array';
  }
  
  if (questions.length > 20) {
    return 'Cannot have more than 20 registration questions';
  }
  
  // Validate each question that has text
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    
    if (question.text && question.text.trim()) {
      if (question.text.trim().length < 3) {
        return `Question ${i + 1} must be at least 3 characters long`;
      }
      
      if (question.text.trim().length > 500) {
        return `Question ${i + 1} must be less than 500 characters`;
      }
      
      if (typeof question.required !== 'boolean') {
        return `Question ${i + 1} must have a valid "required" field`;
      }
    }
  }
  
  console.log('✅ Questions validation passed');
  return null;
}

/**
 * Validates cover image URL
 */
function validateCoverImage(coverImage: string): string | null {
  console.log('🔍 Validating cover image:', coverImage ? 'Image provided' : 'No image');
  
  // Cover image is optional
  if (!coverImage || !coverImage.trim()) {
    console.log('ℹ️ No cover image provided (optional)');
    return null;
  }
  
  // Basic URL validation or data URL validation
  const isDataUrl = coverImage.startsWith('data:image/');
  const isHttpUrl = coverImage.startsWith('http://') || coverImage.startsWith('https://');
  
  if (!isDataUrl && !isHttpUrl) {
    return 'Cover image must be a valid URL or data URL';
  }
  
  console.log('✅ Cover image validation passed');
  return null;
}

/**
 * Main validation function for event form data
 * Server action that validates all event data before submission
 */
export async function validateEventData(formData: EventFormData): Promise<ValidationResult> {
  console.log('\n🚀 ===== STARTING EVENT VALIDATION =====');
  console.log('📋 Form Data Received:', {
    title: formData.title,
    startDate: formData.startDate,
    startTime: formData.startTime,
    location: formData.location,
    capacity: formData.capacity,
    ticketPrice: formData.ticketPrice,
    questionsCount: formData.questions?.length || 0,
  });
  
  const errors: string[] = [];
  
  // Validate each field
  const titleError = validateTitle(formData.title);
  if (titleError) errors.push(titleError);
  
  const dateTimeError = validateDateTime(
    formData.startDate,
    formData.startTime,
    formData.endDate,
    formData.endTime
  );
  if (dateTimeError) errors.push(dateTimeError);
  
  const locationError = validateLocation(formData.location);
  if (locationError) errors.push(locationError);
  
  const descriptionError = validateDescription(formData.description);
  if (descriptionError) errors.push(descriptionError);
  
  const capacityError = validateCapacity(formData.capacity);
  if (capacityError) errors.push(capacityError);
  
  const ticketPriceError = validateTicketPrice(formData.ticketPrice);
  if (ticketPriceError) errors.push(ticketPriceError);
  
  const questionsError = validateQuestions(formData.questions);
  if (questionsError) errors.push(questionsError);
  
  const coverImageError = validateCoverImage(formData.coverImage);
  if (coverImageError) errors.push(coverImageError);
  
  // Return results
  if (errors.length > 0) {
    console.error('❌ Validation failed with errors:', errors);
    console.log('===== VALIDATION COMPLETE (FAILED) =====\n');
    return {
      success: false,
      errors,
    };
  }
  
  console.log('✅ All validations passed successfully!');
  console.log('===== VALIDATION COMPLETE (SUCCESS) =====\n');
  
  return {
    success: true,
    data: formData,
  };
}

/**
 * Server action to create event (placeholder for Supabase integration)
 */
export async function createEvent(formData: EventFormData): Promise<{
  success: boolean;
  error?: string;
  slug?: string;
}> {
  console.log('\n🔥 ===== CREATE EVENT ACTION CALLED =====');
  
  // First validate the data
  const validation = await validateEventData(formData);
  
  if (!validation.success) {
    console.error('❌ Validation failed, cannot create event');
    return {
      success: false,
      error: validation.errors?.join(', ') || 'Validation failed',
    };
  }
  
  console.log('✅ Validation successful, proceeding with event creation...');
  
  // TODO: Connect to Supabase here
  // For now, we'll just log and return success
  console.log('📝 Event data ready for database insertion:');
  
  // Create a clean version for logging (without the huge base64 image)
  const dataForLogging = {
    ...validation.data,
    coverImage: validation.data.coverImage 
      ? `[Image data: ${Math.round(validation.data.coverImage.length / 1024)}KB]`
      : 'No image'
  };
  console.log(JSON.stringify(dataForLogging, null, 2));
  
  // Generate a slug (you might have this function elsewhere)
  const slug = formData.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  console.log('🔗 Generated slug:', slug);
  console.log('===== CREATE EVENT COMPLETE =====\n');
  
  return {
    success: true,
    slug,
  };
}
