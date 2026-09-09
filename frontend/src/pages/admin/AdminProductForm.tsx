import { useState, type FormEvent } from 'react';
import { productService, type ProductPayload } from '../../services/productService';
import { getErrorMessage } from '../../services/api';
import Alert from '../../components/Alert';
import type { Category, Product } from '../../types';

interface Props {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}

export default function AdminProductForm({ product, categories, onClose, onSaved }: Props) {
  const [form, setForm] = useState<ProductPayload>({
    name: product?.name || '',
    description: product?.description || '',
    price: product ? Number(product.price) : 0,
    stock: product?.stock ?? 0,
    imageUrl: product?.imageUrl || '',
    categoryId: product?.categoryId || categories[0]?.id || 0,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof ProductPayload, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (product) {
        await productService.update(product.id, form);
      } else {
        await productService.create(form);
      }
      onSaved();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <Alert message={error} />}

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-zinc-700">Nombre</label>
        <input
          required
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Nombre del producto"
          className="w-full rounded-xl border border-zinc-200/90 bg-zinc-50/50 px-3 py-2 text-sm transition focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-zinc-700">Descripción</label>
        <textarea
          required
          rows={3}
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Detalles y características del producto..."
          className="w-full rounded-xl border border-zinc-200/90 bg-zinc-50/50 px-3 py-2 text-sm transition focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-zinc-700">Precio</label>
          <input
            required
            type="number"
            step="0.01"
            min="0.01"
            value={form.price}
            onChange={(e) => handleChange('price', Number(e.target.value))}
            className="w-full rounded-xl border border-zinc-200/90 bg-zinc-50/50 px-3 py-2 text-sm transition focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-zinc-700">Stock</label>
          <input
            required
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => handleChange('stock', Number(e.target.value))}
            className="w-full rounded-xl border border-zinc-200/90 bg-zinc-50/50 px-3 py-2 text-sm transition focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-zinc-700">Categoría</label>
        <select
          required
          value={form.categoryId}
          onChange={(e) => handleChange('categoryId', Number(e.target.value))}
          className="w-full rounded-xl border border-zinc-200/90 bg-zinc-50/50 px-3 py-2 text-sm transition focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-zinc-700">URL de imagen (opcional)</label>
        <input
          value={form.imageUrl}
          onChange={(e) => handleChange('imageUrl', e.target.value)}
          placeholder="https://images.unsplash.com/..."
          className="w-full rounded-xl border border-zinc-200/90 bg-zinc-50/50 px-3 py-2 text-sm transition focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
        />
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 transition disabled:opacity-60 cursor-pointer"
        >
          {submitting ? 'Guardando...' : product ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </div>
    </form>
  );
}
