// src/components/shared/TicketCard.tsx
'use client';
import UniversityLogos from './UniversityLogos';
import StubTag from './StubTag';
import type { TicketTier } from '@/types';
import { TIER_LABELS, TIER_PRICE, TIER_SLOTS } from '@/types';

interface TicketCardProps {
  tier: TicketTier;
  selected?: boolean;
  onSelect?: () => void;
}

export default function TicketCard({ tier, selected = false, onSelect }: TicketCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        'relative flex w-full max-w-lg rounded-md overflow-hidden cursor-pointer',
        'border transition-all duration-200',
        'bg-[var(--color-surface)]',
        selected
          ? 'border-[var(--color-gold)] shadow-[0_0_20px_rgba(232,175,15,0.3)]'
          : 'border-[var(--color-border)] hover:border-[var(--color-gold-dark)]',
        'active:scale-[0.98]',
      ].join(' ')}
      aria-pressed={selected}
      aria-label={`Select ${TIER_LABELS[tier]} ticket — ${TIER_PRICE[tier].toLocaleString()} XAF`}
    >
      {/* Dashed tear-line */}
      <div className="absolute right-20 top-0 bottom-0 border-l border-dashed border-[var(--color-border)] z-10" />

      {/* Main ticket body */}
      <div className="flex-1 p-4 flex flex-col gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <UniversityLogos size={24} />
          <span className="font-display text-lg text-[var(--color-gold)] uppercase tracking-wide ml-2 truncate">
            FET Black Tie Event
          </span>
        </div>

        <div className="h-px bg-[var(--color-border)]" />

        <div className="flex flex-wrap gap-2 text-xs text-[var(--color-text-muted)]">
          <span>📍 {process.env.NEXT_PUBLIC_VENUE ?? 'The Millennium Hall'}</span>
          <span>🗓️ 4 Jul 2026</span>
          <span>⏰ 6:00 PM</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="font-heading text-xl text-white">{TIER_LABELS[tier]}</span>
          <span className="text-xs text-[var(--color-text-muted)]">
            {TIER_SLOTS[tier]} {TIER_SLOTS[tier] === 1 ? 'slot' : 'slots'}
          </span>
        </div>

        <div className="flex gap-3 text-base">
          <span title="Fried rice">🍛</span>
          <span title="Champagne">🍾</span>
          <span title="Soft drink">🥤</span>
        </div>
      </div>

      {/* Tear stub */}
      <StubTag tier={tier} />
    </button>
  );
}
