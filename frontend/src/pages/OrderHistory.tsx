import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, ArrowRight, Calendar, Package } from 'lucide-react';
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
    <div className="flex flex-col gap-6 py-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Mis pedidos
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          Consulta el historial y seguimiento de todas tus compras.
        </p>
      </div>

      {error && <Alert message={error} />}

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
            <ClipboardList className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900">Aún no tienes pedidos</h2>
            <p className="mt-1 text-xs text-zinc-500">Cuando realices compras aparecerán listadas aquí.</p>
          </div>
          <Link
            to="/"
            className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 transition"
          >
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3" data-testid="order-list">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="rounded-2xl border border-zinc-200/80 bg-white p-4 sm:p-5 shadow-2xs transition-all hover:border-zinc-300 hover:shadow-sm flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between group"
            >
              <div>
                <p className="font-bold text-zinc-900 text-sm group-hover:text-zinc-700 transition">
                  Pedido #{order.id}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-zinc-400" />
                    {new Date(order.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1 font-medium text-zinc-700">
                    <Package className="h-3 w-3 text-zinc-400" />
                    {order.items.length} producto(s)
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <OrderStatusBadge status={order.status} />
                <span className="font-mono text-base font-bold text-zinc-950">
                  ${Number(order.total).toFixed(2)}
                </span>
                <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
