'use client';

import { useState } from 'react';
import { createBookingAction } from '@/actions/booking.actions';
import { Button } from '@/components/ui/button';
import { TIER_PRICE, TIER_LABELS, TIER_SLOTS, ALL_TIERS } from '@/types';
import type { TicketTier } from '@/types';

type Step = 'select-tier' | 'fill-details' | 'submitting' | 'redirecting';

const PREMIUM_TIERS = new Set<TicketTier>(['VIP', 'VIP_COUPLE', 'TABLE_OF_5']);

export default function BookingForm() {
  const [step, setStep] = useState<Step>('select-tier');
  const [tier, setTier] = useState<TicketTier | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStep('submitting');

    const formData = new FormData(e.currentTarget);
    const result = await createBookingAction(formData);

    if (!result.success) {
      setError(result.error);
      setStep('fill-details');
      return;
    }

    setStep('redirecting');
    window.location.href = result.paymentLink;
  }

  const inputClass =
    'w-full bg-surface border border-gold/20 rounded-lg px-4 py-3 text-text placeholder:text-text-muted focus:outline-none focus:border-gold/60 transition-colors font-sans text-sm';
  const labelClass = 'font-heading text-sm text-text-muted uppercase tracking-wide mb-2 block';

  if (step === 'select-tier') {
    return (
      <div>
        <p className="font-heading text-text-muted text-sm uppercase tracking-wide mb-6">
          Select your ticket tier
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ALL_TIERS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTier(t);
                setStep('fill-details');
              }}
              className={`relative text-left w-full rounded-2xl p-6 border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 ${
                tier === t
                  ? 'bg-surface border-gold shadow-[0_0_20px_rgba(232,175,15,0.15)]'
                  : 'bg-surface border-gold/10 hover:border-gold/40'
              }`}
            >
              {PREMIUM_TIERS.has(t) && (
                <span className="absolute top-3 right-3 font-heading text-xs text-gold bg-gold/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
                  PREMIUM
                </span>
              )}
              <p className="font-heading text-lg text-text">{TIER_LABELS[t]}</p>
              <p className="font-display text-4xl text-gold mt-1">
                {TIER_PRICE[t].toLocaleString('fr-CM')}{' '}
                <span className="font-sans text-sm text-text-muted">XAF</span>
              </p>
              <p className="font-sans text-text-muted text-xs mt-2">
                {TIER_SLOTS[t]} {TIER_SLOTS[t] === 1 ? 'person' : 'people'}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setStep('select-tier')}
        className="font-sans text-text-muted text-sm hover:text-text transition-colors mb-8 flex items-center gap-1"
      >
        ← Change tier
      </button>

      {tier && (
        <div className="bg-surface-2 rounded-xl p-4 flex justify-between items-center mb-6 border border-gold/20">
          <div>
            <p className="font-heading text-sm text-text-muted uppercase tracking-wide">
              Selected Tier
            </p>
            <p className="font-heading text-lg text-text mt-0.5">{TIER_LABELS[tier]}</p>
          </div>
          <p className="font-display text-3xl text-gold">
            {TIER_PRICE[tier].toLocaleString('fr-CM')}{' '}
            <span className="font-sans text-xs text-text-muted">XAF</span>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input type="hidden" name="tier" value={tier ?? ''} />

        <div>
          <label htmlFor="buyerName" className={labelClass}>
            Full Name
          </label>
          <input
            id="buyerName"
            name="buyerName"
            type="text"
            required
            placeholder="Jean-Baptiste Ngoumo"
            className={inputClass}
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="userEmail" className={labelClass}>
            Email Address
          </label>
          <input
            id="userEmail"
            name="userEmail"
            type="email"
            required
            placeholder="you@example.com"
            className={inputClass}
            maxLength={200}
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className={labelClass}>
            WhatsApp / Phone
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            required
            placeholder="+237 6XX XXX XXX"
            className={inputClass}
            maxLength={20}
          />
        </div>

        {error && (
          <p
            role="alert"
            className="font-sans text-sm text-red bg-red/5 border border-red/20 rounded-lg px-4 py-3"
          >
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={step === 'submitting' || step === 'redirecting'}
          className="w-full bg-gold hover:bg-gold-light text-bg font-heading text-base py-5 disabled:opacity-60"
        >
          {step === 'submitting'
            ? 'Processing...'
            : step === 'redirecting'
              ? 'Redirecting to payment...'
              : 'Proceed to Payment →'}
        </Button>

        <p className="font-sans text-text-muted text-xs text-center flex items-center justify-center gap-2">
          <span aria-hidden="true">🔒</span>
          <span>Secure payment via Fapshi · Mobile Money &amp; Cards accepted</span>
        </p>
      </form>
    </div>
  );
}
