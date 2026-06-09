// src/components/shared/UniversityLogos.tsx
export default function UniversityLogos({ size = 40 }: { size?: number }) {
  const Shield = () => (
    <svg width={size} height={size * 1.15} viewBox="0 0 40 46" fill="none" aria-hidden="true">
      <path
        d="M20 2L4 9v14c0 10.5 7 19.8 16 22.5C29 42.8 36 33.5 36 23V9L20 2z"
        fill="var(--color-gold-dark)"
        stroke="var(--color-gold)"
        strokeWidth="1.5"
      />
      <path
        d="M20 8L9 13v9c0 7 4.7 13.2 11 15.5C26.3 35.2 31 29 31 22v-9L20 8z"
        fill="var(--color-surface-2)"
      />
      <text
        x="20"
        y="27"
        textAnchor="middle"
        fill="var(--color-gold)"
        fontSize="10"
        fontWeight="bold"
        fontFamily="serif"
      >
        UB
      </text>
    </svg>
  );

  return (
    <div className="flex items-center gap-1" aria-label="University of Buea logos">
      <Shield />
      <Shield />
      <Shield />
    </div>
  );
}
