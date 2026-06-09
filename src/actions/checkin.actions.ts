'use server';
import { prisma } from '@/lib/db/prisma';
import { cookies } from 'next/headers';
import type { CheckInResult } from '@/types';

async function requireAdmin() {
  const store = await cookies();
  if (store.get('admin_token')?.value !== process.env.ADMIN_SECRET) {
    throw new Error('Unauthorized');
  }
}

export async function processQRScan(qrSlug: string): Promise<CheckInResult | { error: string }> {
  try {
    await requireAdmin();
  } catch {
    return { error: 'Unauthorized' };
  }

  const ticket = await prisma.ticket.findUnique({
    where: { qrSlug },
    include: { order: { select: { buyerName: true, tier: true, status: true } } },
  });

  if (!ticket) return { error: 'Ticket not found' };
  if (ticket.order.status !== 'SUCCESSFUL') {
    return { error: 'Payment not confirmed for this ticket' };
  }
  if (ticket.isFullyUsed) {
    return {
      allowed: false,
      partial: false,
      denied: true,
      buyerName: ticket.order.buyerName,
      tier: ticket.order.tier,
      slotsUsed: ticket.slotsUsed,
      slotsTotal: ticket.slotsTotal,
      message: 'All slots for this ticket have been used.',
    };
  }

  const newSlotsUsed = ticket.slotsUsed + 1;
  const fullyUsed = newSlotsUsed >= ticket.slotsTotal;
  const now = new Date();

  await prisma.ticket.update({
    where: { qrSlug },
    data: {
      slotsUsed: newSlotsUsed,
      isFullyUsed: fullyUsed,
      firstScanAt: ticket.firstScanAt ?? now,
      lastScanAt: now,
    },
  });

  return {
    allowed: true,
    partial: !fullyUsed && ticket.slotsTotal > 1,
    denied: false,
    buyerName: ticket.order.buyerName,
    tier: ticket.order.tier,
    slotsUsed: newSlotsUsed,
    slotsTotal: ticket.slotsTotal,
    message: fullyUsed
      ? 'All slots used — entry complete.'
      : `Entry ${newSlotsUsed}/${ticket.slotsTotal} recorded.`,
  };
}
