'use client';

import { useState, useEffect, use } from 'react';
import { adminFetch } from '@/lib/admin-api';
import { ProductForm } from '@/components/admin/ProductForm';

interface Product {
  id: string;
  category: string;
  title_ko: string;
  title_en: string;
  description_ko: string;
  description_en: string;
  price_krw: number;
  price_usd?: number;
  is_available: boolean;
  images: { id: string; url: string; sort_order: number }[];
}

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminFetch<Product>(`/api/products/${id}`)
      .then(setProduct)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-gray-500 text-sm">Loading...</p>;
  }

  if (error) {
    return (
      <p className="text-red-600 text-sm">Error: {error}</p>
    );
  }

  if (!product) {
    return <p className="text-gray-500 text-sm">Product not found.</p>;
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">
        Edit Product
      </h1>
      <ProductForm
        mode="edit"
        initialData={{
          id: product.id,
          category: product.category,
          title_ko: product.title_ko,
          title_en: product.title_en,
          description_ko: product.description_ko,
          description_en: product.description_en,
          price_krw: product.price_krw,
          price_usd: product.price_usd ?? 0,
          is_available: product.is_available,
          images: product.images ?? [],
        }}
      />
    </div>
  );
}
