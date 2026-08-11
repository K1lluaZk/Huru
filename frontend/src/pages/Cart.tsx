import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
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
        <h1 className="text-xl font-semibold text-gray-800">Tu carrito está vacío</h1>
        <Link to="/" className="rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800">
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
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-semibold text-ink">Carrito de compras</h1>

      {error && <Alert message={error} />}

      <div className="flex flex-col gap-4">
        {cart.items.map((item) => (
          <div
            key={item.id}
            data-testid="cart-item"
            className="flex flex-col items-start gap-4 rounded-xl border border-primary-900/10 bg-white p-4 sm:flex-row sm:items-center"
          >
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
              {item.product.imageUrl && (
                <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex-1">
              <Link to={`/products/${item.productId}`} className="font-medium text-gray-900 hover:text-primary-700">
                {item.product.name}
              </Link>
              <p className="text-sm text-gray-500">${Number(item.product.price).toFixed(2)} c/u</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                className="h-8 w-8 rounded-lg border border-primary-900/10 text-gray-600 hover:bg-gray-50"
              >
                -
              </button>
              <span className="w-8 text-center" data-testid="item-quantity">
                {item.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                className="h-8 w-8 rounded-lg border border-primary-900/10 text-gray-600 hover:bg-gray-50"
              >
                +
              </button>
            </div>
            <p className="price-tag w-24 text-right font-semibold text-primary-900">${item.subtotal.toFixed(2)}</p>
            <button
              onClick={() => handleRemove(item.id)}
              className="text-sm font-medium text-red-500 hover:text-red-700"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <div className="ml-auto flex w-full flex-col gap-3 rounded-2xl border border-primary-900/10 bg-white p-6 sm:w-80">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Artículos</span>
          <span>{cart.itemCount}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-primary-900">
          <span className="font-sans font-medium text-gray-700">Total</span>
          <span data-testid="cart-total" className="price-tag">
            ${cart.total.toFixed(2)}
          </span>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="mt-2 w-full rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800"
        >
          Continuar con la compra
        </button>
      </div>
    </div>
  );
}
