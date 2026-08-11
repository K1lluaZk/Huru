import { useEffect, useState } from 'react';
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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-ink">Gestión de pedidos</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
          className="rounded-lg border border-primary-900/10 px-3 py-2 text-sm"
        >
          <option value="">Todos los estados</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && <Alert message={error} />}
      {success && <Alert type="success" message={success} />}

      <div className="flex flex-col gap-3" data-testid="admin-order-list">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border border-primary-900/10 bg-white p-4">
            <div
              className="flex cursor-pointer flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
            >
              <div>
                <p className="font-semibold text-gray-900">
                  Pedido #{order.id} — {order.user?.name} ({order.user?.email})
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('es-ES')} · {order.items.length} producto(s)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-900">${Number(order.total).toFixed(2)}</span>
                <OrderStatusBadge status={order.status} />
                <select
                  value={order.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                  className="rounded-lg border border-primary-900/10 px-2 py-1 text-xs"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {expandedId === order.id && (
              <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium text-gray-800">Dirección:</span> {order.shippingAddress}
                </p>
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-600">
                    <span>
                      {item.product.name} x{item.quantity}
                    </span>
                    <span>${(item.quantity * Number(item.price)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {orders.length === 0 && <p className="py-8 text-center text-gray-500">No hay pedidos para mostrar.</p>}
      </div>
    </div>
  );
}
