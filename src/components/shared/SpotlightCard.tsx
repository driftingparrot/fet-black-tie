// src/components/shared/SpotlightCard.tsx
'use client';
import { useRef } from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function SpotlightCard({ children, className = '' }: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !glowRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glowRef.current.style.background = `radial-gradient(400px circle at ${x}px ${y}px, rgba(232,175,15,0.08), transparent 70%)`;
  };

  const handleMouseLeave = () => {
    if (glowRef.current) glowRef.current.style.background = 'transparent';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-xl border border-(--color-border) bg-surface transition-colors duration-300 hover:border-gold-dark ${className}`}
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 transition-all duration-300"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
