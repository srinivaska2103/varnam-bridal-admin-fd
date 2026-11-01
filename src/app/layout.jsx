'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuthStore } from '@/store/adminAuthStore';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminMobileBottomNavigation } from '@/components/admin/AdminMobileBottomNavigation';
import { ShieldAlert, LogIn } from 'lucide-react';
import Link from 'next/link';
import { AdminAuthProvider, useMobileMenu } from './providers';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Varnam Admin Panel — Super Admin Console</title>
        <meta
          name="description"
          content="Super Admin console for Varnam Bridal & Makeup Studio Management SaaS"
        />
        <meta name="theme-color" content="#FF6B00" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VARNAM Admin" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/icons/admin-icon-192.png" />
        <link rel="apple-touch-icon" href="/icons/admin-icon-192.png" />
      </head>
      <body className="antialiased bg-[#FFFDF9] text-[#292524]">
        <AdminAuthProvider>
          <SuperAdminAppShell>{children}</SuperAdminAppShell>
        </AdminAuthProvider>
      </body>
    </html>
  );
}

function SuperAdminAppShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isInitialized } = useAdminAuthStore();
  const { mobileMenuOpen, closeMobileMenu } = useMobileMenu();

  // If on /login page, render without admin shell
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <main className="min-h-screen">{children}</main>;
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center text-stone-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-stone-500 font-mono tracking-wider">Verifying Super Admin clearance...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-stone-200 rounded-3xl p-8 text-center text-stone-800 shadow-xl shadow-stone-200/50">
          <div className="w-12 h-12 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-orange-600">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">Super Admin Clearance Required</h2>
          <p className="text-xs text-stone-500 mb-6 leading-relaxed">
            This console is exclusively for authorized Varnam platform administrators. Please sign in with your authorized Super Admin email.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-orange-900/10 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Admin OTP</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FFFDF9] overflow-hidden text-[#292524] font-sans">
      {/* Desktop Sidebar */}
      <AdminSidebar className="hidden md:flex shrink-0" />

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar Slide-over */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <AdminSidebar onCloseMobile={closeMobileMenu} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pb-[72px] md:pb-0">
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>

      {/* Floating Pill Mobile Bottom Navigation (Matching Studio App) */}
      <AdminMobileBottomNavigation />
    </div>
  );
}
