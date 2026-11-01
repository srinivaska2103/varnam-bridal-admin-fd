'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Building2, ExternalLink } from 'lucide-react';
import { useAdminAuthStore } from '@/store/adminAuthStore';
import { AdminPwaInstallPrompt } from './AdminPwaInstallPrompt';

export function AdminHeader({ title = 'Platform Overview', subtitle }) {
  const { user } = useAdminAuthStore();
  const studioUrl = process.env.NEXT_PUBLIC_STUDIO_APP_URL || 'http://localhost:3000';

  return (
    <header className="h-14 sm:h-16 bg-white/95 backdrop-blur-md border-b border-[#F0E7DE] px-3 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
      {/* Left: Brand Identity & Current Screen Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white border border-orange-200 p-0.5 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <Image
              src="/varnam-logo.png"
              alt="Varnam Logo"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
        </Link>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 className="text-xs sm:text-base font-extrabold text-stone-900 tracking-tight truncate leading-tight">
              {title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full shadow-2xs shrink-0">
              <ShieldCheck className="w-3 h-3 text-orange-600" />
              Super Admin
            </span>
          </div>
          <p className="text-[10px] sm:text-xs text-stone-500 truncate leading-tight mt-0.5">
            <span className="md:hidden font-medium text-orange-700">Varnam Super Admin</span>
            {subtitle && <span className="hidden md:inline">{subtitle}</span>}
          </p>
        </div>
      </div>

      {/* Right: App Install & Admin Profile Avatar */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* PWA Install Button for Admin */}
        <div className="hidden xs:block sm:block">
          <AdminPwaInstallPrompt />
        </div>

        {/* Admin profile chip */}
        <div className="flex items-center gap-2 pl-1.5 sm:pl-3 sm:border-l sm:border-stone-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 via-amber-500 to-amber-400 text-white font-extrabold text-xs flex items-center justify-center shadow-xs ring-2 ring-white shrink-0">
            {user?.name ? user.name[0].toUpperCase() : 'V'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-stone-900 leading-none">
              {user?.name && !user.name.includes('VEXA') ? user.name : 'Varnam Admin'}
            </p>
            <p className="text-[10px] text-stone-500 font-medium leading-tight mt-0.5">Platform Owner</p>
          </div>
        </div>
      </div>
    </header>
  );
}
