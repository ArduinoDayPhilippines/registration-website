import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Upload a file to Supabase Storage and return the public URL
 * @param supabase - The Supabase client instance
 * @param file - The file to upload
 * @param eventSlug - The event slug to organize files
 * @returns The public URL of the uploaded file
 */
export async function uploadRegistrationFile(
  supabase: SupabaseClient,
  file: File,
  eventSlug: string
): Promise<string> {

  // Create a unique filename with timestamp
  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop();
  const fileName = `${eventSlug}/${timestamp}-${file.name}`;

  // Upload to the 'registration-files' bucket
  const { data, error } = await supabase.storage
    .from('registration-files')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('File upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from('registration-files')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}


