import { Guest } from "@/types/guest";
import { createClient } from "@/lib/supabase/client";

interface GenerateQRResult {
  success: boolean;
  error?: string;
  publicUrl?: string;
}

interface BulkGenerateQRResult {
  success: boolean;
  uploadedCount: number;
  error?: string;
}

/**
 * Generate QR code data for a guest
 */
function createQRData(guest: Guest, slug?: string): string {
  return JSON.stringify({
    registrant_id: guest.registrant_id,
    event_id: guest.event_id,
    email: guest.users?.email || '',
    name: `${guest.users?.first_name || ''} ${guest.users?.last_name || ''}`.trim(),
    ...(slug && { event_slug: slug }),
  });
}

/**
 * Generate QR code canvas from data
 */
async function generateQRCanvas(qrData: string): Promise<HTMLCanvasElement> {
  const qrcode = await import('qrcode');
  const canvas = document.createElement('canvas');
  
  await qrcode.toCanvas(canvas, qrData, {
    width: 400,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });

  return canvas;
}

/**
 * Convert canvas to blob
 */
function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to create blob'));
    }, 'image/png');
  });
}

/**
 * Generate filename for QR code
 */
function generateFileName(guest: Guest): string {
  const firstName = guest.users?.first_name || 'guest';
  const lastName = guest.users?.last_name || '';
  const shortId = guest.registrant_id.slice(0, 8);
  return `ticket-${firstName}-${lastName}-${shortId}.png`;
}

/**
 * Upload QR code to Supabase storage
 */
async function uploadQRCode(
  blob: Blob,
  fileName: string
): Promise<{ success: boolean; error?: string; publicUrl?: string }> {
  const supabase = createClient();

  const { error } = await supabase.storage
    .from('ticket')
    .upload(fileName, blob, {
      contentType: 'image/png',
      upsert: true,
    });

  if (error) {
    return { success: false, error: error.message };
  }

  const { data: urlData } = supabase.storage
    .from('ticket')
    .getPublicUrl(fileName);

  return { success: true, publicUrl: urlData.publicUrl };
}

/**
 * Verify user is authenticated
 */
async function verifyAuthentication(): Promise<{ authenticated: boolean; error?: string }> {
  const supabase = createClient();
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) {
    return { authenticated: false, error: 'You must be logged in to generate QR codes' };
  }

  return { authenticated: true };
}

/**
 * Generate QR code for a single guest
 */
export async function generateGuestQRCode(
  guest: Guest,
  slug?: string
): Promise<GenerateQRResult> {
  try {
    // Verify authentication
    const authResult = await verifyAuthentication();
    if (!authResult.authenticated) {
      return { success: false, error: authResult.error };
    }

    // Verify user data exists
    if (!guest.users) {
      return { success: false, error: 'User data not available' };
    }

    // Generate QR code
    const qrData = createQRData(guest, slug);
    const canvas = await generateQRCanvas(qrData);
    const blob = await canvasToBlob(canvas);

    // Upload to storage
    const fileName = generateFileName(guest);
    const uploadResult = await uploadQRCode(blob, fileName);

    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error };
    }

    return { success: true, publicUrl: uploadResult.publicUrl };
  } catch (error) {
    console.error('Error generating QR code:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate QR codes for multiple guests
 */
export async function bulkGenerateGuestQRCodes(
  guests: Guest[],
  slug?: string,
  onProgress?: (current: number, total: number) => void
): Promise<BulkGenerateQRResult> {
  try {
    // Verify authentication
    const authResult = await verifyAuthentication();
    if (!authResult.authenticated) {
      return { success: false, uploadedCount: 0, error: authResult.error };
    }

    if (guests.length === 0) {
      return { success: false, uploadedCount: 0, error: 'No guests selected' };
    }

    let uploadedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < guests.length; i++) {
      const guest = guests[i];

      if (!guest.users) {
        errors.push(`Skipped guest ${guest.registrant_id}: No user data`);
        continue;
      }

      try {
        const result = await generateGuestQRCode(guest, slug);

        if (result.success) {
          uploadedCount++;
        } else {
          errors.push(`Failed for ${guest.users.email}: ${result.error}`);
        }

        // Report progress
        if (onProgress) {
          onProgress(i + 1, guests.length);
        }

        // Small delay between uploads to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        errors.push(
          `Error for ${guest.users.email}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    const hasErrors = errors.length > 0;
    return {
      success: uploadedCount > 0,
      uploadedCount,
      ...(hasErrors && { error: errors.join('; ') }),
    };
  } catch (error) {
    console.error('Error in bulk QR generation:', error);
    return {
      success: false,
      uploadedCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
