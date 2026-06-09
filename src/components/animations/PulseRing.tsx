'use client';
import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/animations/gsap.config';

type PulseVariant = 'success' | 'error' | 'warning' | 'idle';

const VARIANT_COLORS: Record<PulseVariant, string> = {
  success: 'var(--color-success)',
  error: 'var(--color-error)',
  warning: 'var(--color-warning)',
  idle: 'var(--color-gold)',
};

interface PulseRingProps {
  variant: PulseVariant;
  size?: number;
}

export default function PulseRing({ variant, size = 120 }: PulseRingProps) {
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const ring3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rings = [ring1Ref.current, ring2Ref.current, ring3Ref.current].filter(Boolean);

    if (prefersReduced) {
      rings.forEach((r) => r && gsap.set(r, { opacity: 0.4, scale: 1 }));
      return;
    }

    const tween = gsap.to(rings, {
      scale: 1.8,
      opacity: 0,
      duration: 1.5,
      ease: 'power2.out',
      stagger: 0.4,
      repeat: -1,
    });
    return () => {
      tween.kill();
    };
  }, [variant]);

  const color = VARIANT_COLORS[variant];

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {[ring1Ref, ring2Ref, ring3Ref].map((ref, i) => (
        <div
          key={i}
          ref={ref}
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: color, opacity: 0.7 - i * 0.2 }}
        />
      ))}
      <div
        className="rounded-full border-2 z-10"
        style={{
          width: size * 0.4,
          height: size * 0.4,
          borderColor: color,
          backgroundColor: `${color}22`,
        }}
      />
    </div>
  );
}
