'use server';
import { createId } from '@paralleldrive/cuid2';
import { prisma } from '@/lib/db/prisma';
import { initiatePayment } from '@/lib/services/fapshi.service';
import { BookingSchema } from '@/lib/validations/booking.schema';
import { TIER_PRICE } from '@/types';

export type BookingActionResult =
  | { success: true; paymentLink: string; orderId: string }
  | { success: false; error: string };

export async function createBookingAction(formData: FormData): Promise<BookingActionResult> {
  const raw = {
    buyerName: formData.get('buyerName'),
    userEmail: formData.get('userEmail'),
    phoneNumber: formData.get('phoneNumber'),
    tier: formData.get('tier'),
  };

  const parsed = BookingSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const { buyerName, userEmail, phoneNumber, tier } = parsed.data;
  const amount = TIER_PRICE[tier];
  const externalId = createId();

  try {
    const order = await prisma.order.create({
      data: { externalId, buyerName, userEmail, phoneNumber, tier, amount },
    });

    const fapshi = await initiatePayment({
      amount,
      email: userEmail,
      externalId,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/confirmation/${order.id}`,
      message: `FET Black Tie Event — ${tier}`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { fapshiTransId: fapshi.transId, fapshiPaymentLink: fapshi.link },
    });

    return { success: true, paymentLink: fapshi.link, orderId: order.id };
  } catch (err) {
    // oxlint-disable-next-line no-console
    console.error('[createBookingAction]', err);
    return { success: false, error: 'Payment initiation failed. Please try again.' };
  }
}

export async function pollOrderStatus(
  orderId: string
): Promise<{ status: string } | { error: string }> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { status: true },
    });
    if (!order) return { error: 'Order not found' };
    return { status: order.status };
  } catch {
    return { error: 'Failed to fetch order status' };
  }
}

export async function getOrderWithTickets(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: { tickets: true },
  });
}
