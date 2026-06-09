'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { pollOrderStatus } from '@/actions/booking.actions';
import { TIER_LABELS } from '@/types';
import type { ConfirmationProps } from './types';

export default function ConfirmationPending({
  orderId,
  buyerName,
  tier,
  amount,
  paymentLink,
}: ConfirmationProps) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(async () => {
      const result = await pollOrderStatus(orderId);
      if ('error' in result) return;
      if (result.status !== 'PENDING') {
        router.refresh();
      }
    }, 3000);
    return () => clearInterval(id);
  }, [orderId, router]);

  return (
    <main className="min-h-dvh bg-bg flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full text-center">
        {/* Pulsing ring animation */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="absolute w-24 h-24 rounded-full border-2 border-gold/30 animate-[pulse-ring_1.5s_ease-out_infinite]" />
          <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center">
            <span className="font-display text-gold text-2xl">⏳</span>
          </div>
        </div>

        <h1 className="font-display text-5xl text-text uppercase mb-4">AWAITING PAYMENT</h1>
        <p className="font-sans text-text-muted mb-6">
          Hi <strong className="text-text">{buyerName}</strong>, we&apos;re waiting for payment
          confirmation for your <strong className="text-gold">{TIER_LABELS[tier]}</strong> ticket.
        </p>
        <div className="bg-surface rounded-xl border border-gold/10 p-4 mb-8 text-left">
          <div className="flex justify-between items-center">
            <span className="font-sans text-text-muted text-sm">Amount</span>
            <span className="font-display text-2xl text-gold">
              {amount.toLocaleString('fr-CM')} XAF
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="font-sans text-text-muted text-sm">Status</span>
            <span className="font-heading text-sm text-[#f59e0b] uppercase tracking-wide">
              Pending
            </span>
          </div>
        </div>
        <p className="font-sans text-text-muted text-xs mb-6">
          This page refreshes automatically. Do not close it.
        </p>
        {paymentLink && (
          <a
            href={paymentLink}
            className="font-sans text-gold text-sm underline underline-offset-4 hover:text-gold-light"
          >
            Return to payment page →
          </a>
        )}
      </div>
    </main>
  );
}
