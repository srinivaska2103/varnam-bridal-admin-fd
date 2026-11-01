'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { History, ShieldCheck, User, Eye, X } from 'lucide-react';

export default function AdminActivityPage({ onOpenMobileMenu }) {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Inspection modal
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true);
      const res = await adminApi.getActivityLogs({
        page,
        limit: pagination.limit,
        search,
        action: actionFilter || undefined,
      });
      setLogs(res.data.items);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to load activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [search, actionFilter]);

  const actionFilterOptions = [
    { label: 'All Operations', value: '' },
    { label: 'Payment Success', value: 'CASHFREE_PAYMENT_SUCCESS' },
    { label: 'Subscription Cancelled', value: 'SUBSCRIPTION_CANCELLED' },
    { label: 'Subscription Reactivated', value: 'SUBSCRIPTION_REACTIVATED' },
    { label: 'Contact Sales Submitted', value: 'PREMIUM_CONTACT_SALES_SUBMITTED' },
    { label: 'Admin Suspended / Changed', value: 'ADMIN_ACCOUNT_SUSPENDED' },
  ];

  const columns = [
    {
      header: 'Action / Event',
      accessor: 'action',
      render: (row) => (
        <div>
          <span className="font-mono text-stone-900 font-bold text-xs block">{row.action}</span>
          <span className="text-[10px] text-stone-400 font-mono">{row.entityType}</span>
        </div>
      ),
    },
    {
      header: 'Studio / Tenant',
      accessor: 'businessName',
      render: (row) => (
        <span className="font-semibold text-stone-800">{row.businessName || 'Platform-wide'}</span>
      ),
    },
    {
      header: 'Actor',
      accessor: 'actorEmail',
      render: (row) => (
        <div>
          <p className="font-medium text-stone-900">{row.actorName}</p>
          <p className="text-[11px] text-stone-500">{row.actorEmail}</p>
        </div>
      ),
    },
    {
      header: 'Timestamp',
      accessor: 'timestamp',
      render: (row) => (
        <span className="text-stone-600">
          {new Date(row.timestamp).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
    {
      header: 'Details',
      render: (row) => (
        <button
          onClick={() => setSelectedLog(row)}
          className="p-1.5 text-stone-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
          title="Inspect Payload"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Platform Activity & Audit Logs"
        subtitle="Immutable security trail of administrative actions, plan upgrades, and payment events"
        onOpenMobileMenu={onOpenMobileMenu}
      />

      <div className="p-3 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <AdminDataTable
          columns={columns}
          data={logs}
          pagination={pagination}
          onPageChange={(p) => fetchLogs(p)}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by action, entity, or studio name..."
          filterOptions={actionFilterOptions}
          selectedFilter={actionFilter}
          onFilterChange={setActionFilter}
          isLoading={loading}
          emptyMessage="No audit logs matched your query"
        />
      </div>

      {/* JSON Inspection Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 p-6 shadow-2xl text-stone-900">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h3 className="font-bold text-stone-900 text-base">{selectedLog.action}</h3>
                <p className="text-xs text-stone-500 font-mono">ID: {selectedLog.id}</p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Actor</span>
                <span className="font-semibold text-stone-800">
                  {selectedLog.actorName} ({selectedLog.actorEmail})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Target Studio</span>
                <span className="font-semibold text-stone-800">{selectedLog.businessName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Timestamp</span>
                <span className="text-stone-700">
                  {new Date(selectedLog.timestamp).toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <span className="text-stone-500 font-medium block mb-1.5">Action Metadata (JSON)</span>
                <pre className="p-3 bg-stone-950 text-emerald-400 rounded-xl overflow-x-auto text-[11px] font-mono max-h-56">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
