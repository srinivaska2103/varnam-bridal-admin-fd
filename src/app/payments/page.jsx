'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { CheckCircle2, Clock, XCircle, AlertCircle, Eye, X, IndianRupee } from 'lucide-react';

export default function AdminPaymentsPage({ onOpenMobileMenu }) {
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [planCode, setPlanCode] = useState('');
  const [loading, setLoading] = useState(true);

  // Detail Modal
  const [selectedPayment, setSelectedPayment] = useState(null);

  const fetchPayments = async (page = 1) => {
    try {
      setLoading(true);
      const res = await adminApi.getPayments({
        page,
        limit: pagination.limit,
        search,
        status: status || undefined,
        planCode: planCode || undefined,
      });
      setPayments(res.data.items);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPayments(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [search, status, planCode]);

  const statusFilterOptions = [
    { label: 'All Statuses', value: '' },
    { label: 'Successful Payments', value: 'SUCCESS' },
    { label: 'Pending Authorizations', value: 'PENDING' },
    { label: 'Failed Payments', value: 'FAILED' },
  ];

  const columns = [
    {
      header: 'Razorpay / Order Ref',
      accessor: 'paymentReference',
      render: (row) => (
        <div>
          <span className="font-mono text-stone-900 font-semibold text-xs block">{row.paymentReference}</span>
          <span className="text-[10px] text-stone-400 uppercase font-mono">{row.orderType}</span>
        </div>
      ),
    },
    {
      header: 'Business & Owner',
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
      render: (row) => <span className="font-medium text-stone-800">{row.planName}</span>,
    },
    {
      header: (
        <span className="inline-flex items-center gap-1">
          <IndianRupee className="w-3.5 h-3.5 text-stone-500" />
          <span>Amount (INR)</span>
        </span>
      ),
      accessor: 'amountRupees',
      render: (row) => (
        <span
          className={`font-bold inline-flex items-center gap-0.5 ${
            row.status === 'SUCCESS' ? 'text-emerald-600' : 'text-stone-900'
          }`}
        >
          ₹{row.amountRupees.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      header: 'Payment Status',
      accessor: 'status',
      render: (row) => {
        const isSuccess = row.status === 'SUCCESS';
        const isPending = row.status === 'PENDING';
        const isFailed = row.status === 'FAILED';

        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] border ${
              isSuccess
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : isPending
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
            {isPending && <Clock className="w-3 h-3 text-amber-600" />}
            {isFailed && <XCircle className="w-3 h-3 text-rose-600" />}
            <span>{row.status}</span>
          </span>
        );
      },
    },
    {
      header: 'Payment Date',
      accessor: 'paidAt',
      render: (row) => (
        <span className="text-stone-600">
          {row.paidAt
            ? new Date(row.paidAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Pending'}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => setSelectedPayment(row)}
          className="p-1.5 text-stone-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
          title="Inspect Payment Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Subscription Payments"
        subtitle="Verified Razorpay gateway and mandate transactions collected from studios"
        onOpenMobileMenu={onOpenMobileMenu}
      />

      <div className="p-3 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <AdminDataTable
          columns={columns}
          data={payments}
          pagination={pagination}
          onPageChange={(p) => fetchPayments(p)}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by Razorpay order reference or studio name..."
          filterOptions={statusFilterOptions}
          selectedFilter={status}
          onFilterChange={setStatus}
          isLoading={loading}
          emptyMessage="No payment transaction records found"
        />
      </div>

      {/* Payment Details Inspection Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 p-6 shadow-2xl text-stone-900">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-bold text-stone-900 text-base">Payment Order Details</h3>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Order ID</span>
                <span className="font-mono font-semibold text-stone-900">{selectedPayment.paymentReference}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Studio</span>
                <span className="font-semibold text-stone-900">{selectedPayment.businessName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Account Owner</span>
                <span className="text-stone-700">{selectedPayment.ownerEmail}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Plan</span>
                <span className="font-semibold text-stone-900">{selectedPayment.planName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Amount Collected</span>
                <span className="font-bold text-emerald-600 text-sm">
                  ₹{selectedPayment.amountRupees.toLocaleString('en-IN')} {selectedPayment.currency}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Status</span>
                <span className="font-bold uppercase text-[11px] text-stone-900">{selectedPayment.status}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Payment Provider</span>
                <span className="text-stone-700">{selectedPayment.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Created Timestamp</span>
                <span className="text-stone-600">
                  {new Date(selectedPayment.createdAt).toLocaleString('en-IN')}
                </span>
              </div>
              {selectedPayment.paidAt && (
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span className="text-stone-500 font-medium">Verified Paid At</span>
                  <span className="text-stone-600">
                    {new Date(selectedPayment.paidAt).toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              {selectedPayment.errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 mt-2">
                  <p className="font-bold">Error Information:</p>
                  <p>{selectedPayment.errorMessage}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedPayment(null)}
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
