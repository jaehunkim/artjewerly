'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { adminFetch } from '@/lib/admin-api';
import {
  ADMIN_PRODUCT_CATEGORIES,
  type AdminProductCategoryFilter,
  type AdminProductSummary,
} from '@/lib/admin-types';
import { formatPrice } from '@/lib/utils';

const CATEGORY_FILTER_OPTIONS = ['all', ...ADMIN_PRODUCT_CATEGORIES] as const;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] =
    useState<AdminProductCategoryFilter>('all');
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminFetch<AdminProductSummary[]>('/api/products');
      setProducts(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await adminFetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(null);
    }
  }

  const filtered =
    categoryFilter === 'all'
      ? products
      : products.filter((p) => p.category === categoryFilter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          New Product
        </Link>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-4">
        {CATEGORY_FILTER_OPTIONS.map((category) => (
          <button
            key={category}
            onClick={() => setCategoryFilter(category)}
            className={`px-3 py-1 text-sm rounded border transition-colors ${
              categoryFilter === category
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {loading && (
        <p className="text-gray-500 text-sm py-8 text-center">Loading...</p>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3 mb-4">
          {error}
          <button
            onClick={loadProducts}
            className="ml-3 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-16">
                  Image
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Title
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-24">
                  Category
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-28">
                  Price
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-24">
                  Available
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center text-gray-400 py-12"
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      {product.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0].url}
                          alt={product.title_en}
                          className="w-10 h-10 object-cover rounded border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-300 text-xs">
                          —
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {product.title_en}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {product.title_ko}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatPrice(product.price_krw, 'KRW')}
                      {product.price_usd != null && (
                        <div className="text-gray-400 text-xs">
                          {formatPrice(product.price_usd, 'USD')}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          product.is_available
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      />
                      <span className="ml-2 text-gray-600">
                        {product.is_available ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(product.id, product.title_en)
                          }
                          disabled={deleting === product.id}
                          className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-40"
                        >
                          {deleting === product.id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
