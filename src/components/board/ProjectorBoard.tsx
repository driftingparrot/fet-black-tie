'use no memo';
'use client';
import { useState, useEffect, useRef } from 'react';
import { gsap, useGSAP } from '@/lib/animations/gsap.config';
import type { AnonymousMessage } from '@/generated/prisma/client';

interface Props {
  messages: AnonymousMessage[];
}

export default function ProjectorBoard({ messages }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (messages.length <= 1) return;
    const id = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % messages.length);
    }, 6000);
    return () => clearInterval(id);
  }, [messages.length]);

  // Animate card in when index changes
  useGSAP(
    () => {
      if (!cardRef.current) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    },
    { scope: containerRef, dependencies: [currentIndex] }
  );

  if (messages.length === 0) {
    return (
      <div className="min-h-dvh bg-[var(--color-bg)] flex flex-col items-center justify-center px-8 text-center">
        <p className="font-display text-5xl text-[var(--color-surface-2)] uppercase select-none">
          No messages yet
        </p>
        <p className="font-sans text-[var(--color-text-muted)] text-lg mt-4">
          Messages will appear here once approved
        </p>
      </div>
    );
  }

  const msg = messages[currentIndex];

  return (
    <div
      ref={containerRef}
      className="min-h-dvh bg-[var(--color-bg)] flex flex-col"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Header bar */}
      <div className="bg-[var(--color-surface)] border-b border-[color-mix(in_oklch,var(--color-gold),transparent_80%)] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[var(--color-gold)] animate-pulse" />
          <p className="font-heading text-sm text-[var(--color-text-muted)] uppercase tracking-widest">
            FET BLACK TIE GALA 2026
          </p>
        </div>
        <p className="font-sans text-[var(--color-text-muted)] text-xs">
          {currentIndex + 1} / {messages.length}
        </p>
      </div>

      {/* Main message display */}
      <div className="flex-1 flex flex-col items-center justify-center px-12 md:px-24 text-center">
        <div ref={cardRef}>
          <p className="font-script text-2xl md:text-3xl text-[color-mix(in_oklch,var(--color-gold-light),transparent_40%)] mb-6">
            {msg?.displayName ? `— ${msg.displayName}` : '— Anonymous'}
          </p>
          <blockquote className="font-sans text-3xl md:text-4xl lg:text-5xl text-[var(--color-text)] leading-relaxed font-light max-w-4xl">
            &ldquo;{msg?.content}&rdquo;
          </blockquote>
        </div>
      </div>

      {/* Progress bar */}
      <ProgressBar key={currentIndex} duration={6000} />

      {/* Footer */}
      <div className="bg-[var(--color-surface)] border-t border-[color-mix(in_oklch,var(--color-gold),transparent_90%)] px-8 py-3 text-center">
        <p className="font-sans text-[var(--color-text-muted)] text-xs uppercase tracking-widest">
          Faculty of Engineering and Technology · University of Buea
        </p>
      </div>
    </div>
  );
}

function ProgressBar({ duration }: { duration: number }) {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!barRef.current) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.fromTo(
        barRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: duration / 1000, ease: 'none', transformOrigin: 'left' }
      );
    },
    { scope: barRef, dependencies: [] }
  );

  return (
    <div className="h-1 bg-[var(--color-surface)] w-full">
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-[var(--color-gold-dark)] via-[var(--color-gold)] to-[var(--color-gold-light)]"
        style={{ transformOrigin: 'left' }}
      />
    </div>
  );
}
