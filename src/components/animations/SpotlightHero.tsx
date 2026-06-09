'use no memo';
'use client';
import { useRef } from 'react';
import { gsap } from '@/lib/animations/gsap.config';
import { useGSAP } from '@gsap/react';

interface SpotlightHeroProps {
  children: React.ReactNode;
  className?: string;
}

export default function SpotlightHero({ children, className = '' }: SpotlightHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!spotlightRef.current || !containerRef.current) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const xTo = gsap.quickTo(spotlightRef.current, 'x', { duration: 0.6, ease: 'power3' });
      const yTo = gsap.quickTo(spotlightRef.current, 'y', { duration: 0.6, ease: 'power3' });

      const onMouseMove = (e: MouseEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };

      window.addEventListener('mousemove', onMouseMove);
      return () => window.removeEventListener('mousemove', onMouseMove);
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div
        ref={spotlightRef}
        className="pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full z-0"
        style={{
          background:
            'radial-gradient(circle, rgba(201,40,14,0.18) 0%, rgba(232,175,15,0.06) 40%, transparent 70%)',
          top: 0,
          left: 0,
        }}
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
