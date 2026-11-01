'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  IndianRupee,
  LayoutGrid,
  TrendingUp,
  Layers,
  Inbox,
  FileSpreadsheet,
  LifeBuoy,
  History,
  MessageSquare,
  X,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { useAdminAuthStore } from '@/store/adminAuthStore';

// Primary 4 tabs displayed on the mobile bottom floating pill bar
const primaryAdminTabs = [
  { label: 'Overview', href: '/', icon: LayoutDashboard },
  { label: 'Accounts', href: '/accounts', icon: Building2 },
  { label: 'Subscriptions', href: '/subscriptions', icon: CreditCard },
  { label: 'Payments', href: '/payments', icon: IndianRupee },
];

// All menu groups accessible inside the "More" bottom sheet
const moreNavigationGroups = [
  {
    title: 'Platform Administration',
    items: [
      { label: 'Overview', href: '/', icon: LayoutDashboard, desc: 'Real-time telemetry & platform KPIs' },
      { label: 'Accounts', href: '/accounts', icon: Building2, desc: 'Studio accounts, owners & statuses' },
      { label: 'Subscriptions', href: '/subscriptions', icon: CreditCard, desc: 'Razorpay plans & active tiers' },
      { label: 'Payments', href: '/payments', icon: IndianRupee, desc: 'Successful collections & audit logs' },
    ],
  },
  {
    title: 'Growth & Communications',
    items: [
      { label: 'WhatsApp Billing', href: '/whatsapp-billing', icon: MessageSquare, desc: 'Pay-as-you-use balance & rates' },
      { label: 'Revenue Analytics', href: '/revenue', icon: TrendingUp, desc: 'MRR, collections & growth trend' },
      { label: 'Plans & Pricing', href: '/plans', icon: Layers, desc: 'Configured tier limits & features' },
      { label: 'Sales Enquiries', href: '/enquiries', icon: Inbox, desc: 'Lead generation & follow-ups' },
    ],
  },
  {
    title: 'Platform Governance & Audits',
    items: [
      { label: 'Reports & Export', href: '/reports', icon: FileSpreadsheet, desc: 'Live data export to CSV' },
      { label: 'Support Tickets', href: '/support', icon: LifeBuoy, desc: 'Studio support & ticketing queue' },
      { label: 'Activity Logs', href: '/activity', icon: History, desc: 'Admin actions & security audit' },
    ],
  },
];

