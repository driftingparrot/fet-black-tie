'use no memo';
'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { gsap, SplitText, useGSAP } from '@/lib/animations/gsap.config';
import SpotlightHero from '@/components/animations/SpotlightHero';
import { buttonVariants } from '@/components/ui/button';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const preTitleRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const dateRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.from(preTitleRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.2,
        ease: 'power2.out',
      });

      const split1 = new SplitText(line1Ref.current, { type: 'chars,words' });
      gsap.from(split1.chars, {
        y: 80,
        opacity: 0,
        stagger: 0.03,
        duration: 0.8,
        delay: 0.4,
        ease: 'power3.out',
      });

      const split2 = new SplitText(line2Ref.current, { type: 'chars,words' });
      gsap.from(split2.chars, {
        y: 80,
        opacity: 0,
        stagger: 0.03,
        duration: 0.8,
        delay: 0.7,
        ease: 'power3.out',
      });

      gsap.from([subtitleRef.current, dateRef.current], {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 1.0,
        stagger: 0.1,
        ease: 'power2.out',
      });

      gsap.from(ctaRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        delay: 1.2,
        ease: 'back.out(1.5)',
      });

      gsap.to(scrollIndicatorRef.current, {
        y: 8,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: 'sine.inOut',
      });

      return () => {
        split1.revert();
        split2.revert();
      };
    },
    { scope: containerRef }
  );

  return (
    <SpotlightHero className="min-h-dvh flex flex-col items-center justify-center relative bg-bg px-6 text-center">
      <div ref={containerRef} className="relative z-10 flex flex-col items-center gap-0">
        <p
          ref={preTitleRef}
          className="font-sans text-gold text-sm uppercase tracking-[0.3em] mb-8"
        >
          FACULTY OF ENGINEERING AND TECHNOLOGY
        </p>
        <h1
          ref={line1Ref}
          className="font-display text-[8rem] md:text-[10rem] lg:text-[14rem] leading-none text-text uppercase"
        >
          BLACK TIE
        </h1>
        <h1
          ref={line2Ref}
          className="font-display text-[8rem] md:text-[10rem] lg:text-[14rem] leading-none uppercase bg-gradient-to-r from-[--color-gold-dark] via-[--color-gold] to-[--color-gold-light] bg-clip-text text-transparent"
        >
          GALA
        </h1>
        <p ref={subtitleRef} className="font-script text-3xl md:text-4xl text-gold-light/80 mt-6">
          An evening of elegance &amp; excellence
        </p>
        <p
          ref={dateRef}
          className="font-sans text-text-muted text-sm tracking-widest mt-4 uppercase"
        >
          July 4, 2026 · University of Buea
        </p>
        <div ref={ctaRef}>
          <Link
            href="/booking"
            className={buttonVariants({
              size: 'lg',
              className:
                'mt-10 bg-gold hover:bg-gold-light text-bg font-heading text-lg px-10 py-6',
            })}
          >
            Secure Your Seat
          </Link>
        </div>
      </div>
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold/60"
      >
        <ChevronDown className="h-8 w-8" />
      </div>
    </SpotlightHero>
  );
}
