import type { OrderStatus } from '../types';

const labels: Record<OrderStatus, string> = {
  PENDING: 'Pendiente',
  PROCESSING: 'En proceso',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
};

const styles: Record<OrderStatus, string> = {
  PENDING: 'bg-accent-50 text-accent-700',
  PROCESSING: 'bg-sky-50 text-sky-700',
  COMPLETED: 'bg-emerald-50 text-emerald-700',
  CANCELLED: 'bg-red-50 text-red-600',
};

const dots: Record<OrderStatus, string> = {
  PENDING: 'bg-accent-500',
  PROCESSING: 'bg-sky-500',
  COMPLETED: 'bg-emerald-500',
  CANCELLED: 'bg-red-500',
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dots[status]}`} aria-hidden="true" />
      {labels[status]}
    </span>
  );
}
