'use no memo';
'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import SpotlightHero from '@/components/animations/SpotlightHero';
import { gsap, SplitText, useGSAP } from '@/lib/animations/gsap.config';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const preTitleRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const dateRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const tl = gsap.timeline();

      // Pre-title fade + slide up
      if (preTitleRef.current) {
        gsap.set(preTitleRef.current, { opacity: 0, y: 20 });
        tl.to(preTitleRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.2);
      }

      // "BLACK TIE" SplitText chars stagger
      if (line1Ref.current) {
        const split1 = new SplitText(line1Ref.current, { type: 'chars' });
        gsap.set(split1.chars, { opacity: 0, y: 80 });
        tl.to(
          split1.chars,
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.03, ease: 'power3.out' },
          0.4
        );
        tl.add(() => {}, '>');
        // Revert is handled by useGSAP cleanup
        containerRef.current?.addEventListener('gsap:cleanup', () => split1.revert(), {
          once: true,
        });
      }

      // "GALA" SplitText chars stagger
      if (line2Ref.current) {
        const split2 = new SplitText(line2Ref.current, { type: 'chars' });
        gsap.set(split2.chars, { opacity: 0, y: 80 });
        tl.to(
          split2.chars,
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.03, ease: 'power3.out' },
          0.7
        );
        containerRef.current?.addEventListener('gsap:cleanup', () => split2.revert(), {
          once: true,
        });
      }

      // Subtitle + date fade up
      const fadeTargets = [subtitleRef.current, dateRef.current].filter(Boolean);
      if (fadeTargets.length > 0) {
        gsap.set(fadeTargets, { opacity: 0, y: 20 });
        tl.to(
          fadeTargets,
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
          1.0
        );
      }

      // CTA scale + fade
      if (ctaRef.current) {
        gsap.set(ctaRef.current, { opacity: 0, scale: 0.8 });
        tl.to(ctaRef.current, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }, 1.2);
      }

      // Scroll indicator perpetual bounce
      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          y: 8,
          repeat: -1,
          yoyo: true,
          duration: 1.2,
          ease: 'power1.inOut',
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <SpotlightHero className="min-h-dvh bg-bg">
      <section
        ref={containerRef}
        aria-label="Hero — FET Black Tie Gala 2026"
        className="relative flex min-h-dvh flex-col items-center justify-center px-6 text-center"
      >
        {/* Pre-title */}
        <p
          ref={preTitleRef}
          className="font-sans text-gold mb-6 text-sm uppercase tracking-[0.3em]"
        >
          Faculty of Engineering and Technology
        </p>

        {/* Main title */}
        <h1 className="flex flex-col items-center leading-none">
          <span
            ref={line1Ref}
            className="font-display text-text text-8xl leading-none md:text-[10rem] lg:text-[14rem]"
          >
            BLACK TIE
          </span>
          <span
            ref={line2Ref}
            className="font-display bg-linear-to-r from-gold-dark via-gold to-gold-light bg-clip-text text-8xl leading-none text-transparent md:text-[10rem] lg:text-[14rem]"
          >
            GALA
          </span>
        </h1>

        {/* Subtitle */}
        <p ref={subtitleRef} className="font-script text-gold-light/80 mt-4 text-3xl md:text-4xl">
          An evening of elegance &amp; excellence
        </p>

        {/* Date/venue */}
        <p ref={dateRef} className="font-sans text-text-muted mt-6 text-base tracking-widest">
          July 4, 2026 · University of Buea
        </p>

        {/* CTA */}
        <Link
          ref={ctaRef}
          // href="/booking"
          href="/"
          className="font-heading bg-gold text-bg hover:bg-gold-light mt-10 inline-flex items-center justify-center rounded-lg px-10 py-6 text-lg transition-colors"
        >
          Secure Your Seat
        </Link>

        {/* Scroll indicator */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          aria-hidden="true"
        >
          <ChevronDown className="text-gold/60 size-6" />
        </div>
      </section>
    </SpotlightHero>
  );
}
