import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { FapshiWebhookSchema } from '@/lib/validations/webhook.schema';
import { generateTicketsForOrder } from '@/lib/services/ticket.service';
import { dispatchTicketWhatsApp } from '@/lib/services/whatsapp.service';
import { TIER_PRICE } from '@/types';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-wh-secret');
  if (secret !== process.env.FAPSHI_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = FapshiWebhookSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const payload = parsed.data;

  const order = await prisma.order.findUnique({
    where: { externalId: payload.externalId ?? '' },
  });

  if (!order) return NextResponse.json({ ok: true });
  if (order.status !== 'PENDING') return NextResponse.json({ ok: true });

  if (payload.status === 'SUCCESSFUL') {
    if (!payload.amount || payload.amount < TIER_PRICE[order.tier]) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'FAILED', fapshiTransId: payload.transId },
      });
      return NextResponse.json({ ok: true });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'SUCCESSFUL',
        fapshiTransId: payload.transId,
        paidAmount: payload.amount,
        revenue: payload.revenue,
        medium: payload.medium,
        payerName: payload.name,
      },
    });

    await generateTicketsForOrder(order.id, order.tier);

    const ticket = await prisma.ticket.findFirst({ where: { orderId: order.id } });
    if (ticket) {
      dispatchTicketWhatsApp({
        phoneNumber: order.phoneNumber,
        buyerName: order.buyerName,
        tier: order.tier,
        qrSlug: ticket.qrSlug,
      }).catch(console.error);
    }
  } else if (payload.status === 'FAILED' || payload.status === 'EXPIRED') {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: payload.status, fapshiTransId: payload.transId },
    });
  }

  return NextResponse.json({ ok: true });
}
