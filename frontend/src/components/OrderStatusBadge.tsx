import type { OrderStatus } from '../types';

const config: Record<
  OrderStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  PENDING: {
    label: 'Pendiente',
    bg: 'bg-amber-500/10',
    text: 'text-amber-700',
    border: 'border-amber-500/20',
    dot: 'bg-amber-500',
  },
  PROCESSING: {
    label: 'En proceso',
    bg: 'bg-sky-500/10',
    text: 'text-sky-700',
    border: 'border-sky-500/20',
    dot: 'bg-sky-500',
  },
  COMPLETED: {
    label: 'Completado',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-700',
    border: 'border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
  CANCELLED: {
    label: 'Cancelado',
    bg: 'bg-red-500/10',
    text: 'text-red-700',
    border: 'border-red-500/20',
    dot: 'bg-red-500',
  },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const item = config[status] || config.PENDING;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${item.bg} ${item.text} ${item.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} aria-hidden="true" />
      {item.label}
    </span>
  );
}
