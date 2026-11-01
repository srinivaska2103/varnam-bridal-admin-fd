'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { ModernDropdown } from '@/components/admin/ModernDropdown';
import { ModernDatePicker } from '@/components/admin/ModernDatePicker';
import { PhoneCall, Mail, Calendar, MessageSquare, Edit3, X, Check } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'NEW', label: 'NEW — Uncontacted', dot: 'bg-blue-500' },
  { value: 'CONTACTED', label: 'CONTACTED — Introductory call done', dot: 'bg-amber-500' },
  { value: 'IN_NEGOTIATION', label: 'IN_NEGOTIATION — Customizing quote & setup', dot: 'bg-purple-500' },
  { value: 'CONVERTED', label: 'CONVERTED — Studio purchased Premium', dot: 'bg-emerald-500' },
  { value: 'CLOSED_LOST', label: 'CLOSED_LOST — Not proceeding', dot: 'bg-stone-400' },
];

export default function AdminEnquiriesPage({ onOpenMobileMenu }) {
  const [enquiries, setEnquiries] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  // Edit / Follow-up modal
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editFollowUpDate, setEditFollowUpDate] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchEnquiries = async (page = 1) => {
    try {
      setLoading(true);
      const res = await adminApi.getPremiumEnquiries({
        page,
        limit: pagination.limit,
        search,
        status: status || undefined,
      });
      setEnquiries(res.data.items);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEnquiries(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [search, status]);

  const handleOpenEdit = (enq) => {
    setSelectedEnquiry(enq);
    setEditStatus(enq.status);
    setEditNotes(enq.notes || '');
    setEditFollowUpDate(enq.follow_up_date ? enq.follow_up_date.split('T')[0] : '');
  };

  const handleSaveEnquiry = async () => {
    if (!selectedEnquiry) return;
    try {
      setSaving(true);
      await adminApi.updatePremiumEnquiry(selectedEnquiry.id, {
        status: editStatus,
        notes: editNotes,
        followUpDate: editFollowUpDate || null,
      });
      setSelectedEnquiry(null);
      fetchEnquiries(pagination.page);
    } catch (err) {
      alert(err.message || 'Failed to update enquiry');
    } finally {
      setSaving(false);
    }
  };

  const statusFilterOptions = [
    { label: 'All Statuses', value: '' },
    { label: 'New Enquiries', value: 'NEW' },
    { label: 'Contacted', value: 'CONTACTED' },
    { label: 'In Negotiation', value: 'IN_NEGOTIATION' },
    { label: 'Converted', value: 'CONVERTED' },
    { label: 'Closed / Lost', value: 'CLOSED_LOST' },
  ];

  const columns = [
    {
      header: 'Studio Name',
      accessor: 'studio_name',
      render: (row) => (
        <div>
          <p className="font-semibold text-stone-900">{row.studio_name}</p>
          <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
            {row.requested_plan}
          </span>
        </div>
      ),
    },
    {
      header: 'Contact Person',
      accessor: 'contact_person',
      render: (row) => (
        <div>
          <p className="font-medium text-stone-800">{row.contact_person}</p>
          <p className="text-[11px] text-stone-500 flex items-center gap-2">
            <span>{row.email}</span>
            <span>&bull;</span>
            <span>{row.phone}</span>
          </p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        const colors = {
          NEW: 'bg-blue-50 text-blue-700 border-blue-200',
          CONTACTED: 'bg-amber-50 text-amber-700 border-amber-200',
          IN_NEGOTIATION: 'bg-orange-50 text-orange-700 border-orange-200',
          CONVERTED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          CLOSED_LOST: 'bg-stone-100 text-stone-500 border-stone-200',
        }[row.status] || 'bg-stone-100 text-stone-700 border-stone-200';

        return (
          <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] border ${colors}`}>
            {row.status}
          </span>
        );
      },
    },
    {
      header: 'Requirements / Notes',
      accessor: 'requirements',
      render: (row) => (
        <div className="max-w-xs">
          <p className="text-stone-700 truncate">{row.requirements || '—'}</p>
          {row.notes && <p className="text-[11px] text-stone-400 italic truncate">Note: {row.notes}</p>}
        </div>
      ),
    },
    {
      header: 'Enquiry Date',
      accessor: 'created_at',
      render: (row) => (
        <span className="text-stone-600">
          {new Date(row.created_at).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => handleOpenEdit(row)}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-orange-600 hover:text-white hover:bg-orange-600 border border-orange-200 rounded-lg transition-all"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Update</span>
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Premium Sales Enquiries"
        subtitle="Manage genuine enterprise sales enquiries from studios interested in the ₹29,999 Premium package"
        onOpenMobileMenu={onOpenMobileMenu}
      />

      <div className="p-3 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <AdminDataTable
          columns={columns}
          data={enquiries}
          pagination={pagination}
          onPageChange={(p) => fetchEnquiries(p)}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by studio name, contact person, email, or phone..."
          filterOptions={statusFilterOptions}
          selectedFilter={status}
          onFilterChange={setStatus}
          isLoading={loading}
          emptyMessage="No genuine Premium sales enquiries recorded"
        />
      </div>

      {/* Update Enquiry Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 p-6 shadow-2xl text-stone-900">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-4">
              <div>
                <h3 className="font-bold text-stone-900 text-base">Update Sales Enquiry</h3>
                <p className="text-xs text-stone-500">{selectedEnquiry.studio_name}</p>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <ModernDropdown
                label="Sales Status"
                value={editStatus}
                onChange={setEditStatus}
                options={STATUS_OPTIONS}
              />

              <ModernDatePicker
                label="Follow-up Date"
                value={editFollowUpDate}
                onChange={setEditFollowUpDate}
                placeholder="Choose follow-up date..."
              />

              <div>
                <label className="font-bold text-stone-700 block mb-1.5">Administrative Notes</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={4}
                  placeholder="Record customer preferences, domain requirements, custom setup notes..."
                  className="w-full text-xs p-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-stone-800 placeholder:text-stone-400 shadow-xs resize-none"
                />
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-stone-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEnquiry}
                disabled={saving}
                className="px-4 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm transition-all"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
