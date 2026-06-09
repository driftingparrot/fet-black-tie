import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { TIER_LABELS, TIER_SLOTS } from '@/types';
import type { ConfirmationProps } from './types';
import QRCodeImage from './QRCodeImage';

export default function ConfirmationSuccess({
  buyerName,
  userEmail,
  tier,
  amount,
  tickets,
}: ConfirmationProps) {
  return (
    <main className="min-h-dvh bg-bg py-20 px-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-success/10 border border-success/40 flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl" aria-hidden="true">
              ✓
            </span>
          </div>
          <h1 className="font-display text-6xl text-text uppercase">BOOKING CONFIRMED</h1>
          <p className="font-script text-2xl text-gold-light/80 mt-2">Your seat is secured</p>
        </div>

        {/* Order summary */}
        <div className="bg-surface rounded-2xl border border-gold/10 p-6 mb-8">
          <h2 className="font-heading text-sm text-text-muted uppercase tracking-wide mb-4">
            Order Summary
          </h2>
          <div className="flex flex-col gap-3">
            <Row label="Name" value={buyerName} />
            <Row label="Email" value={userEmail} />
            <Row label="Tier" value={TIER_LABELS[tier]} highlight />
            <Row
              label="Guests"
              value={`${TIER_SLOTS[tier]} ${TIER_SLOTS[tier] === 1 ? 'person' : 'people'}`}
            />
            <Row label="Amount Paid" value={`${amount.toLocaleString('fr-CM')} XAF`} highlight />
          </div>
        </div>

        {/* QR tickets */}
        <div className="mb-8">
          <h2 className="font-heading text-sm text-text-muted uppercase tracking-wide mb-4 text-center">
            Your {tickets.length === 1 ? 'Ticket' : 'Tickets'}
          </h2>
          <div className="flex flex-col gap-6">
            {tickets.map((ticket, i) => (
              <div
                key={ticket.id}
                className="bg-surface-2 rounded-2xl border border-gold/20 p-6 text-center"
              >
                {tickets.length > 1 && (
                  <p className="font-heading text-xs text-text-muted uppercase tracking-widest mb-4">
                    Ticket {i + 1} of {tickets.length}
                  </p>
                )}
                <QRCodeImage qrSlug={ticket.qrSlug} />
                <p className="font-sans text-text-muted text-xs mt-4">
                  Present this QR code at the entrance
                </p>
                <p className="font-sans text-text-muted text-xs mt-1">
                  {ticket.slotsTotal} {ticket.slotsTotal === 1 ? 'entry slot' : 'entry slots'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Event reminder */}
        <div className="bg-surface rounded-xl border border-gold/10 p-5 mb-8 text-center">
          <p className="font-heading text-sm text-gold uppercase tracking-wide">
            Saturday, 4 July 2026
          </p>
          <p className="font-sans text-text-muted text-sm mt-1">
            The Millennium Hall, University of Buea
          </p>
          <p className="font-sans text-text-muted text-sm">Dress code: Black Tie Formal</p>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className={buttonVariants({
              variant: 'outline',
              className: 'border-gold/40 text-gold hover:bg-gold/10',
            })}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

function Row({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gold/5 last:border-0">
      <span className="font-sans text-text-muted text-sm">{label}</span>
      <span className={`font-heading text-sm ${highlight ? 'text-gold' : 'text-text'}`}>
        {value}
      </span>
    </div>
  );
}
