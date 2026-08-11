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
        <label className="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
        <input
          required
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full rounded-xl border border-primary-900/10 px-3 py-2.5 text-sm transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          required
          rows={3}
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full rounded-xl border border-primary-900/10 px-3 py-2.5 text-sm transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Precio</label>
          <input
            required
            type="number"
            step="0.01"
            min="0.01"
            value={form.price}
            onChange={(e) => handleChange('price', Number(e.target.value))}
            className="w-full rounded-xl border border-primary-900/10 px-3 py-2.5 text-sm transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Stock</label>
          <input
            required
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => handleChange('stock', Number(e.target.value))}
            className="w-full rounded-xl border border-primary-900/10 px-3 py-2.5 text-sm transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Categoría</label>
        <select
          required
          value={form.categoryId}
          onChange={(e) => handleChange('categoryId', Number(e.target.value))}
          className="w-full rounded-xl border border-primary-900/10 px-3 py-2.5 text-sm transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">URL de imagen (opcional)</label>
        <input
          value={form.imageUrl}
          onChange={(e) => handleChange('imageUrl', e.target.value)}
          placeholder="https://..."
          className="w-full rounded-xl border border-primary-900/10 px-3 py-2.5 text-sm transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <button type="button" onClick={onClose} className="rounded-lg border border-primary-900/10 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:opacity-60"
        >
          {submitting ? 'Guardando...' : product ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </div>
    </form>
  );
}
