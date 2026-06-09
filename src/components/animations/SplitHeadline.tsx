'use no memo';
'use client';
import { useRef } from 'react';
import { gsap, SplitText } from '@/lib/animations/gsap.config';
import { useGSAP } from '@gsap/react';

interface SplitHeadlineProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function SplitHeadline({ text, className = '', delay = 0 }: SplitHeadlineProps) {
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!headlineRef.current) return;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReduced) {
        gsap.set(headlineRef.current, { opacity: 1 });
        return;
      }

      const split = new SplitText(headlineRef.current, { type: 'chars' });
      gsap.from(split.chars, {
        y: 60,
        opacity: 0,
        rotateX: -40,
        stagger: 0.04,
        duration: 0.7,
        ease: 'power3.out',
        delay,
        onComplete: () => split.revert(),
      });
    },
    { scope: headlineRef }
  );

  return (
    <h1
      ref={headlineRef}
      className={`font-display uppercase leading-none ${className}`}
      style={{ opacity: 0 }}
    >
      {text}
    </h1>
  );
}
