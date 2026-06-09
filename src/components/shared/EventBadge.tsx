// src/components/shared/EventBadge.tsx
interface EventBadgeProps {
  icon: string;
  label: string;
  value: string;
}

export default function EventBadge({ icon, label, value }: EventBadgeProps) {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-gold)] bg-[var(--color-surface)] text-sm font-sans"
      aria-label={`${label}: ${value}`}
    >
      <span aria-hidden="true">{icon}</span>
      <span className="text-[var(--color-text-muted)] uppercase tracking-wider text-xs">
        {label}
      </span>
      <span className="text-[var(--color-gold)] font-semibold">{value}</span>
    </div>
  );
}
