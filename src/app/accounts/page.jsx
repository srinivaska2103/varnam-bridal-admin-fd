'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import {
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  ShieldAlert,
  ShieldCheck,
  X,
  FileSpreadsheet,
} from 'lucide-react';

export default function AdminAccountsPage({ onOpenMobileMenu }) {
  const [accounts, setAccounts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Modal inspection state
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [accountDetails, setAccountDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Status update confirmation
  const [statusUpdateTarget, setStatusUpdateTarget] = useState(null);
  const [statusReason, setStatusReason] = useState('');
  const [submittingStatus, setSubmittingStatus] = useState(false);

  const fetchAccounts = async (page = 1) => {
    try {
      setLoading(true);
      const res = await adminApi.getAccounts({
        page,
        limit: pagination.limit,
        search,
        filter,
      });
      setAccounts(res.data.items);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to load accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAccounts(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [search, filter]);

  const handlePageChange = (newPage) => {
    fetchAccounts(newPage);
  };

  const handleViewDetails = async (id) => {
    try {
      setSelectedAccountId(id);
      setLoadingDetails(true);
      const res = await adminApi.getAccountById(id);
      setAccountDetails(res.data);
    } catch (err) {
      console.error('Failed to fetch account details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!statusUpdateTarget) return;
    try {
      setSubmittingStatus(true);
      await adminApi.updateAccountStatus(statusUpdateTarget.id, {
        status: statusUpdateTarget.newStatus,
        reason: statusReason,
      });
      setStatusUpdateTarget(null);
      setStatusReason('');
      fetchAccounts(pagination.page);
      if (selectedAccountId) {
        handleViewDetails(selectedAccountId);
      }
    } catch (err) {
      alert(err.message || 'Failed to update account status');
    } finally {
      setSubmittingStatus(false);
    }
  };

  const filterOptions = [
    { label: 'All Accounts', value: 'ALL' },
    { label: 'Recently Registered (30d)', value: 'RECENT' },
    { label: 'Active Subscriptions', value: 'ACTIVE_SUBSCRIPTION' },
    { label: 'Cancelled Subscriptions', value: 'CANCELLED' },
    { label: 'Expired Subscriptions', value: 'EXPIRED' },
    { label: 'Trial / Unpaid Studios', value: 'TRIAL_OR_UNPAID' },
  ];

  const columns = [
    {
      header: 'Business Name',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0">
            {row.name ? row.name[0].toUpperCase() : 'B'}
          </div>
          <div>
            <p className="font-semibold text-stone-900">{row.name}</p>
            <p className="text-[11px] text-stone-400 font-mono">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Owner',
      accessor: 'ownerName',
      render: (row) => (
        <div>
          <p className="font-medium text-stone-800">{row.ownerName}</p>
          <p className="text-[11px] text-stone-500">{row.ownerEmail}</p>
        </div>
      ),
    },
    {
      header: 'Registration',
      accessor: 'registrationDate',
      render: (row) => (
        <span className="text-stone-600">
          {new Date(row.registrationDate).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      ),
    },
    {
      header: 'Current Plan',
      accessor: 'planName',
      render: (row) => (
        <span className="font-semibold text-stone-900 bg-stone-100 border border-stone-200 px-2.5 py-0.5 rounded-full text-[11px]">
          {row.planName}
        </span>
      ),
    },
    {
      header: 'Sub Status',
      accessor: 'subscriptionStatus',
      render: (row) => {
        const statusColors = {
          ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          TRIAL: 'bg-blue-50 text-blue-700 border-blue-200',
          CANCELLED: 'bg-amber-50 text-amber-700 border-amber-200',
          EXPIRED: 'bg-rose-50 text-rose-700 border-rose-200',
          PAST_DUE: 'bg-orange-50 text-orange-700 border-orange-200',
        }[row.subscriptionStatus] || 'bg-stone-50 text-stone-700 border-stone-200';

        return (
          <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] border ${statusColors}`}>
            {row.subscriptionStatus}
          </span>
        );
      },
    },
    {
      header: 'Account Status',
      accessor: 'accountStatus',
      render: (row) => {
        const isSuspended = row.accountStatus === 'SUSPENDED';
        return (
          <span
            className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] border ${
              isSuspended
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-stone-100 text-stone-700 border-stone-200'
            }`}
          >
            {row.accountStatus}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleViewDetails(row.id)}
            className="p-1.5 text-stone-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            title="Inspect Account"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.accountStatus === 'ACTIVE' ? (
            <button
              onClick={() =>
                setStatusUpdateTarget({
                  id: row.id,
                  name: row.name,
                  newStatus: 'SUSPENDED',
                })
              }
              className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Suspend Studio"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() =>
                setStatusUpdateTarget({
                  id: row.id,
                  name: row.name,
                  newStatus: 'ACTIVE',
                })
              }
              className="p-1.5 text-stone-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Reactivate Studio"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Accounts Management"
        subtitle="Search, inspect, and manage registered studios and business tenants"
        onOpenMobileMenu={onOpenMobileMenu}
      />

      <div className="p-3 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <AdminDataTable
          columns={columns}
          data={accounts}
          pagination={pagination}
          onPageChange={handlePageChange}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by business name, owner email, slug, or city..."
          filterOptions={filterOptions}
          selectedFilter={filter}
          onFilterChange={setFilter}
          isLoading={loading}
          emptyMessage="No businesses matched your search filters"
        />
      </div>

      {/* Account Details Modal */}
      {selectedAccountId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-base">
                  {accountDetails?.name ? accountDetails.name[0].toUpperCase() : 'B'}
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-base">{accountDetails?.name}</h3>
                  <p className="text-xs text-stone-500">ID: {accountDetails?.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAccountId(null)}
                className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar text-xs text-stone-700">
              {loadingDetails ? (
                <div className="py-12 text-center text-stone-400">Loading details...</div>
              ) : (
                <>
                  {/* Business Overview */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase font-bold block">Status</span>
                      <span className="font-semibold text-stone-900">{accountDetails?.status}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase font-bold block">Plan</span>
                      <span className="font-semibold text-stone-900">
                        {accountDetails?.business_entitlements?.plans?.name || 'Starter Monthly'}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase font-bold block">Entitlement</span>
                      <span className="font-semibold text-stone-900">
                        {accountDetails?.business_entitlements?.status || 'TRIAL'}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase font-bold block">Total Customers</span>
                      <span className="font-semibold text-stone-900">{accountDetails?._count?.customers || 0}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase font-bold block">Bookings</span>
                      <span className="font-semibold text-stone-900">{accountDetails?._count?.bookings || 0}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase font-bold block">Enquiries</span>
                      <span className="font-semibold text-stone-900">{accountDetails?._count?.enquiries || 0}</span>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs mb-2">Team & Owners</h4>
                    <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
                      {accountDetails?.business_members?.map((m) => (
                        <div key={m.id} className="p-3 flex items-center justify-between bg-white">
                          <div>
                            <p className="font-semibold text-stone-900">{m.users?.name}</p>
                            <p className="text-[11px] text-stone-500">{m.users?.email}</p>
                          </div>
                          <span className="text-[10px] font-bold uppercase bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                            {m.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Records */}
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs mb-2">Subscription Order History</h4>
                    <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
                      {accountDetails?.subscription_orders?.length === 0 ? (
                        <div className="p-4 text-center text-stone-400 text-xs">No payment orders recorded yet</div>
                      ) : (
                        accountDetails?.subscription_orders?.map((ord) => (
                          <div key={ord.id} className="p-3 flex items-center justify-between bg-white">
                            <div>
                              <p className="font-mono text-stone-900 font-medium">
                                {ord.cf_order_id || ord.id}
                              </p>
                              <p className="text-[11px] text-stone-500">
                                {ord.plans?.name} &bull; {new Date(ord.created_at).toLocaleDateString('en-IN')}
                              </p>
                            </div>
                            <div className="text-right">
                              <span
                                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                                  ord.status === 'SUCCESS'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-stone-100 text-stone-700 border-stone-200'
                                }`}
                              >
                                {ord.status}
                              </span>
                              <p className="text-xs font-bold text-stone-900 mt-1">
                                ₹{(Number(ord.amount_paise) / 100).toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Suspension / Reactivation */}
      {statusUpdateTarget && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 p-6 shadow-2xl text-stone-900">
            <h3 className="text-base font-bold text-stone-900 mb-2">
              Confirm Account {statusUpdateTarget.newStatus === 'ACTIVE' ? 'Reactivation' : 'Suspension'}
            </h3>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Are you sure you want to change the status of <strong>{statusUpdateTarget.name}</strong> to{' '}
              <span className="font-bold text-orange-600">{statusUpdateTarget.newStatus}</span>?
              {statusUpdateTarget.newStatus === 'SUSPENDED' &&
                ' This will temporarily disable studio owner access while completely preserving all business bookings and database records.'}
            </p>

            <div className="mb-4">
              <label className="text-[11px] font-bold uppercase text-stone-500 block mb-1">
                Reason / Administrative Note
              </label>
              <textarea
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                placeholder="Enter non-sensitive reason for audit logs..."
                rows={3}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setStatusUpdateTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusChange}
                disabled={submittingStatus}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-sm transition-all ${
                  statusUpdateTarget.newStatus === 'SUSPENDED'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {submittingStatus ? 'Saving...' : 'Confirm Action'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
