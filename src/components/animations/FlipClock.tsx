'use no memo';
'use client';
import { useRef, useState, useEffect } from 'react';
import { Flip } from '@/lib/animations/gsap.config';
import { useGSAP } from '@gsap/react';

function getTimeLeft(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

function Digit({ value, label }: { value: number; label: string }) {
  const digitRef = useRef<HTMLSpanElement>(null);
  const prevRef = useRef(value);

  useGSAP(
    () => {
      if (!digitRef.current || value === prevRef.current) return;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        prevRef.current = value;
        return;
      }

      const state = Flip.getState(digitRef.current);
      prevRef.current = value;
      Flip.from(state, { duration: 0.35, ease: 'power2.inOut' });
    },
    { dependencies: [value], scope: digitRef }
  );

  return (
    <div className="flex flex-col items-center">
      <div className="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg px-4 py-2 min-w-[64px] text-center">
        <span
          ref={digitRef}
          className="font-display text-4xl text-[var(--color-gold)] tabular-nums"
        >
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="font-sans text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] mt-1">
        {label}
      </span>
    </div>
  );
}

export default function FlipClock() {
  const eventDate = process.env.NEXT_PUBLIC_EVENT_DATE ?? '2026-07-04T18:00:00';
  const [time, setTime] = useState(() => getTimeLeft(eventDate));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(eventDate)), 1000);
    return () => clearInterval(id);
  }, [eventDate]);

  return (
    <div className="flex gap-3 items-center" aria-label="Countdown to event">
      <Digit value={time.days} label="days" />
      <span className="font-display text-3xl text-[var(--color-gold)] mb-4">:</span>
      <Digit value={time.hours} label="hrs" />
      <span className="font-display text-3xl text-[var(--color-gold)] mb-4">:</span>
      <Digit value={time.minutes} label="min" />
      <span className="font-display text-3xl text-[var(--color-gold)] mb-4">:</span>
      <Digit value={time.seconds} label="sec" />
    </div>
  );
}
