import { useAuthStore } from '@/stores/authStore';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://backend-ivory-five-74.vercel.app';

async function request(method: string, url: string, body?: unknown) {
  const token = useAuthStore.getState().token;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Remove "/admin" prefix if present
  let apiPath = url;

  if (apiPath.startsWith('/admin/')) {
    apiPath = apiPath.replace('/admin', '');
  }

  // Ensure "/api" prefix
  if (!apiPath.startsWith('/api')) {
    apiPath = `/api${apiPath}`;
  }

  const fullUrl = `${API_URL}${apiPath}`;

  try {
    const response = await fetch(fullUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    let data: any = null;

    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = {
        success: false,
        message: text || 'Server returned no response',
      };
    }

    if (!response.ok) {
      const error: any = new Error(
        data?.message ||
        data?.error ||
        `Request failed (${response.status})`
      );

      error.response = {
        status: response.status,
        data,
      };

      throw error;
    }

    return {
      data,
      status: response.status,
    };
  } catch (err: any) {
    console.error('API Request Failed:', {
      url: fullUrl,
      method,
      error: err,
    });

    throw err;
  }
}

const api = {
  get: (url: string) => request('GET', url),
  post: (url: string, body?: unknown) => request('POST', url, body),
  put: (url: string, body?: unknown) => request('PUT', url, body),
  patch: (url: string, body?: unknown) => request('PATCH', url, body),
  delete: (url: string) => request('DELETE', url),
};

export default api;