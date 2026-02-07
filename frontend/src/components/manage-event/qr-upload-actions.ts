"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function uploadQRCodeToStorage(
  blob: Blob,
  fileName: string
): Promise<{ success: boolean; error?: string; url?: string }> {
  try {
    const supabase = createAdminClient();
    
    // Convert blob to buffer for server-side upload
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

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
