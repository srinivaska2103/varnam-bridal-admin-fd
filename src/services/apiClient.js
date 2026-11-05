import axios from 'axios';

/**
 * Dynamically resolves the API Base URL at runtime.
 * In production browsers, routes to `${origin}/api` which is reverse-proxied
 * by Nginx directly to backend port 5000 (eliminates CORS, preflight, and DNS errors).
 */
export function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    const { hostname, origin } = window.location;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

    if (!isLocal) {
      return `${origin}/api`;
    }
  }

  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
}

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to attach Authorization token
apiClient.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBaseUrl();

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('vexa_admin_token') || localStorage.getItem('vexa_auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors uniformly
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorData = error.response?.data || {};
    const message = errorData.message || error.message || 'An unexpected error occurred';
    const status = error.response?.status;

    // Handle 401 Unauthorized / Token Expired automatically
    if (status === 401 && typeof window !== 'undefined') {
      try {
        localStorage.removeItem('vexa_admin_token');
        localStorage.removeItem('vexa_admin_user');
        localStorage.removeItem('vexa_auth_token');
        localStorage.removeItem('vexa_auth_user');

        if (window.location.pathname !== '/login') {
          window.location.href = '/login?expired=true';
        }
      } catch (e) {
        console.error('Error handling 401 redirect:', e);
      }
    }

    const customError = new Error(message);
    customError.status = status;
    customError.data = errorData;
    customError.errors = errorData.errors || null;

    return Promise.reject(customError);
  }
);
