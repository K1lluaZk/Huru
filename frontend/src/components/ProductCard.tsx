import { Link } from 'react-router-dom';
import type { Product } from '../types';

// Rotate a small, deliberate set of tag colors across categories so the
// catalog reads as organized inventory rather than a flat list.
const CATEGORY_TAG_STYLES = [
  'bg-primary-50 text-primary-700',
  'bg-accent-50 text-accent-700',
  'bg-emerald-50 text-emerald-700',
  'bg-sky-50 text-sky-700',
];

function tagStyleFor(categoryId: number) {
  return CATEGORY_TAG_STYLES[categoryId % CATEGORY_TAG_STYLES.length];
}

export default function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stock === 0;
  const lowStock = !outOfStock && product.stock <= 5;

  return (
    <Link
      to={`/products/${product.id}`}
      data-testid="product-card"
      className="group flex flex-col overflow-hidden rounded-2xl border border-primary-900/10 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-900/10"
    >
      <div className="aspect-square w-full overflow-hidden bg-primary-50">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-primary-300">Sin imagen</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {product.category && (
          <span
            className={`w-fit rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${tagStyleFor(
              product.category.id
            )}`}
          >
            {product.category.name}
          </span>
        )}
        <h3 className="line-clamp-2 font-medium text-ink">{product.name}</h3>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="price-tag text-lg font-bold text-primary-900">
            ${Number(product.price).toFixed(2)}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                outOfStock ? 'bg-red-500' : lowStock ? 'bg-accent-500' : 'bg-emerald-500'
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
