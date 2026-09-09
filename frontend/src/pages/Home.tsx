import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { getErrorMessage } from '../services/api';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import type { Category, Product } from '../types';

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
    <div className="flex flex-col gap-6 py-2">
      {/* Minimalist Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900 px-6 py-10 sm:px-10 sm:py-14 text-zinc-100 shadow-xs border border-zinc-800">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, #FAFAF7 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-[11px] font-semibold text-zinc-300">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>NUEVOS INGRESOS CADA SEMANA</span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl text-white">
            Todo lo que buscas, a un clic de distancia
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Electrónica, moda, hogar y deportes seleccionados con la mejor calidad y stock garantizado en tiempo real.
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={() => updateParams({ categoryId: '' })}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
            !categoryId
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'bg-white border border-zinc-200/90 text-zinc-700 hover:bg-zinc-50'
          }`}
        >
          Todas
        </button>
        {categories.map((c) => {
          const isSelected = categoryId === String(c.id);
          return (
            <button
              key={c.id}
              onClick={() => updateParams({ categoryId: isSelected ? '' : String(c.id) })}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                isSelected
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white border border-zinc-200/90 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between bg-white p-2 rounded-2xl border border-zinc-200/80 shadow-2xs">
        <div className="relative flex-1 sm:max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            id="searchInput"
            data-testid="search-input"
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === 'Enter') updateParams({ search: (e.target as HTMLInputElement).value });
            }}
            onBlur={(e) => updateParams({ search: e.target.value })}
            placeholder="Buscar por nombre o descripción..."
            className="w-full rounded-xl border border-transparent bg-zinc-50/60 pl-9 pr-3.5 py-2 text-xs sm:text-sm transition focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-auto">
            <select
              id="categoryFilter"
              data-testid="category-filter"
              value={categoryId}
              onChange={(e) => updateParams({ categoryId: e.target.value })}
              className="w-full sm:w-auto rounded-xl border border-zinc-200/90 bg-zinc-50/60 px-3 py-2 text-xs sm:text-sm font-medium transition focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
            >
              <option value="">Todas las categorías</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && <Alert message={error} />}

      {loading ? (
        <div className="py-20 flex justify-center">
          <Spinner label="Cargando productos..." />
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 text-lg font-bold">
            <Search className="h-5 w-5" />
          </div>
          <p className="text-zinc-700 font-semibold text-sm">No se encontraron productos</p>
          <p className="text-zinc-400 text-xs">Prueba ajustando los filtros o el término de búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={(p) => updateParams({ page: String(p) })} />
    </div>
  );
}
