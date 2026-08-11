import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { getErrorMessage } from '../services/api';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import type { Category, Product } from '../types';

// Same rotation ProductCard uses for category pills, so the quick-filter chips
// and the tags on each card read as the same coded system.
const CHIP_STYLES = [
  'bg-primary-50 text-primary-700 hover:bg-primary-100',
  'bg-accent-50 text-accent-700 hover:bg-accent-100',
  'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
  'bg-sky-50 text-sky-700 hover:bg-sky-100',
];

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const search = searchParams.get('search') || '';
  const categoryId = searchParams.get('categoryId') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    categoryService.list().then((res) => setCategories(res.data.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    productService
      .list({
        search: search || undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
        page,
        limit: 8,
      })
      .then((res) => {
        setProducts(res.data.data);
        setTotalPages(res.data.meta?.totalPages || 1);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [search, categoryId, page]);

  const updateParams = (updates: Record<string, string>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    next.set('page', '1');
    setSearchParams(next);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-3xl bg-primary-900 px-8 py-14 text-primary-50">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: 'radial-gradient(circle, #FAFAF7 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-xl">
          <span className="price-tag inline-block rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-primary-900">
            NUEVOS INGRESOS CADA SEMANA
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Todo lo que buscas, a un clic de distancia
          </h1>
          <p className="mt-4 max-w-lg text-primary-100">
            Electrónica, ropa, hogar y deportes seleccionados con buen precio y stock real.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((c, i) => (
          <button
            key={c.id}
            onClick={() => updateParams({ categoryId: categoryId === String(c.id) ? '' : String(c.id) })}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              categoryId === String(c.id)
                ? 'bg-primary-700 text-white'
                : CHIP_STYLES[i % CHIP_STYLES.length]
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          id="searchInput"
          data-testid="search-input"
          defaultValue={search}
          onKeyDown={(e) => {
            if (e.key === 'Enter') updateParams({ search: (e.target as HTMLInputElement).value });
          }}
          onBlur={(e) => updateParams({ search: e.target.value })}
          placeholder="Buscar productos..."
          className="w-full rounded-xl border border-primary-900/10 bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 sm:max-w-sm"
        />

        <select
          id="categoryFilter"
          data-testid="category-filter"
          value={categoryId}
          onChange={(e) => updateParams({ categoryId: e.target.value })}
          className="rounded-xl border border-primary-900/10 bg-white px-3 py-2.5 text-sm shadow-sm transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {error && <Alert message={error} />}

      {loading ? (
        <Spinner label="Cargando productos..." />
      ) : products.length === 0 ? (
        <p className="py-16 text-center text-gray-500">No se encontraron productos.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={(p) => updateParams({ page: String(p) })} />
    </div>
  );
}
