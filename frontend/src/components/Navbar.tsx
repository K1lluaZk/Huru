import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Package,
  LayoutDashboard,
  ClipboardList,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-md transition-all">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 h-16">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white font-display text-sm font-bold shadow-xs transition-transform group-hover:scale-105">
            H
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-zinc-900">
            Huru
          </span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-1 text-sm font-medium text-zinc-600">
          <Link
            to="/"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              isActive('/')
                ? 'bg-zinc-100 text-zinc-950 font-bold'
                : 'hover:bg-zinc-50 hover:text-zinc-900'
            }`}
          >
            <Package className="h-3.5 w-3.5" />
            Catálogo
          </Link>

          {user && !isAdmin && (
            <Link
              to="/orders"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                isActive('/orders')
                  ? 'bg-zinc-100 text-zinc-950 font-bold'
                  : 'hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <ClipboardList className="h-3.5 w-3.5" />
              Mis pedidos
            </Link>
          )}

          {isAdmin && (
            <>
              <Link
                to="/admin"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isActive('/admin')
                    ? 'bg-zinc-100 text-zinc-950 font-bold'
                    : 'hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </Link>
              <Link
                to="/admin/products"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isActive('/admin/products')
                    ? 'bg-zinc-100 text-zinc-950 font-bold'
                    : 'hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <Package className="h-3.5 w-3.5" />
                Productos
              </Link>
              <Link
                to="/admin/orders"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isActive('/admin/orders')
                    ? 'bg-zinc-100 text-zinc-950 font-bold'
                    : 'hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <ClipboardList className="h-3.5 w-3.5" />
                Pedidos
              </Link>
            </>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {!isAdmin && user && (
            <Link
              to="/cart"
              data-testid="cart-link"
              className="relative inline-flex items-center gap-2 rounded-lg border border-zinc-200/90 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-2xs hover:border-zinc-300 hover:bg-zinc-50 transition"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-zinc-600" />
              <span>Carrito</span>
              {cart && cart.itemCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-900 px-1 font-mono text-[10px] font-bold text-white">
                  {cart.itemCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex items-center gap-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
                  <UserIcon className="h-3 w-3" />
                </div>
                <span className="text-xs font-medium text-zinc-700">
                  Hola, {user.name.split(' ')[0]}
                </span>
                {isAdmin && (
                  <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-zinc-700 border border-zinc-200">
                    ADMIN
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200/80 bg-zinc-50 px-2.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 transition"
              >
                <LogOut className="h-3 w-3 text-zinc-500" />
                Salir
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 transition"
              >
                Ingresar
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 transition"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
