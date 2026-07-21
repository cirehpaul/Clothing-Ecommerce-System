import { useAuthStore } from '@/stores/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'https://backend-ivory-five-74.vercel.app';

/**
 * Axios-compatible API client that wraps fetch.
 * All components use api.get(), api.post(), api.put(), api.delete()
 * and expect { data: ... } in the response.
 */
async function request(method: string, url: string, body?: any) {
  const token = useAuthStore.getState().token;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Prefix with /api if not already
  let apiPath = url;
  if (!apiPath.startsWith('/api/')) {
    apiPath = '/api' + apiPath;
  }

  const fullUrl = `${API_URL}${apiPath}`;

  const res = await fetch(fullUrl, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data: any;
  const text = await res.text();
  try {
    data = JSON.parse(text);
  } catch {
    data = { success: false, error: text };
  }

  if (!res.ok) {
    const err: any = new Error(data?.error || `Request failed with status ${res.status}`);
    err.response = { data, status: res.status };
    throw err;
  }

  return { data };
}

const api = {
  get: (url: string) => request('GET', url),
  post: (url: string, body?: any) => request('POST', url, body),
  put: (url: string, body?: any) => request('PUT', url, body),
  delete: (url: string) => request('DELETE', url),
  patch: (url: string, body?: any) => request('PATCH', url, body),
};

export default api;
