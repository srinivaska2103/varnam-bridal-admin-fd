'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAdminAuthStore } from '@/store/adminAuthStore';

const MobileMenuContext = createContext({
  mobileMenuOpen: false,
  setMobileMenuOpen: () => {},
  openMobileMenu: () => {},
  closeMobileMenu: () => {},
});

export function useMobileMenu() {
  return useContext(MobileMenuContext);
}

export function AdminAuthProvider({ children }) {
  const { initialize } = useAdminAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  useEffect(() => {
    initialize();
  }, [initialize]);

  const openMobileMenu = () => setMobileMenuOpen(true);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <QueryClientProvider client={queryClient}>
      <MobileMenuContext.Provider
        value={{ mobileMenuOpen, setMobileMenuOpen, openMobileMenu, closeMobileMenu }}
      >
        {children}
      </MobileMenuContext.Provider>
    </QueryClientProvider>
  );
}

