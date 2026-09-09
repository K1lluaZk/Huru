import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Package } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { getErrorMessage } from '../../services/api';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import type { Order, OrderStatus } from '../../types';

const STATUS_OPTIONS: OrderStatus[] = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const loadOrders = () => {
    setLoading(true);
    orderService
      .getAllOrders(statusFilter || undefined)
      .then((res) => setOrders(res.data.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleStatusChange = async (orderId: number, status: OrderStatus) => {
    setError('');
    try {
      await orderService.updateStatus(orderId, status);
      setSuccess(`Pedido #${orderId} actualizado a "${status}"`);
      loadOrders();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) return <Spinner label="Cargando pedidos..." />;

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Gestión de pedidos
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Revisa el estado de las órdenes, clientes y direcciones de despacho.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="statusFilter" className="text-xs font-semibold text-zinc-600">
            Filtrar:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
            className="rounded-xl border border-zinc-200/90 bg-white px-3 py-1.5 text-xs font-medium shadow-2xs transition focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          >
            <option value="">Todos los estados</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <Alert message={error} />}
      {success && <Alert type="success" message={success} />}

      <div className="flex flex-col gap-3" data-testid="admin-order-list">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl border border-zinc-200/80 bg-white p-4 sm:p-5 shadow-2xs transition-all hover:border-zinc-300"
          >
            <div
              className="flex cursor-pointer flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-zinc-900 text-sm">
                    Pedido #{order.id}
                  </p>
                  <span className="text-xs font-medium text-zinc-600">
                    — {order.user?.name}
                  </span>
                  <span className="rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-mono text-zinc-600">
                    {order.user?.email}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  {new Date(order.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  · <span className="font-medium text-zinc-700">{order.items.length} producto(s)</span>
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono font-bold text-zinc-950 text-base">
                  ${Number(order.total).toFixed(2)}
                </span>
                <OrderStatusBadge status={order.status} />
                <select
                  value={order.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                  className="rounded-lg border border-zinc-200/90 bg-zinc-50/70 px-2.5 py-1 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 focus:border-zinc-900 focus:outline-none"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <div className="text-zinc-400">
                  {expandedId === order.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </div>
            </div>

            {expandedId === order.id && (
              <div className="mt-4 flex flex-col gap-3 border-t border-zinc-100 pt-4 text-xs">
                <div className="rounded-xl bg-zinc-50/80 p-3 border border-zinc-100">
                  <div className="flex items-center gap-1.5 text-zinc-500 font-bold uppercase text-[10px] mb-1">
                    <MapPin className="h-3 w-3" />
                    <span>Dirección de envío</span>
                  </div>
                  <p className="text-zinc-800 font-medium">{order.shippingAddress}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-zinc-500 font-bold uppercase text-[10px]">
                    <Package className="h-3 w-3" />
                    <span>Productos del pedido</span>
                  </div>
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2 px-3 rounded-lg bg-zinc-50/50 border border-zinc-100 text-zinc-700 text-xs"
                    >
                      <span className="font-medium">
                        {item.product.name} <span className="text-zinc-400">x{item.quantity}</span>
                      </span>
                      <span className="font-mono font-bold text-zinc-950">
                        ${(item.quantity * Number(item.price)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {orders.length === 0 && (
          <p className="py-12 text-center text-zinc-500 text-xs font-medium">No hay pedidos para mostrar.</p>
        )}
      </div>
    </div>
  );
}
