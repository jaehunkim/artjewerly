'use client';

import { ProductForm } from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">New Product</h1>
      <ProductForm mode="new" />
    </div>
  );
}
