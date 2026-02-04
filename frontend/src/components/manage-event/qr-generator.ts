import { Guest } from "@/types/guest";

export async function generateQRCodeTicket(guest: Guest, slug: string): Promise<void> {
  try {
    // Create QR code data - can include registrant_id and other info
    const qrData = JSON.stringify({
      registrant_id: guest.registrant_id,
      email: guest.email,
      name: `${guest.first_name} ${guest.last_name}`,
      event_slug: slug,
    });

    // Use QRCode library to generate QR code
    const QRCode = (await import('qrcode')).default;
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    // Create a download link
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `ticket-${guest.first_name}-${guest.last_name}-${guest.registrant_id.slice(0, 8)}.png`;
    link.click();
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}
