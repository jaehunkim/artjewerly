'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminFetch } from '@/lib/admin-api';

interface OrderItem {
  product_id: string;
  title_en: string;
  quantity: number;
  price: number;
  currency: string;
}

interface Order {
  id: string;
  email: string;
  total: number;
  currency: string;
  status: string;
  created_at: string;
  items?: OrderItem[];
}

const STATUS_OPTIONS = ['pending', 'paid', 'shipped', 'cancelled'];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function truncateId(id: string): string {
  return id.length > 12 ? `${id.slice(0, 12)}…` : id;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminFetch<Order[]>('/api/orders');
      setOrders(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  async function handleStatusChange(orderId: string, newStatus: string) {
    setUpdatingStatus(orderId);
    try {
      await adminFetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Status update failed');
    } finally {
      setUpdatingStatus(null);
    }
  }

  function toggleExpand(orderId: string) {
    setExpanded((prev) => (prev === orderId ? null : orderId));
  }

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    shipped: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-500',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
        <button
          onClick={loadOrders}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <p className="text-gray-500 text-sm py-8 text-center">Loading...</p>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3 mb-4">
          {error}
          <button onClick={loadOrders} className="ml-3 underline hover:no-underline">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-36">
                  Order ID
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Email
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-28">
                  Total
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-24">
                  Currency
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-36">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-28">
                  Date
                </th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 py-12">
                    No orders yet
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <>
                    <tr
                      key={order.id}
                      onClick={() => toggleExpand(order.id)}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">
                        {truncateId(order.id)}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{order.email}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {order.currency === 'KRW'
                          ? `₩${order.total.toLocaleString()}`
                          : `$${order.total.toFixed(2)}`}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs uppercase">
                        {order.currency}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          disabled={updatingStatus === order.id}
                          className={`text-xs font-medium px-2 py-1 rounded border-0 focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:opacity-50 ${
                            statusColor[order.status] ?? 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {expanded === order.id ? '▲' : '▼'}
                      </td>
                    </tr>

                    {expanded === order.id && (
                      <tr key={`${order.id}-detail`} className="bg-gray-50">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="text-xs text-gray-600 space-y-1">
                            <p className="font-medium text-gray-700 mb-2">
                              Order details — {order.id}
                            </p>
                            {order.items && order.items.length > 0 ? (
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="text-gray-500">
                                    <th className="text-left pb-1 font-medium">Product</th>
                                    <th className="text-left pb-1 font-medium w-16">Qty</th>
                                    <th className="text-left pb-1 font-medium w-24">Price</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.items.map((item, i) => (
                                    <tr key={i}>
                                      <td className="py-0.5">{item.title_en}</td>
                                      <td className="py-0.5">{item.quantity}</td>
                                      <td className="py-0.5">
                                        {item.currency === 'KRW'
                                          ? `₩${item.price.toLocaleString()}`
                                          : `$${item.price.toFixed(2)}`}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <p className="text-gray-400">No item details available.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
