'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { MetricCard } from '@/components/admin/MetricCard';
import { RevenueChart } from '@/components/admin/RevenueChart';
import { ModernDatePicker } from '@/components/admin/ModernDatePicker';
import { SubscriptionChart } from '@/components/admin/SubscriptionChart';
import { TrendingUp, IndianRupee, Calendar, RefreshCw } from 'lucide-react';

export default function AdminRevenuePage({ onOpenMobileMenu }) {
  const [revenueData, setRevenueData] = useState(null);
  const [interval, setInterval] = useState('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getRevenue({
        interval,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setRevenueData(res.data);
    } catch (err) {
      console.error('Failed to load revenue analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, [interval, startDate, endDate]);

  const metrics = revenueData?.metrics;
  const breakdown = revenueData?.breakdown;

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Revenue Analytics"
        subtitle="Gross successful collections, recurring MRR, plan contribution, and date-range telemetry"
        onOpenMobileMenu={onOpenMobileMenu}
      />

      <div className="p-3 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Date Filter & Range Controls */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-stone-700 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span>Date Range:</span>
            </span>
            <ModernDatePicker
              value={startDate}
              onChange={setStartDate}
              placeholder="Start Date"
              className="w-40"
            />
            <span className="text-stone-400 font-bold">to</span>
            <ModernDatePicker
              value={endDate}
              onChange={setEndDate}
              placeholder="End Date"
              className="w-40"
            />
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                className="text-xs text-orange-600 font-semibold hover:underline"
              >
                Clear Range
              </button>
            )}
          </div>

          <button
            onClick={fetchRevenue}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold border border-stone-300 transition-all self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Recalculate</span>
          </button>
        </div>

        {/* Top Financial Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Gross Verified Collections"
            value={`₹${(metrics?.grossCollectionsRupees || 0).toLocaleString('en-IN')}`}
            subvalue="Confirmed successful Razorpay transactions"
            badgeText="Source of Truth"
            badgeColor="emerald"
            icon={TrendingUp}
          />
          <MetricCard
            title="Monthly Recurring Revenue (MRR)"
            value={`₹${(metrics?.mrrRupees || 0).toLocaleString('en-IN')}`}
            subvalue="Starter (₹599) & Growth (₹999) only"
            badgeText="Recurring"
            badgeColor="orange"
            icon={IndianRupee}
          />
          <MetricCard
            title="Net Collected Revenue"
            value={`₹${(metrics?.netRevenueRupees || 0).toLocaleString('en-IN')}`}
            subvalue="Deducts confirmed refunds and reversals"
            badgeText="Net Realized"
            badgeColor="emerald"
            icon={TrendingUp}
          />
          <MetricCard
            title="Total Paid Transactions"
            value={metrics?.totalTransactions || 0}
            subvalue="Excludes pending and failed checkout sessions"
            badgeText="Orders"
            badgeColor="stone"
            icon={Calendar}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart
              data={revenueData?.timeline || []}
              interval={interval}
              onIntervalChange={setInterval}
            />
          </div>
          <div>
            <SubscriptionChart breakdown={breakdown} />
          </div>
        </div>

        {/* Commercial Plan Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter Plan */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Starter Plan</span>
              <span className="text-xs font-semibold bg-orange-50 border border-orange-200 text-orange-700 px-2 py-0.5 rounded-full">
                ₹599 / month
              </span>
            </div>
            <h4 className="text-2xl font-bold text-stone-900">
              ₹{(breakdown?.starter?.revenueRupees || 0).toLocaleString('en-IN')}
            </h4>
            <p className="text-xs text-stone-500">
              Active Subscribers: <strong>{breakdown?.starter?.activeSubscribers || 0}</strong>
            </p>
            <p className="text-[11px] text-stone-400 pt-2 border-t border-stone-100">
              Core bridal studio management, custom enquiry form, and booking calendar.
            </p>
          </div>

          {/* Growth Plan */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Growth Plan</span>
              <span className="text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded-full">
                ₹999 / month
              </span>
            </div>
            <h4 className="text-2xl font-bold text-stone-900">
              ₹{(breakdown?.growth?.revenueRupees || 0).toLocaleString('en-IN')}
            </h4>
            <p className="text-xs text-stone-500">
              Active Subscribers: <strong>{breakdown?.growth?.activeSubscribers || 0}</strong>
            </p>
            <p className="text-[11px] text-stone-400 pt-2 border-t border-stone-100">
              Starter suite plus branded website, service catalogues, portfolio, and consultation bookings.
            </p>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Premium Plan</span>
              <span className="text-xs font-semibold bg-purple-50 border border-purple-200 text-purple-700 px-2 py-0.5 rounded-full">
                ₹29,999 one-time
              </span>
            </div>
            <h4 className="text-2xl font-bold text-stone-900">
              ₹{(breakdown?.premium?.revenueRupees || 0).toLocaleString('en-IN')}
            </h4>
            <p className="text-xs text-stone-500">
              Verified Sales: <strong>{breakdown?.premium?.salesCount || 0}</strong>
            </p>
            <p className="text-[11px] text-stone-400 pt-2 border-t border-stone-100">
              Contact Sales exclusive. Custom domain, dedicated hosting infrastructure, and 1-yr included hosting. Not counted in recurring MRR.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
