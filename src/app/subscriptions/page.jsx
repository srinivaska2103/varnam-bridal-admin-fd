'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { CreditCard, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export default function AdminSubscriptionsPage({ onOpenMobileMenu }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [planCode, setPlanCode] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async (page = 1) => {
    try {
      setLoading(true);
      const res = await adminApi.getSubscriptions({
        page,
        limit: pagination.limit,
        search,
        planCode: planCode || undefined,
        status: status || undefined,
      });
      setSubscriptions(res.data.items);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSubscriptions(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [search, planCode, status]);

  const planFilterOptions = [
    { label: 'All Plans', value: '' },
    { label: 'Starter Monthly (₹599)', value: 'BASIC_MONTHLY' },
    { label: 'Growth Monthly (₹999)', value: 'GROWTH_MONTHLY' },
    { label: 'Premium One-Time (₹29,999)', value: 'EXCLUSIVE_LIFETIME' },
  ];

  const columns = [
    {
      header: 'Business Name',
      accessor: 'businessName',
      render: (row) => (
        <div>
          <p className="font-semibold text-stone-900">{row.businessName}</p>
          <p className="text-[11px] text-stone-500">{row.ownerEmail}</p>
        </div>
      ),
    },
    {
      header: 'Plan',
      accessor: 'planName',
      render: (row) => (
        <div>
          <span className="font-semibold text-stone-900">{row.planName}</span>
          <p className="text-[11px] text-stone-500">
            ₹{row.priceRupees.toLocaleString('en-IN')} {row.billingType === 'RECURRING' ? '/ mo' : 'one-time'}
          </p>
        </div>
      ),
    },
    {
      header: 'Starts At',
      accessor: 'startsAt',
      render: (row) => (
        <span className="text-stone-600">
          {row.startsAt ? new Date(row.startsAt).toLocaleDateString('en-IN') : '—'}
        </span>
      ),
    },
    {
      header: 'Ends / Renewal Date',
      accessor: 'endsAt',
      render: (row) => {
        if (!row.endsAt) return <span className="text-stone-400">Lifetime / Ongoing</span>;
        const isPast = new Date(row.endsAt) < new Date();
        return (
          <span className={isPast ? 'text-rose-600 font-semibold' : 'text-stone-700'}>
            {new Date(row.endsAt).toLocaleDateString('en-IN')}
          </span>
        );
      },
    },
    {
      header: 'Auto-Renew',
      accessor: 'autoRenew',
      render: (row) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
            row.autoRenew
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-stone-100 text-stone-600 border-stone-200'
          }`}
        >
          {row.autoRenew ? 'Enabled' : 'Disabled'}
        </span>
      ),
    },
    {
      header: 'Razorpay / Purchase Ref',
      accessor: 'purchaseReference',
      render: (row) => (
        <span className="font-mono text-[11px] text-stone-500 truncate max-w-[140px] block">
          {row.purchaseReference || 'Direct Entitlement'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        const colors = {
          ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          TRIAL: 'bg-blue-50 text-blue-700 border-blue-200',
          CANCELLED: 'bg-amber-50 text-amber-700 border-amber-200',
          EXPIRED: 'bg-rose-50 text-rose-700 border-rose-200',
          PAST_DUE: 'bg-orange-50 text-orange-700 border-orange-200',
        }[row.status] || 'bg-stone-100 text-stone-700 border-stone-200';

        return (
          <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] border ${colors}`}>
            {row.status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Subscriptions Management"
        subtitle="Active entitlements, grace periods, Razorpay references, and auto-renewal policies"
        onOpenMobileMenu={onOpenMobileMenu}
      />

      <div className="p-3 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <AdminDataTable
          columns={columns}
          data={subscriptions}
          pagination={pagination}
          onPageChange={(p) => fetchSubscriptions(p)}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by business name or email..."
          filterOptions={planFilterOptions}
          selectedFilter={planCode}
          onFilterChange={setPlanCode}
          isLoading={loading}
          emptyMessage="No studio subscriptions matched your filter criteria"
        />
      </div>
    </div>
  );
}
