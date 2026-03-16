'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminFetch } from '@/lib/admin-api';
import { ImageUploader } from './ImageUploader';

interface ImageItem {
  id: string;
  url: string;
  sort_order: number;
}

interface ProductFormData {
  category: string;
  title_ko: string;
  title_en: string;
  description_ko: string;
  description_en: string;
  price_krw: number;
  price_usd: number;
  is_available: boolean;
  images: ImageItem[];
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData> & { id?: string };
  mode: 'new' | 'edit';
}

const DEFAULT_DATA: ProductFormData = {
  category: 'art',
  title_ko: '',
  title_en: '',
  description_ko: '',
  description_en: '',
  price_krw: 0,
  price_usd: 0,
  is_available: true,
  images: [],
};

export function ProductForm({ initialData, mode }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>({
    ...DEFAULT_DATA,
    ...initialData,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = {
        ...form,
        price_usd: form.category === 'sale' ? form.price_usd : undefined,
        image_ids: form.images.map((img) => img.id),
      };

      if (mode === 'new') {
        await adminFetch('/api/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch(`/api/products/${initialData?.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          value={form.category}
          onChange={(e) => set('category', e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500 w-48"
          required
        >
          <option value="art">Art</option>
          <option value="sale">Sale</option>
        </select>
      </div>

      {/* Titles */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title (Korean)
          </label>
          <input
            type="text"
            value={form.title_ko}
            onChange={(e) => set('title_ko', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title (English)
          </label>
          <input
            type="text"
            value={form.title_en}
            onChange={(e) => set('title_en', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
            required
          />
        </div>
      </div>

      {/* Descriptions */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (Korean)
          </label>
          <textarea
            value={form.description_ko}
            onChange={(e) => set('description_ko', e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500 resize-y"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (English)
          </label>
          <textarea
            value={form.description_en}
            onChange={(e) => set('description_en', e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500 resize-y"
          />
        </div>
      </div>

      {/* Prices */}
      <div className="flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (KRW ₩)
          </label>
          <input
            type="number"
            min={0}
            value={form.price_krw}
            onChange={(e) => set('price_krw', Number(e.target.value))}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500 w-40"
            required
          />
        </div>
        {form.category === 'sale' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (USD $)
            </label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={form.price_usd}
              onChange={(e) => set('price_usd', Number(e.target.value))}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500 w-40"
            />
          </div>
        )}
      </div>

      {/* Availability */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_available}
            onChange={(e) => set('is_available', e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-gray-900"
          />
          <span className="text-sm font-medium text-gray-700">Available</span>
        </label>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Images
        </label>
        <ImageUploader
          images={form.images}
          onChange={(imgs) => set('images', imgs)}
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-gray-900 text-white text-sm font-medium px-6 py-2 rounded hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Save Product'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
