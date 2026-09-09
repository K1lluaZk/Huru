import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, Plus, Minus } from 'lucide-react';
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
    <div className="flex flex-col gap-6 py-2">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition w-fit"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Volver al catálogo
      </Link>

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-2xs">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
          <div className="aspect-square overflow-hidden rounded-xl border border-zinc-200/60 bg-zinc-50 relative flex items-center justify-center">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-bold text-zinc-400 text-base">
                Sin imagen
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {product.category && (
              <span className="w-fit rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-700">
                {product.category.name}
              </span>
            )}
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              {product.name}
            </h1>
            <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">{product.description}</p>
            
            <div className="flex items-baseline gap-2 pt-1">
              <span className="font-mono text-3xl font-bold text-zinc-950">
                ${Number(product.price).toFixed(2)}
              </span>
              <span className="text-xs text-zinc-500 font-medium">IVA incluido</span>
            </div>

            {product.stock > 0 ? (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 w-fit">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                {product.stock} unidades disponibles en stock
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20 w-fit">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden="true" />
                Producto sin stock actualmente
              </div>
            )}

            {success && <Alert type="success" message={success} />}
            {error && <Alert message={error} />}

            {!isAdmin && (
              <div className="mt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={product.stock === 0 || quantity <= 1}
                    className="h-10 w-10 flex items-center justify-center rounded-xl border border-zinc-200/90 bg-zinc-50 hover:bg-zinc-100 disabled:opacity-40 transition cursor-pointer"
                  >
                    <Minus className="h-3.5 w-3.5 text-zinc-700" />
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min={1}
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                    className="w-14 rounded-xl border border-zinc-200/90 bg-white py-2 text-center text-sm font-bold font-mono focus:border-zinc-900 focus:outline-none"
                    disabled={product.stock === 0}
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={product.stock === 0 || quantity >= product.stock}
                    className="h-10 w-10 flex items-center justify-center rounded-xl border border-zinc-200/90 bg-zinc-50 hover:bg-zinc-100 disabled:opacity-40 transition cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5 text-zinc-700" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || adding}
                  data-testid="add-to-cart-button"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-zinc-800 disabled:opacity-50 transition cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {adding ? 'Agregando...' : 'Agregar al carrito'}
                </button>
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-zinc-100 pt-4 text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-zinc-400" />
                <span>Envío express disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-zinc-400" />
                <span>Garantía de satisfacción</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
