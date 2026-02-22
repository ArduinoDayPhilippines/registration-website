"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Upload QR code to storage
 * Uses authenticated client - RLS policies should control access
 */
export async function uploadQRCodeToStorage(
  blob: Blob,
  fileName: string
): Promise<{ success: boolean; error?: string; url?: string }> {
  try {
    const supabase = await createClient();
    
    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized - must be logged in" };
    }
    
    // Convert blob to buffer for server-side upload
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // RLS policies on storage bucket should control access
    const { data, error } = await supabase.storage
      .from('ticket')
      .upload(fileName, buffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('ticket')
      .getPublicUrl(fileName);

    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    console.error('Error uploading QR code:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