export function AdminMobileBottomNavigation() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { user, logout } = useAdminAuthStore();
  const studioUrl = process.env.NEXT_PUBLIC_STUDIO_APP_URL || 'http://localhost:3000';

  // Check if current route is one of the 4 primary tabs
  const isPrimaryActive = primaryAdminTabs.some(
    (tab) => pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))
  );

  const isMoreActive = !isPrimaryActive;

  return (
    <>
      {/* Floating Pill Mobile Navigation Bar */}
      <div className="fixed bottom-[calc(10px+env(safe-area-inset-bottom))] left-0 right-0 z-40 flex justify-center px-3 pointer-events-none md:hidden">
        <nav
          className="pointer-events-auto w-[calc(100%-8px)] max-w-[420px] h-[60px] sm:h-[64px] bg-white/95 rounded-[999px] border border-orange-200 shadow-[0_8px_30px_rgba(234,88,12,0.16)] flex items-center justify-around px-1 py-0.5 select-none backdrop-blur-md"
          aria-label="Super Admin Mobile Navigation"
        >
          {primaryAdminTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center justify-center flex-1 h-full py-0.5 px-0.5 transition-all duration-200 ease-in-out group focus:outline-hidden"
                aria-current={isActive ? 'page' : undefined}
              >
                <div
                  className={`relative w-9 sm:w-10 h-8 sm:h-8.5 flex items-center justify-center rounded-xl transition-all duration-200 ease-in-out ${
                    isActive
                      ? 'bg-gradient-to-b from-orange-50 to-orange-100/70 text-orange-600 shadow-[0_2px_8px_rgba(234,88,12,0.18)] ring-1 ring-orange-300'
                      : 'text-stone-400 group-hover:text-stone-700'
                  }`}
                >
                  <Icon
                    className={`w-[18px] sm:w-[19px] h-[18px] sm:h-[19px] transition-transform duration-200 ${
                      isActive ? 'scale-105 stroke-[2.2]' : 'stroke-[1.75]'
                    }`}
                  />
                  {isActive && (
                    <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-orange-600 shadow-xs" />
                  )}
                </div>
                <span
                  className={`text-[9px] sm:text-[10px] tracking-tight mt-0.5 leading-tight truncate max-w-[56px] transition-colors duration-200 ${
                    isActive ? 'font-bold text-orange-600' : 'font-medium text-stone-500'
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}

          {/* More Sheet Trigger */}
          <button
            type="button"
            onClick={() => setIsMoreOpen(true)}
            className="flex flex-col items-center justify-center flex-1 h-full py-0.5 px-0.5 transition-all duration-200 ease-in-out group focus:outline-hidden cursor-pointer"
            aria-label="Open full platform admin menu"
            aria-expanded={isMoreOpen}
          >
            <div
              className={`relative w-9 sm:w-10 h-8 sm:h-8.5 flex items-center justify-center rounded-xl transition-all duration-200 ease-in-out ${
                isMoreActive
                  ? 'bg-gradient-to-b from-orange-50 to-orange-100/70 text-orange-600 shadow-[0_2px_8px_rgba(234,88,12,0.18)] ring-1 ring-orange-300'
                  : 'text-stone-400 group-hover:text-stone-700'
              }`}
            >
              <LayoutGrid
                className={`w-[18px] sm:w-[19px] h-[18px] sm:h-[19px] transition-transform duration-200 ${
                  isMoreActive ? 'scale-105 stroke-[2.2]' : 'stroke-[1.75]'
                }`}
              />
              {isMoreActive && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-orange-600 shadow-xs" />
              )}
            </div>
            <span
              className={`text-[9px] sm:text-[10px] tracking-tight mt-0.5 leading-tight truncate max-w-[56px] transition-colors duration-200 ${
                isMoreActive ? 'font-bold text-orange-600' : 'font-medium text-stone-500'
              }`}
            >
              More
            </span>
          </button>
        </nav>
      </div>

      {/* More Bottom Sheet Drawer */}
      {isMoreOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
          onClick={() => setIsMoreOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-t-[32px] border-t border-stone-200 shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-stone-300 rounded-full" />
            </div>

            {/* Sheet Header */}
            <div className="px-5 py-3 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-stone-900 leading-none">Super Admin Menu</h3>
                  <p className="text-[11px] text-stone-500 mt-0.5 font-mono">Platform Management</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Menu Items Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar pb-8">
              {moreNavigationGroups.map((group) => (
                <div key={group.title} className="space-y-1.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-2">
                    {group.title}
                  </h4>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMoreOpen(false)}
                          className={`flex items-center justify-between p-2.5 rounded-2xl transition-all ${
                            isActive
                              ? 'bg-orange-50 border border-orange-200/80 text-orange-700 shadow-xs'
                              : 'hover:bg-stone-50 border border-transparent text-stone-800'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                isActive
                                  ? 'bg-orange-600 text-white shadow-xs'
                                  : 'bg-stone-100 text-stone-600'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <p className="text-xs font-bold leading-tight truncate">{item.label}</p>
                              <p className="text-[11px] text-stone-400 leading-tight truncate mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                          <ChevronRight
                            className={`w-4 h-4 shrink-0 ${isActive ? 'text-orange-500' : 'text-stone-300'}`}
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Logout Action */}
              <div className="pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsMoreOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-rose-50 hover:bg-rose-100/80 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Super Admin</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

