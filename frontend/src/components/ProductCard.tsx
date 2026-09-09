import { Link } from 'react-router-dom';
import type { Product } from '../types';

export default function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stock === 0;
  const lowStock = !outOfStock && product.stock <= 5;

  return (
    <Link
      to={`/products/${product.id}`}
      data-testid="product-card"
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-400/80 hover:shadow-sm"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-50/80 border-b border-zinc-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-zinc-400">
            Sin imagen
          </div>
        )}

        {product.category && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="inline-flex items-center rounded-md border border-zinc-200/80 bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-700 backdrop-blur-xs shadow-2xs">
              {product.category.name}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="line-clamp-2 text-sm font-semibold text-zinc-900 group-hover:text-zinc-700 transition-colors leading-snug">
            {product.name}
          </h3>
        </div>

        <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-zinc-100">
          <span className="font-mono text-base font-bold text-zinc-950">
            ${Number(product.price).toFixed(2)}
          </span>

          <span className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                outOfStock ? 'bg-red-500' : lowStock ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              aria-hidden="true"
            />
            {outOfStock ? 'Sin stock' : lowStock ? `Quedan ${product.stock}` : `${product.stock} disp.`}
          </span>
        </div>
      </div>
    </Link>
  );
}
