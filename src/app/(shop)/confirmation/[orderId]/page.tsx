import { notFound } from 'next/navigation';
import { getOrderWithTickets } from '@/actions/booking.actions';
import ConfirmationPending from '@/components/confirmation/ConfirmationPending';
import ConfirmationSuccess from '@/components/confirmation/ConfirmationSuccess';
import ConfirmationFailed from '@/components/confirmation/ConfirmationFailed';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Booking Confirmation — FET Black Tie Gala 2026',
};

interface Props {
  params: Promise<{ orderId: string }>;
}

export default async function ConfirmationPage({ params }: Props) {
  const { orderId } = await params;
  const order = await getOrderWithTickets(orderId);
  if (!order) notFound();

  const pageProps = {
    orderId: order.id,
    buyerName: order.buyerName,
    userEmail: order.userEmail,
    tier: order.tier,
    amount: order.amount,
    paymentLink: order.fapshiPaymentLink ?? null,
    tickets: order.tickets,
  };

  if (order.status === 'SUCCESSFUL') {
    return <ConfirmationSuccess {...pageProps} />;
  }
  if (order.status === 'FAILED' || order.status === 'EXPIRED') {
    return <ConfirmationFailed {...pageProps} />;
  }
  // PENDING
  return <ConfirmationPending {...pageProps} />;
}
