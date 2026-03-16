const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface ApiResponse<T> {
  data: T;
  error: string | null;
}

export async function fetchApi<T>(
  path: string,
  options?: RequestInit & { revalidate?: number }
): Promise<T> {
  const { revalidate, ...fetchOptions } = options || {};

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    next: revalidate !== undefined ? { revalidate } : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const json: ApiResponse<T> = await res.json();
  if (json.error) {
    throw new Error(json.error);
  }

  return json.data;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  detail_address: string;
  zipcode: string;
}

export interface CreateOrderPayload {
  email: string;
  shipping_address: ShippingAddress;
  items: { product_id: string; quantity: number }[];
  currency: string;
  lang: string;
}

export interface Order {
  id: string;
  email: string;
  shipping_address: ShippingAddress;
  total: number;
  currency: string;
  payment_provider: string | null;
  payment_id: string | null;
  status: string;
  lang: string;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  return fetchApi<Order>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getOrder(id: string): Promise<Order> {
  return fetchApi<Order>(`/api/orders/${id}`);
}

export async function createStripeIntent(orderId: string): Promise<{ client_secret: string }> {
  return fetchApi<{ client_secret: string }>(`/api/orders/${orderId}/pay/stripe`, {
    method: 'POST',
  });
}

export async function createTossPayment(
  orderId: string,
  successUrl: string,
  failUrl: string
): Promise<{ orderId: string; orderName: string; amount: string; successUrl: string; failUrl: string }> {
  return fetchApi(`/api/orders/${orderId}/pay/toss`, {
    method: 'POST',
    body: JSON.stringify({ success_url: successUrl, fail_url: failUrl }),
  });
}
