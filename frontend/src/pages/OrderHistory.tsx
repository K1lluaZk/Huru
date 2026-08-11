import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { getErrorMessage } from '../services/api';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import OrderStatusBadge from '../components/OrderStatusBadge';
import type { Order } from '../types';

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    orderService
      .getMyOrders()
      .then((res) => setOrders(res.data.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Cargando historial de pedidos..." />;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-semibold text-ink">Mis pedidos</h1>

      {error && <Alert message={error} />}

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-gray-500">Aún no tienes pedidos.</p>
          <Link to="/" className="rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800">
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3" data-testid="order-list">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="flex flex-col gap-2 rounded-xl border border-primary-900/10 bg-white p-4 transition hover:border-primary-300 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-gray-900">Pedido #{order.id}</p>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  · {order.items.length} producto(s)
                </p>
              </div>
              <div className="flex items-center gap-4">
                <OrderStatusBadge status={order.status} />
                <span className="font-bold text-gray-900">${Number(order.total).toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
