'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { MetricCard } from '@/components/admin/MetricCard';
import { RevenueChart } from '@/components/admin/RevenueChart';
import { SubscriptionChart } from '@/components/admin/SubscriptionChart';
import { RecentAccounts } from '@/components/admin/RecentAccounts';
import { RecentPayments } from '@/components/admin/RecentPayments';
import {
  Building2,
  CreditCard,
  IndianRupee,
  Receipt,
  TrendingUp,
  UserPlus,
  Clock,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Calendar,
} from 'lucide-react';

export default function SuperAdminDashboardPage({ onOpenMobileMenu }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [revenueInterval, setRevenueInterval] = useState('monthly');
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dashRes, revRes] = await Promise.all([
        adminApi.getDashboard(),
        adminApi.getRevenue({ interval: revenueInterval }),
      ]);
      setData(dashRes.data);
      setRevenueData(revRes.data);
    } catch (err) {
      console.warn('Admin dashboard fetch issue:', err?.message || err);
      if (err?.status === 401 || err?.message?.includes('expired') || err?.message?.includes('token')) {
        // Handled by apiClient 401 interceptor which clears storage and redirects to /login
        return;
      }
      setError(err.message || 'Failed to load platform dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [revenueInterval]);

  const kpis = data?.kpiCards;

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Platform Overview"
        subtitle="Real-time multi-tenant analytics and verified Razorpay subscription telemetry"
        onOpenMobileMenu={onOpenMobileMenu}
      />

      <div className="p-3 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto w-full">
        {/* Header Actions / Telemetry bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white p-3.5 sm:p-5 rounded-2xl shadow-lg shadow-orange-500/20 border border-orange-400/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/20 backdrop-blur-xs text-white border border-white/30 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-100" />
            </div>
            <div className="min-w-0">
              <p className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <span>Live Platform Telemetry</span>
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-300 ring-4 ring-emerald-300/30 animate-pulse shrink-0" />
              </p>
              <p className="text-[11px] sm:text-xs text-orange-50/90 mt-0.5 font-medium line-clamp-2">
                All statistics aggregated directly from active PostgreSQL business & order records.
              </p>
            </div>
          </div>
          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 bg-white hover:bg-orange-50 text-orange-700 hover:text-orange-800 rounded-xl text-xs font-bold shadow-md shadow-orange-950/10 hover:shadow-orange-950/20 transition-all self-stretch sm:self-auto disabled:opacity-50 cursor-pointer active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Metrics</span>
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 8 Primary KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Total Accounts */}
          <MetricCard
            title="Total Registered Accounts"
            value={kpis?.totalAccounts?.count ?? '—'}
            subvalue={`${kpis?.totalAccounts?.createdThisMonth ?? 0} registered this month`}
            change={kpis?.totalAccounts?.momPercentageChange}
            changeLabel="vs previous month"
            icon={Building2}
          />

          {/* 2. Active Subscriptions */}
          <MetricCard
            title="Active Paid Subscriptions"
            value={kpis?.activeSubscriptions?.totalActive ?? '—'}
            subvalue={
              <span className="flex items-center gap-2">
                <span>Starter: {kpis?.activeSubscriptions?.starter ?? 0}</span>
                <span>&bull;</span>
                <span>Growth: {kpis?.activeSubscriptions?.growth ?? 0}</span>
                <span>&bull;</span>
                <span>Prem: {kpis?.activeSubscriptions?.premium ?? 0}</span>
              </span>
            }
            badgeText={
              kpis?.activeSubscriptions?.cancelledStillActive
                ? `${kpis.activeSubscriptions.cancelledStillActive} Cancelled Active`
                : undefined
            }
            badgeColor="amber"
            icon={CreditCard}
          />

          {/* 3. Monthly Revenue */}
          <MetricCard
            title="Monthly Revenue"
            value={
              kpis?.monthlyRevenue
                ? `₹${kpis.monthlyRevenue.amountRupees.toLocaleString('en-IN')}`
                : '—'
            }
            subvalue="Verified Razorpay collections this month"
            change={kpis?.monthlyRevenue?.momPercentageChange}
            changeLabel="vs previous month"
            badgeText="Verified"
            badgeColor="emerald"
            icon={IndianRupee}
          />

          {/* 4. Total Platform Revenue */}
          <MetricCard
            title="Total Collected Revenue"
            value={
              kpis?.totalRevenue
                ? `₹${kpis.totalRevenue.amountRupees.toLocaleString('en-IN')}`
                : '—'
            }
            subvalue={
              <span>
                MRR: <strong>₹{(kpis?.totalRevenue?.mrrRupees || 0).toLocaleString('en-IN')}</strong> &bull; ARPU: ₹{kpis?.totalRevenue?.arpuRupees || 0}
              </span>
            }
            badgeText="Excludes Pending"
            badgeColor="emerald"
            icon={TrendingUp}
          />

          {/* 5. New Accounts */}
          <MetricCard
            title="New Registrations"
            value={kpis?.newAccounts?.today ?? '—'}
            subvalue={`${kpis?.newAccounts?.last30Days ?? 0} registrations in past 30 days`}
            badgeText="Today"
            badgeColor="orange"
            icon={UserPlus}
          />

          {/* 6. Expiring Subscriptions */}
          <MetricCard
            title="Expiring & Grace Subscriptions"
            value={kpis?.expiringSubscriptions?.approachingRenewal ?? '—'}
            subvalue={
              <span>
                {kpis?.expiringSubscriptions?.expired ?? 0} expired &bull;{' '}
                {kpis?.expiringSubscriptions?.cancelledInGrace ?? 0} in paid grace
              </span>
            }
            badgeText="Next 7 Days"
            badgeColor="amber"
            icon={Clock}
          />

          {/* 7. Failed & Pending Payments */}
          <MetricCard
            title="Payments Requiring Action"
            value={kpis?.failedPayments?.requiringAction ?? '—'}
            subvalue={
              <span>
                {kpis?.failedPayments?.failedCount ?? 0} failed &bull;{' '}
                {kpis?.failedPayments?.pendingCount ?? 0} pending confirmation
              </span>
            }
            badgeText={kpis?.failedPayments?.requiringAction > 0 ? 'Action Needed' : 'Healthy'}
            badgeColor={kpis?.failedPayments?.requiringAction > 0 ? 'rose' : 'emerald'}
            icon={AlertTriangle}
          />

          {/* 8. Trial Accounts */}
          <MetricCard
            title="Trial / Unpaid Studios"
            value={kpis?.trialAccounts?.count ?? '—'}
            subvalue="Studios exploring Starter features during grace/trial"
            badgeText="Free Tier"
            badgeColor="stone"
            icon={Building2}
          />
        </div>

        {/* Analytics Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart
              data={revenueData?.timeline || []}
              interval={revenueInterval}
              onIntervalChange={(int) => setRevenueInterval(int)}
            />
          </div>
          <div>
            <SubscriptionChart breakdown={revenueData?.breakdown} />
          </div>
        </div>

        {/* Real Data Tables: Recent Accounts & Payments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentAccounts accounts={data?.recentAccounts || []} />
          <RecentPayments payments={data?.recentPayments || []} />
        </div>
      </div>
    </div>
  );
}
