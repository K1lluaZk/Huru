import { useEffect, useState } from 'react';
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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-ink">Gestión de productos</h1>
        <button
          onClick={openCreateForm}
          className="rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800"
        >
          + Nuevo producto
        </button>
      </div>

      {error && <Alert message={error} />}
      {success && <Alert type="success" message={success} />}

      <div className="overflow-x-auto rounded-xl border border-primary-900/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} data-testid="admin-product-row">
                <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                <td className="px-4 py-3 text-gray-600">{p.category?.name}</td>
                <td className="px-4 py-3 text-gray-600">${Number(p.price).toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-600">{p.stock}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {p.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEditForm(p)} className="mr-3 font-medium text-primary-700 hover:underline">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(p)} className="font-medium text-red-500 hover:underline">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No hay productos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
