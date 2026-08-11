import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="font-display text-3xl font-semibold text-ink">Finalizar pedido</h1>

      {error && <Alert message={error} />}

      <div className="rounded-2xl border border-primary-900/10 bg-white p-6">
        <h2 className="mb-3 font-semibold text-gray-800">Resumen del pedido</h2>
        <ul className="flex flex-col gap-2 text-sm text-gray-600">
          {cart.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.product.name} x{item.quantity}
              </span>
              <span>${item.subtotal.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-primary-900/10 pt-3 font-bold text-gray-900">
          <span>Total</span>
          <span>${cart.total.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-primary-900/10 bg-white p-6">
        <div>
          <label htmlFor="shippingAddress" className="mb-1 block text-sm font-medium text-gray-700">
            Dirección de envío
          </label>
          <textarea
            id="shippingAddress"
            required
            minLength={5}
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-primary-900/10 px-3 py-2.5 text-sm transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            placeholder="Calle, número, ciudad, referencia..."
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:opacity-60"
        >
          {submitting ? 'Procesando...' : 'Confirmar pedido'}
        </button>
      </form>
    </div>
  );
}
