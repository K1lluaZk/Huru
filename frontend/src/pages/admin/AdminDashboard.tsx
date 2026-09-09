import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, ShoppingBag, DollarSign, AlertTriangle, ArrowUpRight } from 'lucide-react';
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
    {
      label: 'Productos activos',
      value: stats.totalProducts,
      icon: <Package className="h-4 w-4 text-zinc-700" />,
    },
    {
      label: 'Clientes registrados',
      value: stats.totalUsers,
      icon: <Users className="h-4 w-4 text-zinc-700" />,
    },
    {
      label: 'Total de pedidos',
      value: stats.totalOrders,
      icon: <ShoppingBag className="h-4 w-4 text-zinc-700" />,
    },
    {
      label: 'Ingresos totales',
      value: `$${Number(stats.totalRevenue).toFixed(2)}`,
      icon: <DollarSign className="h-4 w-4 text-zinc-700" />,
    },
    {
      label: 'Productos con bajo stock',
      value: stats.lowStockProducts,
      icon: <AlertTriangle className="h-4 w-4 text-amber-600" />,
    },
  ];

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Dashboard administrativo
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Resumen global de ventas, inventario y usuarios en tiempo real.
          </p>
        </div>
        <div className="flex gap-2.5 flex-wrap">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 transition"
          >
            <Package className="h-3.5 w-3.5" />
            Gestionar productos
          </Link>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200/90 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 shadow-2xs hover:bg-zinc-50 hover:border-zinc-300 transition"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Gestionar pedidos
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3 lg:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs transition-all hover:border-zinc-300"
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                {card.label}
              </p>
              <div className="rounded-lg bg-zinc-50 p-1.5 border border-zinc-100">
                {card.icon}
              </div>
            </div>
            <p className="mt-3 font-mono text-2xl font-bold tracking-tight text-zinc-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h2 className="text-sm font-bold text-zinc-900">Pedidos por estado</h2>
              <p className="text-xs text-zinc-500">Distribución de estados actuales</p>
            </div>
            <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-xs font-bold text-zinc-700">
              {stats.totalOrders} total
            </span>
          </div>

          <ul className="mt-4 flex flex-col gap-2.5">
            {stats.ordersByStatus.map((s) => (
              <li
                key={s.status}
                className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50/70 border border-zinc-100 text-xs"
              >
                <OrderStatusBadge status={s.status} />
                <span className="font-bold font-mono text-zinc-800 text-xs">{s.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h2 className="text-sm font-bold text-zinc-900">Pedidos recientes</h2>
              <p className="text-xs text-zinc-500">Últimas transacciones procesadas</p>
            </div>
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-700 hover:text-zinc-950 transition"
            >
              Ver todos <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <ul className="mt-4 flex flex-col gap-2.5">
            {stats.recentOrders.map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50/70 border border-zinc-100 text-xs"
              >
                <div>
                  <p className="font-semibold text-zinc-900">
                    #{order.id} — {order.user?.name}
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <span className="font-mono font-bold text-zinc-950 text-sm">
                  ${Number(order.total).toFixed(2)}
                </span>
              </li>
            ))}
            {stats.recentOrders.length === 0 && (
              <p className="text-xs text-zinc-500 py-6 text-center">Aún no hay pedidos.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
