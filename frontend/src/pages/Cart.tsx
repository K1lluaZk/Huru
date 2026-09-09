import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getErrorMessage } from '../services/api';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

export default function CartPage() {
  const { cart, loading, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  if (loading) return <Spinner label="Cargando carrito..." />;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-zinc-900">Tu carrito está vacío</h1>
          <p className="mt-1 text-xs text-zinc-500">Explora nuestro catálogo y agrega tus productos favoritos.</p>
        </div>
        <Link
          to="/"
          className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 transition"
        >
          Ir al catálogo
        </Link>
      </div>
    );
  }

  const handleQuantityChange = async (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    setError('');
    try {
      await updateQuantity(itemId, quantity);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleRemove = async (itemId: number) => {
    setError('');
    try {
      await removeItem(itemId);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Carrito de compras
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          Revisa tus artículos antes de proceder al pago seguro.
        </p>
      </div>

      {error && <Alert message={error} />}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
        <div className="flex flex-col gap-3 lg:col-span-2">
          {cart.items.map((item) => (
            <div
              key={item.id}
              data-testid="cart-item"
              className="rounded-2xl border border-zinc-200/80 bg-white p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all hover:border-zinc-300"
            >
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 border border-zinc-200/60">
                {item.product.imageUrl ? (
                  <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-bold text-zinc-400">
                    H
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/products/${item.productId}`}
                  className="font-semibold text-zinc-900 hover:text-zinc-700 transition line-clamp-1 text-sm"
                >
                  {item.product.name}
                </Link>
                <p className="text-xs text-zinc-500 font-medium mt-0.5 font-mono">
                  ${Number(item.product.price).toFixed(2)} c/u
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-zinc-50 p-1 rounded-xl border border-zinc-200/70">
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="h-7 w-7 rounded-lg bg-white border border-zinc-200 font-bold text-zinc-700 hover:bg-zinc-100 transition flex items-center justify-center text-xs"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-7 text-center font-bold font-mono text-xs text-zinc-800" data-testid="item-quantity">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="h-7 w-7 rounded-lg bg-white border border-zinc-200 font-bold text-zinc-700 hover:bg-zinc-100 transition flex items-center justify-center text-xs"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              <p className="w-24 text-right font-mono font-bold text-zinc-950 text-base">
                ${item.subtotal.toFixed(2)}
              </p>

              <button
                onClick={() => handleRemove(item.id)}
                className="inline-flex items-center gap-1 rounded-lg border border-red-200/70 bg-red-50/50 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 transition cursor-pointer"
              >
                <Trash2 className="h-3 w-3 text-red-500" />
                Eliminar
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs lg:sticky lg:top-20 flex flex-col gap-4">
          <h2 className="font-bold text-sm text-zinc-900 pb-3 border-b border-zinc-100">
            Resumen del pedido
          </h2>

          <div className="flex justify-between text-xs text-zinc-600">
            <span>Total de artículos</span>
            <span className="font-semibold font-mono text-zinc-900">{cart.itemCount}</span>
          </div>

          <div className="flex justify-between text-xs text-zinc-600">
            <span>Envío</span>
            <span className="font-semibold text-emerald-700 font-mono">GRATIS</span>
          </div>

          <div className="flex justify-between items-baseline pt-3 border-t border-zinc-100">
            <span className="font-semibold text-zinc-800 text-sm">Total</span>
            <span data-testid="cart-total" className="font-mono text-2xl font-bold text-zinc-950">
              ${cart.total.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 transition cursor-pointer"
          >
            <span>Continuar con la compra</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 pt-1">
            <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" />
            <span>Pago seguro garantizado</span>
          </div>
        </div>
      </div>
    </div>
  );
}
