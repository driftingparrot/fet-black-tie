'use no memo';
'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { gsap, useGSAP } from '@/lib/animations/gsap.config';
import { buttonVariants } from '@/components/ui/button';
import { TIER_PRICE, TIER_LABELS, ALL_TIERS } from '@/types';
import type { TicketTier } from '@/types';

const TIER_INFO: Record<TicketTier, { description: string; premium: boolean }> = {
  CLASSIC: { description: '1 seat — classic entry', premium: false },
  CLASSIC_COUPLE: { description: '2 seats — couples entry', premium: false },
  VIP: { description: '1 VIP seat — premium area', premium: true },
  VIP_COUPLE: { description: '2 VIP seats — couples premium', premium: true },
  TABLE_OF_5: { description: 'Reserved table for 5 guests', premium: true },
};

export default function TicketsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const cards = sectionRef.current?.querySelectorAll('[data-card]');
      if (!cards?.length) return;
      gsap.from(cards, {
        y: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="tickets" aria-label="Ticket Tiers" className="bg-bg py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-7xl md:text-8xl text-text text-center uppercase">
          TICKET TIERS
        </h2>
        <p className="font-script text-2xl text-gold-light/80 text-center mt-2 mb-16">
          Choose your experience
        </p>
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_TIERS.map((tier) => (
            <div
              key={tier}
              data-card
              className={`relative bg-surface rounded-2xl p-8 flex flex-col gap-4 transition-colors border ${
                TIER_INFO[tier].premium
                  ? 'border-gold/30 shadow-[0_0_30px_rgba(232,175,15,0.08)]'
                  : 'border-gold/10 hover:border-gold/40'
              }`}
            >
              {TIER_INFO[tier].premium && (
                <span className="absolute top-4 right-4 font-heading text-xs text-gold uppercase tracking-widest bg-gold/10 px-2 py-1 rounded-full">
                  PREMIUM
                </span>
              )}
              <h3 className="font-heading text-xl text-text">{TIER_LABELS[tier]}</h3>
              <p className="font-display text-5xl text-gold leading-none">
                {TIER_PRICE[tier].toLocaleString('fr-CM')}{' '}
                <span className="font-sans text-lg text-text-muted">XAF</span>
              </p>
              <p className="font-sans text-text-muted text-sm flex-1">
                {TIER_INFO[tier].description}
              </p>
              <Link
                href="/booking"
                className={buttonVariants({
                  variant: 'outline',
                  size: 'sm',
                  className:
                    'border-gold/40 text-gold hover:bg-gold/10 hover:text-gold-light w-full mt-2',
                })}
              >
                Book Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
