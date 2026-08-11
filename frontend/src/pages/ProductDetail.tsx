import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import type { Product } from '../types';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productService
      .getById(Number(id))
      .then((res) => setProduct(res.data.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setError('');
    setSuccess('');
    setAdding(true);
    try {
      await addToCart(Number(id), quantity);
      setSuccess('Producto agregado al carrito');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <Spinner label="Cargando producto..." />;
  if (error && !product) return <Alert message={error} />;
  if (!product) return null;

  return (
    <div className="flex flex-col gap-6">
      <Link to="/" className="text-sm text-primary-700 hover:underline">
        &larr; Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl border border-primary-900/10 bg-primary-50">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-primary-300">Sin imagen</div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {product.category && (
            <span className="w-fit rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-700">
              {product.category.name}
            </span>
          )}
          <h1 className="font-display text-3xl font-semibold text-ink">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          <p className="price-tag text-3xl font-bold text-primary-900">${Number(product.price).toFixed(2)}</p>

          {product.stock > 0 ? (
            <p className="flex items-center gap-1.5 text-sm text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              {product.stock} unidades disponibles
            </p>
          ) : (
            <p className="flex items-center gap-1.5 text-sm text-red-500">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden="true" />
              Producto sin stock
            </p>
          )}

          {success && <Alert type="success" message={success} />}
          {error && <Alert message={error} />}

          {!isAdmin && (
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                className="w-20 rounded-lg border border-primary-900/10 px-3 py-2 text-sm"
                disabled={product.stock === 0}
              />
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || adding}
                data-testid="add-to-cart-button"
                className="flex-1 rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:opacity-50"
              >
                {adding ? 'Agregando...' : 'Agregar al carrito'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
