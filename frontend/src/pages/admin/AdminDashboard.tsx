import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { getErrorMessage } from '../../services/api';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import type { DashboardStats } from '../../types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService
      .getDashboard()
      .then((res) => setStats(res.data.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Cargando dashboard..." />;
  if (error) return <Alert message={error} />;
  if (!stats) return null;

  const cards = [
    { label: 'Productos activos', value: stats.totalProducts },
    { label: 'Clientes registrados', value: stats.totalUsers },
    { label: 'Total de pedidos', value: stats.totalOrders },
    { label: 'Ingresos totales', value: `$${Number(stats.totalRevenue).toFixed(2)}` },
    { label: 'Productos con bajo stock', value: stats.lowStockProducts },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-ink">Dashboard administrativo</h1>
        <div className="flex gap-2">
          <Link to="/admin/products" className="rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800">
            Gestionar productos
          </Link>
          <Link to="/admin/orders" className="rounded-lg border border-primary-900/10 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            Gestionar pedidos
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-primary-900/10 border-t-2 border-t-accent-400 bg-white p-4"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{card.label}</p>
            <p className="price-tag mt-2 text-2xl font-bold text-primary-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-primary-900/10 bg-white p-6">
          <h2 className="mb-4 font-semibold text-gray-800">Pedidos por estado</h2>
          <ul className="flex flex-col gap-3">
            {stats.ordersByStatus.map((s) => (
              <li key={s.status} className="flex items-center justify-between text-sm">
                <OrderStatusBadge status={s.status} />
                <span className="font-semibold text-gray-800">{s.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-primary-900/10 bg-white p-6">
          <h2 className="mb-4 font-semibold text-gray-800">Pedidos recientes</h2>
          <ul className="flex flex-col gap-3">
            {stats.recentOrders.map((order) => (
              <li key={order.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-gray-800">#{order.id} — {order.user?.name}</p>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('es-ES')}</p>
                </div>
                <span className="font-semibold text-gray-800">${Number(order.total).toFixed(2)}</span>
              </li>
            ))}
            {stats.recentOrders.length === 0 && <p className="text-sm text-gray-500">Aún no hay pedidos.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}
