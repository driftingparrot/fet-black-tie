import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { TIER_LABELS } from '@/types';
import type { ConfirmationProps } from './types';

export default function ConfirmationFailed({ buyerName, tier, paymentLink }: ConfirmationProps) {
  return (
    <main className="min-h-dvh bg-bg flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-red/10 border border-red/40 flex items-center justify-center mx-auto mb-8">
          <span className="text-2xl" aria-hidden="true">
            ✕
          </span>
        </div>
        <h1 className="font-display text-5xl text-text uppercase mb-4">PAYMENT FAILED</h1>
        <p className="font-sans text-text-muted mb-8">
          Hi <strong className="text-text">{buyerName}</strong>, the payment for your{' '}
          <strong className="text-gold">{TIER_LABELS[tier]}</strong> ticket was not completed.
        </p>
        <div className="flex flex-col gap-3">
          {paymentLink && (
            <a
              href={paymentLink}
              className={buttonVariants({
                className: 'bg-gold hover:bg-gold-light text-bg font-heading w-full py-4',
              })}
            >
              Try Again
            </a>
          )}
          <Link
            href="/booking"
            className={buttonVariants({
              variant: 'outline',
              className: 'border-gold/40 text-gold hover:bg-gold/10 w-full py-4',
            })}
          >
            Start New Booking
          </Link>
        </div>
      </div>
    </main>
  );
}
