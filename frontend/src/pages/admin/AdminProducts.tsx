import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { getErrorMessage } from '../../services/api';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import Modal from '../../components/Modal';
import AdminProductForm from './AdminProductForm';
import type { Category, Product } from '../../types';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadProducts = () => {
    setLoading(true);
    productService
      .list({ limit: 100 })
      .then((res) => setProducts(res.data.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
    categoryService.list().then((res) => setCategories(res.data.data));
  }, []);

  const openCreateForm = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSaved = () => {
    setShowForm(false);
    setSuccess(editingProduct ? 'Producto actualizado' : 'Producto creado');
    loadProducts();
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`¿Eliminar el producto "${product.name}"?`)) return;
    setError('');
    try {
      await productService.remove(product.id);
      setSuccess('Producto eliminado');
      loadProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) return <Spinner label="Cargando productos..." />;

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Gestión de productos
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Administra el catálogo, precios, stock y categorías de la tienda.
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 transition cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Nuevo producto
        </button>
      </div>

      {error && <Alert message={error} />}
      {success && <Alert type="success" message={success} />}

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50/80 border-b border-zinc-200/80 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.map((p) => (
                <tr
                  key={p.id}
                  data-testid="admin-product-row"
                  className="transition hover:bg-zinc-50/60"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 border border-zinc-200/60">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-400 font-bold">
                            H
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-zinc-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-zinc-600">
                    <span className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-700">
                      {p.category?.name || 'Sin categoría'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono font-bold text-zinc-950 text-sm">
                    ${Number(p.price).toFixed(2)}
                  </td>
                  <td className="px-4 py-3.5 text-zinc-600 font-medium">
                    <span className={p.stock <= 5 ? 'text-amber-600 font-bold' : ''}>
                      {p.stock} {p.stock <= 5 && '(Bajo)'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                        p.isActive
                          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700'
                          : 'border-zinc-200 bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          p.isActive ? 'bg-emerald-500' : 'bg-zinc-400'
                        }`}
                      />
                      {p.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditForm(p)}
                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-200/80 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition"
                      >
                        <Edit2 className="h-3 w-3 text-zinc-500" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200/60 bg-red-50/50 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 transition"
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-zinc-500">
                    No hay productos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <Modal title={editingProduct ? 'Editar producto' : 'Nuevo producto'} onClose={() => setShowForm(false)}>
          <AdminProductForm
            product={editingProduct}
            categories={categories}
            onClose={() => setShowForm(false)}
            onSaved={handleSaved}
          />
        </Modal>
      )}
    </div>
  );
}
