import { Guest } from "@/types/guest";
import { createClient } from "@/lib/supabase/client";

export async function generateQRCodeTicket(guest: Guest, slug: string): Promise<void> {
  try {
    // Check if users data exists
    if (!guest.users) {
      throw new Error('User data not available');
    }

    // Create QR code data - can include registrant_id and other info
    const qrData = JSON.stringify({
      registrant_id: guest.registrant_id,
      event_id: guest.event_id,
      email: guest.users.email,
      name: `${guest.users.first_name || ''} ${guest.users.last_name || ''}`.trim(),
      event_slug: slug,
    });

    // Use QRCode library to generate QR code
    const qrcode = await import('qrcode');
    
    // Create a temporary canvas element
    const canvas = document.createElement('canvas');
    await qrcode.toCanvas(canvas, qrData, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob'));
      }, 'image/png');
    });

    // Upload to Supabase storage
    const supabase = createClient();
    const fileName = `ticket-${guest.users.first_name || 'guest'}-${guest.users.last_name || ''}-${guest.registrant_id.slice(0, 8)}.png`;
    
    const { data, error } = await supabase.storage
      .from('ticket')
      .upload(fileName, blob, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}
