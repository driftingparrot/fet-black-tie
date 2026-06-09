'use no memo';
'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/animations/gsap.config';

const TARGET = new Date('2026-07-04T00:00:00+01:00');

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(): TimeLeft {
  const diff = Math.max(0, TARGET.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

const INITIAL: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

export default function CountdownSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(INITIAL);
  const [, setMounted] = useState(false);

  useEffect(() => {
    setTimeLeft(calcTimeLeft());
    setMounted(true);
    const id = setInterval(() => {
      setTimeLeft(calcTimeLeft());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const units = containerRef.current?.querySelectorAll('[data-unit]');
      if (!units?.length) return;
      gsap.set(units, { opacity: 0, scale: 0.8 });
      gsap.to(units, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.5)',
      });
    },
    { scope: containerRef }
  );

  const units: Array<{ label: string; value: number }> = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <section ref={containerRef} aria-label="Countdown to the Gala" className="bg-surface py-20">
      <p className="font-heading text-text-muted mb-12 text-center text-sm uppercase tracking-[0.3em]">
        Time Remaining
      </p>
      <div className="flex items-center justify-center gap-0">
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-center">
            <div data-unit className="flex flex-col items-center px-6 md:px-10">
              <span className="font-display text-gold text-7xl tabular-nums md:text-8xl">
                {pad(unit.value)}
              </span>
              <span className="font-sans text-text-muted mt-2 text-xs uppercase tracking-widest">
                {unit.label}
              </span>
            </div>
            {i < units.length - 1 && <div className="bg-gold/20 h-16 w-px" aria-hidden="true" />}
          </div>
        ))}
      </div>
    </section>
  );
}
