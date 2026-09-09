import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Lock, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import { getErrorMessage } from '../services/api';
import Alert from '../components/Alert';

export default function Checkout() {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await orderService.create(shippingAddress);
      await refreshCart();
      navigate(`/orders/${res.data.data.id}`, { state: { justPlaced: true } });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 py-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Finalizar pedido
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          Ingresa la dirección donde deseas recibir tus productos.
        </p>
      </div>

      {error && <Alert message={error} />}

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
        <h2 className="font-bold text-sm text-zinc-900 pb-3 border-b border-zinc-100">
          Resumen del pedido
        </h2>
        <ul className="flex flex-col gap-2.5 text-xs text-zinc-600">
          {cart.items.map((item) => (
            <li key={item.id} className="flex justify-between items-center py-1">
              <span className="font-medium text-zinc-800">
                {item.product.name} <span className="text-zinc-400 font-normal">x{item.quantity}</span>
              </span>
              <span className="font-bold font-mono text-zinc-950">
                ${item.subtotal.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between items-baseline font-bold text-zinc-900 pt-3 border-t border-zinc-100">
          <span className="text-xs text-zinc-700">Total a pagar</span>
          <span className="font-mono text-xl font-bold text-zinc-950">
            ${cart.total.toFixed(2)}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
          <div>
            <label htmlFor="shippingAddress" className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
              <MapPin className="h-3.5 w-3.5 text-zinc-500" />
              <span>Dirección de envío completa</span>
            </label>
            <textarea
              id="shippingAddress"
              required
              minLength={5}
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-zinc-200/90 bg-zinc-50/50 p-3 text-xs sm:text-sm transition focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="Calle, número, depto / referencia, comuna o ciudad..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-zinc-800 disabled:opacity-60 cursor-pointer"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>{submitting ? 'Procesando pedido...' : 'Confirmar pedido'}</span>
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
            <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" />
            <span>Transacción encriptada y protegida</span>
          </div>
        </div>
      </form>
    </div>
  );
}
