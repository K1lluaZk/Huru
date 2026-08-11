import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-primary-900/5 bg-paper/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-700 font-display text-base font-semibold text-accent-300">
            H
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-primary-900">Huru</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex">
          <Link to="/" className="hover:text-primary-700">
            Catálogo
          </Link>
          {user && !isAdmin && (
            <Link to="/orders" className="hover:text-primary-700">
              Mis pedidos
            </Link>
          )}
          {isAdmin && (
            <>
              <Link to="/admin" className="hover:text-primary-700">
                Dashboard
              </Link>
              <Link to="/admin/products" className="hover:text-primary-700">
                Productos
              </Link>
              <Link to="/admin/orders" className="hover:text-primary-700">
                Pedidos
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!isAdmin && user && (
            <Link
              to="/cart"
              data-testid="cart-link"
              className="relative rounded-lg border border-primary-900/10 px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-primary-300 hover:text-primary-700"
            >
              Carrito
              {cart && cart.itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-xs font-semibold text-primary-900">
                  {cart.itemCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-gray-500 sm:inline">Hola, {user.name.split(' ')[0]}</span>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Salir
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Ingresar
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700"
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
