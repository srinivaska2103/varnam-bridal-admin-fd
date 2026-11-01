'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/services/adminApi';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  ShieldCheck,
  Mail,
  Globe,
  Database,
  Server,
  KeyRound,
  ExternalLink,
  LifeBuoy,
  MessageSquare,
  BookOpen,
  ArrowRight,
  Headphones,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';

export default function AdminSettingsPage({ onOpenMobileMenu }) {
  const { data: analyticsRes } = useQuery({
    queryKey: ['admin-support-analytics'],
    queryFn: () => adminApi.getSupportAnalytics(),
    refetchInterval: 30000,
  });

  const analytics = analyticsRes?.data || {
    total: 0,
    open: 0,
    inProgress: 0,
    waitingForUser: 0,
    resolved: 0,
    closed: 0,
    criticalHighPending: 0,
  };

  const { data: categoriesRes } = useQuery({
    queryKey: ['admin-support-categories'],
    queryFn: () => adminApi.getSupportCategories(),
  });
  const categories = categoriesRes?.data || [];

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Platform Settings & Infrastructure"
        subtitle="Varnam platform configuration, support data management, and security policies"
        onOpenMobileMenu={onOpenMobileMenu}
      />

      <div className="p-3 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Support & Ticket Management Command Center */}
        <div className="bg-gradient-to-br from-white to-orange-50/30 rounded-2xl border border-orange-200/80 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-orange-100">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-orange-600/20">
                <LifeBuoy className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-stone-900 text-lg">Support & Ticket Data Management</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 uppercase tracking-wide border border-orange-200">
                    Live Support System
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Inspect incoming customer inquiries, dispatch admin replies, and manage knowledge base articles
                </p>
              </div>
            </div>

            <Link
              href="/support"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-600/20 shrink-0"
            >
              <span>Open Support Console</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
            <div className="p-3.5 bg-white rounded-xl border border-stone-200/90 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Total Tickets</span>
              <div className="text-xl font-black text-stone-900">{analytics.total}</div>
              <span className="text-[11px] text-stone-400">All submitted tickets</span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-blue-200/90 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Open Tickets</span>
              <div className="text-xl font-black text-blue-600">{analytics.open}</div>
              <span className="text-[11px] text-blue-500">Awaiting admin review</span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-amber-200/90 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">In Progress</span>
              <div className="text-xl font-black text-amber-600">{analytics.inProgress}</div>
              <span className="text-[11px] text-amber-500">Under active investigation</span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-emerald-200/90 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Resolved</span>
              <div className="text-xl font-black text-emerald-600">{analytics.resolved}</div>
              <span className="text-[11px] text-emerald-500">Successfully closed</span>
            </div>
          </div>

          {/* Knowledge Base Categories Reference */}
          <div className="mt-5 pt-4 border-t border-orange-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-stone-600">
              <BookOpen className="w-4 h-4 text-orange-600" />
              <span className="font-semibold">{categories.length} Knowledge Base Categories Active:</span>
              <span className="text-stone-500">
                Getting Started, Enquiries, WhatsApp, Bookings, Payments, etc.
              </span>
            </div>
            <Link
              href="/support"
              className="font-bold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1"
            >
              Manage Articles & Guides &rarr;
            </Link>
          </div>
        </div>

        {/* Environment / Platform Info Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center font-bold text-base">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Platform Infrastructure</h3>
              <p className="text-xs text-stone-500">Core architecture runtime and multi-tenant services</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <span className="text-stone-500 font-semibold uppercase text-[10px] block">Database Engine</span>
              <p className="font-bold text-stone-900 text-sm">PostgreSQL (Relational + Multi-tenant)</p>
              <p className="text-stone-500 text-[11px]">ORM: Prisma Client v6.19.3</p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <span className="text-stone-500 font-semibold uppercase text-[10px] block">Payment Gateway</span>
              <p className="font-bold text-stone-900 text-sm">Razorpay PG & Subscriptions (Sandbox/Production)</p>
              <p className="text-stone-500 text-[11px]">API Version: 2023-08-01 &bull; Direct Webhooks</p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <span className="text-stone-500 font-semibold uppercase text-[10px] block">Frontend Architecture</span>
              <p className="font-bold text-stone-900 text-sm">Next.js App Router (React 19 + Tailwind CSS)</p>
              <p className="text-stone-500 text-[11px]">Route Group: (super-admin)/admin</p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <span className="text-stone-500 font-semibold uppercase text-[10px] block">Email & Notifications</span>
              <p className="font-bold text-stone-900 text-sm">SMTP (GoDaddy secureserver.net)</p>
              <p className="text-stone-500 text-[11px]">Transactional OTP & Verification Pipeline</p>
            </div>
          </div>
        </div>

        {/* Commercial Plans Reference */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-stone-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-bold text-stone-900 text-base">Commercial Plan Safeguards</h3>
              <p className="text-xs text-stone-500">Security and billing interval enforcement</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
            <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl text-amber-950 flex items-start gap-3">
              <KeyRound className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Premium One-Time Plan Safeguard:</strong> The ₹29,999 Premium plan is strictly configured as a &quot;Contact Sales&quot; package. Online Razorpay PG order creation is blocked at both frontend and backend levels to guarantee bespoke domain and hosting provisioning.
              </div>
            </div>
            <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl text-emerald-950 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Role-Based Endpoint Protection:</strong> Every `/api/admin/*` endpoint validates `is_super_admin: true` at the database level on every request. Regular studio members and tenants cannot access platform revenue or business registries.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
