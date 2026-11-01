'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  IndianRupee,
  TrendingUp,
  Layers,
  Inbox,
  FileSpreadsheet,
  History,
  ShieldCheck,
  ChevronRight,
  LogOut,
  ExternalLink,
  Sparkles,
  Settings,
  MessageSquare,
  LifeBuoy,
} from 'lucide-react';
import { useAdminAuthStore } from '@/store/adminAuthStore';

const navigationItems = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'Accounts', href: '/accounts', icon: Building2 },
  { name: 'Subscriptions', href: '/subscriptions', icon: CreditCard },
  { name: 'Payments', href: '/payments', icon: IndianRupee },
  { name: 'WhatsApp Billing', href: '/whatsapp-billing', icon: MessageSquare },
  { name: 'Revenue', href: '/revenue', icon: TrendingUp },
  { name: 'Plans', href: '/plans', icon: Layers },
  { name: 'Enquiries', href: '/enquiries', icon: Inbox },
  { name: 'Reports', href: '/reports', icon: FileSpreadsheet },
  { name: 'Support Tickets', href: '/support', icon: LifeBuoy },
  { name: 'Activity Logs', href: '/activity', icon: History },
];

export function AdminSidebar({ className = '', onCloseMobile }) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuthStore();

  const handleLinkClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  const studioUrl = process.env.NEXT_PUBLIC_STUDIO_APP_URL || 'http://localhost:3000';

  return (
    <aside
      className={`w-64 bg-white border-r border-stone-200/90 flex flex-col h-full text-stone-800 select-none shadow-[1px_0_12px_rgba(0,0,0,0.02)] ${className}`}
    >
      {/* Brand & Super Admin Badge */}
      <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-gradient-to-b from-orange-50/40 via-white to-white">
        <Link href="/" onClick={handleLinkClick} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-white border border-orange-200/80 p-1 flex items-center justify-center shadow-sm shadow-orange-500/10 group-hover:scale-105 group-hover:border-orange-300 transition-all duration-200 shrink-0">
            <Image
              src="/varnam-logo.png"
              alt="Varnam Logo"
              width={38}
              height={38}
              className="object-contain"
              priority
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-stone-900 text-base tracking-tight group-hover:text-orange-600 transition-colors truncate">
                Varnam
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold tracking-wider text-orange-600 uppercase mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Admin Panel</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 overflow-y-auto custom-scrollbar space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">
          Platform Administration
        </div>

        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/30'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-orange-50/60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-stone-100 text-stone-500 group-hover:bg-white group-hover:text-orange-600 group-hover:shadow-xs'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">{item.name}</span>
              </div>
              {isActive ? (
                <ChevronRight className="w-3.5 h-3.5 text-white/90 shrink-0" />
              ) : (
                <ChevronRight className="w-3 h-3 text-stone-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Admin Profile Footer */}
      <div className="p-3.5 border-t border-stone-200/80 bg-stone-50/70">
        <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              V
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-stone-900 truncate leading-none">
                {user?.name && !user.name.includes('VEXA') ? user.name : 'Varnam Admin'}
              </p>
              <p className="text-[10px] text-stone-500 font-medium truncate mt-0.5">
                {user?.email || 'vexatech.connect@gmail.com'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              window.location.href = '/login';
            }}
            title="Log out of Super Admin"
            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

