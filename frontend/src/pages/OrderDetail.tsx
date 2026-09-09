import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Package } from 'lucide-react';
import { orderService } from '../services/orderService';
import { getErrorMessage } from '../services/api';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import OrderStatusBadge from '../components/OrderStatusBadge';
import type { Order } from '../types';

export default function OrderDetail() {
  const { id } = useParams();
  const location = useLocation();
  const justPlaced = (location.state as { justPlaced?: boolean } | null)?.justPlaced;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    orderService
      .getMyOrderById(Number(id))
      .then((res) => setOrder(res.data.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner label="Cargando pedido..." />;
  if (error) return <Alert message={error} />;
  if (!order) return null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 py-2">
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition w-fit"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Volver a mis pedidos
      </Link>

      {justPlaced && <Alert type="success" message="¡Tu pedido fue creado exitosamente!" />}

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-2xs flex flex-col gap-5">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">
              Pedido #{order.id}
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Realizado el{' '}
              {new Date(order.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="rounded-xl bg-zinc-50/80 p-3.5 border border-zinc-100">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
            <MapPin className="h-3 w-3" />
            <span>Dirección de entrega</span>
          </div>
          <p className="text-xs font-medium text-zinc-800">{order.shippingAddress}</p>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <Package className="h-3 w-3" />
            <span>Detalle de productos</span>
          </div>
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-50/50 border border-zinc-100 text-xs"
            >
              <div>
                <p className="font-semibold text-zinc-900">{item.product.name}</p>
                <p className="text-[11px] text-zinc-500 mt-0.5 font-mono">
                  {item.quantity} x ${Number(item.price).toFixed(2)}
                </p>
              </div>
              <span className="font-mono font-bold text-zinc-950 text-sm">
                ${(item.quantity * Number(item.price)).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-baseline pt-3 border-t border-zinc-100">
          <span className="font-semibold text-zinc-800 text-sm">Total del pedido</span>
          <span className="font-mono text-xl font-bold text-zinc-950">
            ${Number(order.total).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
