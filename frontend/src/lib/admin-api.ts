import { API_BASE_URL as API_BASE } from './api';

function getAuthHeader(): string {
  if (typeof window === 'undefined') return '';
  const creds = sessionStorage.getItem('admin_credentials');
  return creds ? `Basic ${creds}` : '';
}

export async function adminFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthHeader(),
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    sessionStorage.removeItem('admin_credentials');
    window.location.reload();
    throw new Error('Unauthorized');
  }

  if (!res.ok) throw new Error(`API error: ${res.status}`);

  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}
