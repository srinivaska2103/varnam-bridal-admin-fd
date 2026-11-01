'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ModernDropdown } from '@/components/admin/ModernDropdown';
import { ModernDatePicker } from '@/components/admin/ModernDatePicker';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import {
  FileSpreadsheet,
  Download,
  Building2,
  Inbox,
  Filter,
  IndianRupee,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';

const REPORT_TYPE_OPTIONS = [
  { value: 'accounts', label: 'Studio Accounts (Multi-tenant)' },
  { value: 'payments', label: 'Verified Payments (Razorpay)' },
  { value: 'enquiries', label: 'Premium Sales Enquiries' },
];

export default function AdminReportsPage({ onOpenMobileMenu }) {
  const [reportType, setReportType] = useState('accounts');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [downloading, setDownloading] = useState(false);

  // Live Data Fetching & Table State
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getReports({
        type: reportType,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setReportData(res.data || []);
    } catch (err) {
      console.error('Failed to load report data:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [reportType, startDate, endDate]);

  const handleExportCsv = async () => {
    try {
      setDownloading(true);
      const url = adminApi.exportReportCsvUrl(reportType, {
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      // Use fetch with Authorization token to enforce security on download
      const token = typeof window !== 'undefined' ? localStorage.getItem('vexa_auth_token') : '';
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate CSV export');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `VEXA_TECH_${reportType.toUpperCase()}_REPORT_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert(err.message || 'Error downloading CSV report');
    } finally {
      setDownloading(false);
    }
  };

  const reportCards = [
    {
      id: 'accounts',
      title: 'Studio Registrations Report',
      description: 'Full database export of registered studios, account owners, contact details, and subscription tiers.',
      icon: Building2,
    },
    {
      id: 'payments',
      title: 'Successful Collections & Payments',
      description: 'Audit report of confirmed Razorpay payments, order references, plans, and transaction dates.',
      icon: IndianRupee,
    },
    {
      id: 'enquiries',
      title: 'Premium Sales Enquiries',
      description: 'Export of genuine sales leads, studio contact numbers, requirements, and follow-up notes.',
      icon: Inbox,
    },
  ];

  // Dynamic table columns based on selected reportType
  const getColumns = () => {
    if (reportType === 'accounts') {
      return [
        {
          header: 'Business Name',
          accessor: 'Business_Name',
          render: (row) => (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0">
                {row.Business_Name ? row.Business_Name[0].toUpperCase() : 'B'}
              </div>
              <div>
                <p className="font-semibold text-stone-900">{row.Business_Name}</p>
                <p className="text-[11px] text-stone-400 font-mono">/{row.Slug}</p>
              </div>
            </div>
          ),
        },
        {
          header: 'Owner Details',
          accessor: 'Owner_Name',
          render: (row) => (
            <div>
              <p className="font-medium text-stone-900">{row.Owner_Name}</p>
              <p className="text-[11px] text-stone-500">{row.Owner_Email || row.Phone || '—'}</p>
            </div>
          ),
        },
        {
          header: 'Plan & Status',
          accessor: 'Plan',
          render: (row) => (
            <div>
              <span className="font-semibold text-stone-800 text-xs">{row.Plan}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                  row.Subscription_Status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />
                <span className="text-[10px] uppercase font-mono font-bold text-stone-500">
                  {row.Subscription_Status}
                </span>
              </div>
            </div>
          ),
        },
        {
          header: 'City',
          accessor: 'City',
          render: (row) => <span className="text-stone-700 font-medium">{row.City || '—'}</span>,
        },
        {
          header: 'Registered Date',
          accessor: 'Registered_At',
          render: (row) => (
            <span className="text-stone-500 font-mono text-[11px]">
              {row.Registered_At ? new Date(row.Registered_At).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }) : '—'}
            </span>
          ),
        },
      ];
    }

    if (reportType === 'payments') {
      return [
        {
          header: 'Payment Reference',
          accessor: 'Razorpay_Reference',
          render: (row) => (
            <div>
              <span className="font-mono text-stone-900 font-semibold text-xs block">
                {row.Razorpay_Reference || row.Payment_ID?.slice(0, 12)}
              </span>
              <span className="text-[10px] text-stone-400 uppercase font-mono">{row.Order_Type || 'ORDER'}</span>
            </div>
          ),
        },
        {
          header: 'Studio Name',
          accessor: 'Business_Name',
          render: (row) => <p className="font-semibold text-stone-900">{row.Business_Name || '—'}</p>,
        },
        {
          header: 'Plan',
          accessor: 'Plan_Name',
          render: (row) => <span className="text-xs font-medium text-stone-800">{row.Plan_Name || '—'}</span>,
        },
        {
          header: 'Amount (INR)',
          accessor: 'Amount_INR',
          render: (row) => (
            <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
              <IndianRupee className="w-3.5 h-3.5" />
              <span>{Number(row.Amount_INR || 0).toLocaleString('en-IN')}</span>
            </div>
          ),
        },
        {
          header: 'Payment Status',
          accessor: 'Payment_Status',
          render: (row) => (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              row.Payment_Status === 'SUCCESS'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              <CheckCircle2 className="w-3 h-3" />
              {row.Payment_Status}
            </span>
          ),
        },
        {
          header: 'Paid Date',
          accessor: 'Paid_At',
          render: (row) => (
            <span className="text-stone-500 font-mono text-[11px]">
              {row.Paid_At ? new Date(row.Paid_At).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }) : '—'}
            </span>
          ),
        },
      ];
    }

    // Default enquiries columns
    return [
      {
        header: 'Studio Name',
        accessor: 'Studio_Name',
        render: (row) => (
          <div>
            <p className="font-semibold text-stone-900">{row.Studio_Name}</p>
            <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
              {row.Requested_Plan || 'PREMIUM'}
            </span>
          </div>
        ),
      },
      {
        header: 'Contact Person',
        accessor: 'Contact_Person',
        render: (row) => (
          <div>
            <p className="font-medium text-stone-900">{row.Contact_Person}</p>
            <p className="text-[11px] text-stone-500">{row.Email || row.Phone || '—'}</p>
          </div>
        ),
      },
      {
        header: 'Lead Status',
        accessor: 'Status',
        render: (row) => (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200">
            {row.Status}
          </span>
        ),
      },
      {
        header: 'Enquiry Date',
        accessor: 'Created_At',
        render: (row) => (
          <span className="text-stone-500 font-mono text-[11px]">
            {row.Created_At ? new Date(row.Created_At).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }) : '—'}
          </span>
        ),
      },
    ];
  };

  // Filtered data based on search input
  const filteredData = reportData.filter((item) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return Object.values(item).some((val) =>
      val !== null && val !== undefined && String(val).toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Reports & Data Export"
        subtitle="Export platform accounts, verified payment collections, and sales enquiries to secure CSV files"
        onOpenMobileMenu={onOpenMobileMenu}
      />

      <div className="p-3 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Report Selector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reportCards.map((card) => {
            const isSelected = reportType === card.id;
            const Icon = card.icon;

            return (
              <div
                key={card.id}
                onClick={() => setReportType(card.id)}
                className={`p-6 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-orange-50/50 border-orange-500 shadow-md ring-2 ring-orange-500/20'
                    : 'bg-white border-stone-200 hover:border-orange-200 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? 'bg-orange-600 text-white shadow-sm'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white px-2 py-0.5 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-stone-900 text-base mb-1">{card.title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{card.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-700">Format: CSV</span>
                  <span className="text-orange-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Database Records
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Export Configuration & Execution */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-orange-600" />
              <h4 className="font-bold text-stone-900 text-sm">Filter & Export Settings</h4>
            </div>

            <button
              onClick={fetchReportData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-xl transition-all self-start sm:self-auto disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-orange-600' : ''}`} />
              <span>Refresh Records</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <ModernDropdown
                label="Report Dataset"
                value={reportType}
                onChange={setReportType}
                options={REPORT_TYPE_OPTIONS}
              />
            </div>

            <div>
              <ModernDatePicker
                label="Start Date (Optional)"
                value={startDate}
                onChange={setStartDate}
                placeholder="Start Date"
              />
            </div>

            <div>
              <ModernDatePicker
                label="End Date (Optional)"
                value={endDate}
                onChange={setEndDate}
                placeholder="End Date"
              />
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-stone-900">Security & Privacy Protection</p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Passwords, secret keys, and JWT tokens are permanently omitted from all administrative export files.
              </p>
            </div>

            <button
              onClick={handleExportCsv}
              disabled={downloading}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-orange-950/20 transition-all disabled:opacity-50 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Generating CSV...' : 'Download CSV Export'}</span>
            </button>
          </div>
        </div>

        {/* Live Fetched Report Data Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-orange-600" />
              <h3 className="font-bold text-stone-900 text-sm">
                Live Data Preview ({filteredData.length} records)
              </h3>
            </div>
            {startDate || endDate ? (
              <span className="text-[11px] text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200 font-medium">
                Filtered by date range
              </span>
            ) : null}
          </div>

          <AdminDataTable
            columns={getColumns()}
            data={filteredData}
            isLoading={loading}
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search within loaded report records..."
            emptyMessage={
              error
                ? `Failed to load records: ${error}`
                : 'No database records found matching this report and date criteria.'
            }
          />
        </div>
      </div>
    </div>
  );
}
