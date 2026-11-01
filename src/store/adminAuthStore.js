import { create } from 'zustand';
import { adminApi } from '@/services/adminApi';

export const useAdminAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isInitialized: false,

  setAuth: ({ user, token }) => {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('vexa_admin_token', token);
        localStorage.setItem('vexa_auth_token', token);
      }
      if (user) {
        localStorage.setItem('vexa_admin_user', JSON.stringify(user));
        localStorage.setItem('vexa_auth_user', JSON.stringify(user));
      }
    }
    set({
      user,
      token,
      isAuthenticated: !!token && user?.is_super_admin === true,
      isInitialized: true,
    });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vexa_admin_token');
      localStorage.removeItem('vexa_admin_user');
      localStorage.removeItem('vexa_auth_token');
      localStorage.removeItem('vexa_auth_user');
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: true,
    });
  },

  initialize: async () => {
    if (typeof window === 'undefined') return;

    try {
      const token =
        localStorage.getItem('vexa_admin_token') || localStorage.getItem('vexa_auth_token');
      const userStr =
        localStorage.getItem('vexa_admin_user') || localStorage.getItem('vexa_auth_user');

      if (token) {
        const user = userStr ? JSON.parse(userStr) : null;
        set({
          user,
          token,
          isAuthenticated: !!token && user?.is_super_admin === true,
          isInitialized: true,
        });

        // Background profile verification with backend
        try {
          const res = await adminApi.getMe();
          if (res?.data) {
            const freshUser = res.data;
            localStorage.setItem('vexa_admin_user', JSON.stringify(freshUser));
            set({
              user: freshUser,
              isAuthenticated: Boolean(freshUser.is_super_admin),
            });
          }
        } catch {
          // Token expired or invalid
        }
        return;
      }
    } catch (e) {
      console.error('Error initializing admin auth store:', e);
    }

    set({ isInitialized: true, isAuthenticated: false });
  },
}));
