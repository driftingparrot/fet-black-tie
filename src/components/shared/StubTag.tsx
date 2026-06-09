// src/components/shared/StubTag.tsx
import type { TicketTier } from '@/types';

const STUB_COLORS: Record<TicketTier, string> = {
  CLASSIC: 'var(--color-stub-green)',
  CLASSIC_COUPLE: 'var(--color-stub-green)',
  VIP: 'var(--color-stub-vip)',
  VIP_COUPLE: 'var(--color-stub-vip)',
  TABLE_OF_5: 'var(--color-stub-yellow)',
};

const STUB_LABELS: Record<TicketTier, string> = {
  CLASSIC: '5K',
  CLASSIC_COUPLE: '9K',
  VIP: '10K',
  VIP_COUPLE: '18K',
  TABLE_OF_5: '30K',
};

const STUB_SUBLABELS: Record<TicketTier, string> = {
  CLASSIC: 'CLASSIC',
  CLASSIC_COUPLE: 'COUPLE',
  VIP: 'VIP',
  VIP_COUPLE: 'VIP\nCOUPLE',
  TABLE_OF_5: 'TABLE\nOF 5',
};

interface StubTagProps {
  tier: TicketTier;
}

export default function StubTag({ tier }: StubTagProps) {
  return (
    <div
      className="flex flex-col items-center justify-center w-20 shrink-0 rounded-r-md px-2 py-3 select-none"
      style={{ backgroundColor: STUB_COLORS[tier] }}
    >
      <span className="font-display text-3xl text-white leading-none">{STUB_LABELS[tier]}</span>
      <span className="font-display text-xs text-white/80 text-center leading-tight mt-1 whitespace-pre-line">
        {STUB_SUBLABELS[tier]}
      </span>
    </div>
  );
}
