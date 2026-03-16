'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/lib/admin-api';

interface ContentData {
  content_ko: string;
  content_en: string;
}

export default function AdminContentPage() {
  const [contentKo, setContentKo] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    adminFetch<ContentData>('/api/content/info')
      .then((data) => {
        setContentKo(data.content_ko ?? '');
        setContentEn(data.content_en ?? '');
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);

    try {
      await adminFetch('/api/content/info', {
        method: 'PUT',
        body: JSON.stringify({ content_ko: contentKo, content_en: contentEn }),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-gray-500 text-sm">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Content — Info Page</h1>

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Korean
            </label>
            <textarea
              value={contentKo}
              onChange={(e) => setContentKo(e.target.value)}
              rows={16}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500 resize-y font-mono"
              placeholder="Korean content..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              English
            </label>
            <textarea
              value={contentEn}
              onChange={(e) => setContentEn(e.target.value)}
              rows={16}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500 resize-y font-mono"
              placeholder="English content..."
            />
          </div>
        </div>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        {success && (
          <p className="text-green-600 text-sm">Saved successfully.</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-gray-900 text-white text-sm font-medium px-6 py-2 rounded hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Save Content'}
        </button>
      </form>
    </div>
  );
}
