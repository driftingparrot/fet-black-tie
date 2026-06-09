// src/components/shared/EventBadge.tsx
interface EventBadgeProps {
  icon: string;
  label: string;
  value: string;
}

export default function EventBadge({ icon, label, value }: EventBadgeProps) {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold bg-surface text-sm font-sans"
      aria-label={`${label}: ${value}`}
    >
      <span aria-hidden="true">{icon}</span>
      <span className="text-text-muted uppercase tracking-wider text-xs">{label}</span>
      <span className="text-gold font-semibold">{value}</span>
    </div>
  );
}
