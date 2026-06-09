import { prisma } from '@/lib/db/prisma';
import { TIER_SLOTS } from '@/types';
import type { TicketTier } from '@/types';
import QRCode from 'qrcode';

export async function generateTicketsForOrder(orderId: string, tier: TicketTier): Promise<void> {
  const slots = TIER_SLOTS[tier];
  await prisma.ticket.create({
    data: {
      orderId,
      slotsTotal: slots,
    },
  });
}

export async function generateQRDataUrl(qrSlug: string): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/checkin/${qrSlug}`;
  return QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
    color: { dark: '#E8AF0F', light: '#12121A' },
  });
}
