import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
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
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Link to="/orders" className="text-sm text-primary-700 hover:underline">
        &larr; Volver a mis pedidos
      </Link>

      {justPlaced && <Alert type="success" message="¡Tu pedido fue creado exitosamente!" />}

      <div className="rounded-2xl border border-primary-900/10 bg-white p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Pedido #{order.id}</h1>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Realizado el{' '}
          {new Date(order.createdAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <p className="mt-3 text-sm text-gray-600">
          <span className="font-medium text-gray-800">Dirección de envío:</span> {order.shippingAddress}
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-3 text-sm">
              <div>
                <p className="font-medium text-gray-800">{item.product.name}</p>
                <p className="text-gray-500">
                  {item.quantity} x ${Number(item.price).toFixed(2)}
                </p>
              </div>
              <span className="font-semibold text-gray-900">
                ${(item.quantity * Number(item.price)).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <span>${Number(order.total).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
