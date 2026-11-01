'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MessageSquare,
  IndianRupee,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Building2,
  FileText,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Plus,
  Sliders,
  AlertCircle,
  ExternalLink,
  Lock,
  ArrowUpRight,
  ChevronRight,
  Filter,
  Check,
} from 'lucide-react';
import { adminApi } from '@/services/adminApi';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function WhatsAppBillingPage({ onOpenMobileMenu }) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview'); // overview | studios | usages | pricing | meta

  // Modals
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    invoice_number: '',
    billing_period_start: '',
    billing_period_end: '',
    invoice_total_rupees: '',
    tax_amount_rupees: '',
    document_reference: '',
    notes: '',
  });

  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
  const [settlementForm, setSettlementForm] = useState({
    meta_invoice_id: '',
    settlement_reference: '',
    payment_date: '',
    amount_paid_rupees: '',
    payment_method: 'BANK_TRANSFER',
    notes: '',
  });

  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [pricingForm, setPricingForm] = useState({
    country_code: 'IN',
    message_category: 'MARKETING',
    base_rate_rupees: '',
    tax_rate_percent: '18.00',
    notes: '',
  });

  // 1. Fetch Overview & KPIs
  const { data: overviewRes, isLoading: isOverviewLoading, refetch: refetchOverview } = useQuery({
    queryKey: ['admin-wa-overview'],
    queryFn: () => adminApi.getWhatsAppBillingOverview(),
  });

  // 2. Fetch Studio Accounts
  const { data: studiosRes, isLoading: isStudiosLoading } = useQuery({
    queryKey: ['admin-wa-studios'],
    queryFn: () => adminApi.getWhatsAppStudios(),
    enabled: activeTab === 'studios',
  });

  // 3. Fetch Campaign Usages
  const { data: usagesRes, isLoading: isUsagesLoading } = useQuery({
    queryKey: ['admin-wa-usages'],
    queryFn: () => adminApi.getWhatsAppCampaignUsages(),
    enabled: activeTab === 'usages',
  });

  // 4. Fetch Pricing Rules
  const { data: pricingRes, isLoading: isPricingLoading } = useQuery({
    queryKey: ['admin-wa-pricing'],
    queryFn: () => adminApi.getWhatsAppPricingRules('IN'),
    enabled: activeTab === 'pricing',
  });

  // 5. Fetch Meta Invoices & Settlements
  const { data: metaDataRes, isLoading: isMetaLoading } = useQuery({
    queryKey: ['admin-wa-meta'],
    queryFn: () => adminApi.getMetaInvoicesAndSettlements(),
    enabled: activeTab === 'meta',
  });

  const kpi = overviewRes?.data?.kpi || {
    total_customer_cash_collected_rupees: 0,
    customer_prepaid_credit_liability_rupees: 0,
    customer_reserved_credits_rupees: 0,
    varnam_messaging_revenue_rupees: 0,
    estimated_meta_messaging_cost_rupees: 0,
    actual_meta_invoiced_rupees: 0,
    actual_meta_settled_rupees: 0,
    outstanding_meta_payable_rupees: 0,
  };

  const billingConfig = overviewRes?.data?.billing_config || {
    billing_mode: 'DIRECT_STUDIO_BILLING',
    is_live_billing_verified: false,
  };

  // Toggle Billing Mode Mutation
  const updateConfigMutation = useMutation({
    mutationFn: (data) => adminApi.updateWhatsAppBillingConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-wa-overview'] });
    },
  });

  // Record Meta Invoice Mutation
  const recordInvoiceMutation = useMutation({
    mutationFn: (data) => adminApi.recordMetaInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-wa-overview'] });
      queryClient.invalidateQueries({ queryKey: ['admin-wa-meta'] });
      setIsInvoiceModalOpen(false);
      setInvoiceForm({
        invoice_number: '',
        billing_period_start: '',
        billing_period_end: '',
        invoice_total_rupees: '',
        tax_amount_rupees: '',
        document_reference: '',
        notes: '',
      });
    },
  });

  // Record Meta Settlement Mutation
  const recordSettlementMutation = useMutation({
    mutationFn: (data) => adminApi.recordMetaSettlement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-wa-overview'] });
      queryClient.invalidateQueries({ queryKey: ['admin-wa-meta'] });
      setIsSettlementModalOpen(false);
      setSettlementForm({
        meta_invoice_id: '',
        settlement_reference: '',
        payment_date: '',
        amount_paid_rupees: '',
        payment_method: 'BANK_TRANSFER',
        notes: '',
      });
    },
  });

  // Upsert Pricing Rule Mutation
  const upsertPricingMutation = useMutation({
    mutationFn: (data) => adminApi.upsertWhatsAppPricingRule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-wa-pricing'] });
      setIsPricingModalOpen(false);
    },
  });

  return (
    <div className="flex flex-col min-h-full bg-[#FFFDF9]">
      {/* 1. Global Admin Top Header Navigation */}
      <AdminHeader
        title="WhatsApp Billing"
        subtitle="Pay-As-You-Use studio credits, messaging margins, Meta invoicing, and settlements"
        onOpenMobileMenu={onOpenMobileMenu}
      />

      <div className="p-3 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* 2. Page Sub-Header with Billing Mode Badge & Switch Action */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">
                  WhatsApp Messaging Ledger
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Cloud API v21.0
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Financial separation of studio liabilities from Meta platform liabilities.
              </p>
            </div>
          </div>

          {/* Config Switch Card */}
          <div className="flex items-center justify-between sm:justify-end gap-3.5 bg-stone-50/80 p-2.5 rounded-xl border border-stone-200/80">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Platform Arrangement
              </span>
              <span className="text-xs font-extrabold text-stone-800 flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    billingConfig.billing_mode === 'CENTRALIZED_VEXA_BILLING'
                      ? 'bg-purple-500 animate-pulse'
                      : 'bg-emerald-500'
                  }`}
                />
                {billingConfig.billing_mode === 'CENTRALIZED_VEXA_BILLING'
                  ? 'Centralized VEXA Billing'
                  : 'Direct Studio Billing'}
              </span>
            </div>

            <button
              onClick={() =>
                updateConfigMutation.mutate({
                  billing_mode:
                    billingConfig.billing_mode === 'CENTRALIZED_VEXA_BILLING'
                      ? 'DIRECT_STUDIO_BILLING'
                      : 'CENTRALIZED_VEXA_BILLING',
                  is_live_billing_verified: true,
                })
              }
              disabled={updateConfigMutation.isPending}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-stone-900 hover:border-orange-300 shadow-2xs hover:shadow-xs transition-all active:scale-95"
            >
              {updateConfigMutation.isPending ? 'Updating...' : 'Switch Mode'}
            </button>
          </div>
        </div>

        {/* 3. KPI Cards Grid: Double-Entry Financial Health */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Customer Cash Collected */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                Cash Collected
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-stone-900 tracking-tight">
                ₹{kpi.total_customer_cash_collected_rupees.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Gross studio top-ups received via Razorpay
              </p>
            </div>
          </div>

          {/* Card 2: Prepaid Customer Liabilities */}
          <div className="bg-white p-5 rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50/30 to-white shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Prepaid Liabilities
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-amber-700 tracking-tight">
                ₹{kpi.customer_prepaid_credit_liability_rupees.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-amber-800/70 mt-0.5">
                Unspent credit balances held in studio wallets
              </p>
            </div>
          </div>

          {/* Card 3: Recognized Revenue */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                Messaging Revenue
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-stone-900 tracking-tight">
                ₹{kpi.varnam_messaging_revenue_rupees.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Earned from delivered marketing & utility runs
              </p>
            </div>
          </div>

          {/* Card 4: Meta Outstanding */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                Meta Payable
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-purple-700 tracking-tight">
                ₹{kpi.outstanding_meta_payable_rupees.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Meta tax invoices minus recorded settlements
              </p>
            </div>
          </div>
        </div>

        {/* 4. Modern Responsive Segmented Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100/90 rounded-2xl border border-stone-200/80 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Financial Overview', icon: Layers },
            { id: 'studios', label: 'Studio Wallets', icon: Building2 },
            { id: 'usages', label: 'Campaign Usages', icon: FileText },
            { id: 'pricing', label: 'Pricing Engine & Rates', icon: Sliders },
            { id: 'meta', label: 'Meta Invoices & Settlements', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-3 sm:px-4 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-600' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 5. TAB CONTENTS */}

        {/* TAB 1: FINANCIAL OVERVIEW & DOUBLE-ENTRY BREAKDOWN */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-200">
            {/* Customer Funds & Liability Card */}
            <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                  Customer Funds & Liability Breakdown
                </h3>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Balanced
                </span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Reconciliation isolating customer prepaid funds from earned messaging revenue. Customer cash is never marked as Meta-paid until verified delivery occurs.
              </p>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 text-xs">
                  <span className="text-stone-600 font-medium">Total Customer Cash Collected (Gross):</span>
                  <span className="font-extrabold text-stone-900 text-sm">
                    ₹{kpi.total_customer_cash_collected_rupees.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50/70 text-xs border border-amber-200/60">
                  <span className="text-amber-900 font-medium">Available Balances (Deferred Liability):</span>
                  <span className="font-extrabold text-amber-800 text-sm">
                    ₹{kpi.customer_prepaid_credit_liability_rupees.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50/70 text-xs border border-blue-200/60">
                  <span className="text-blue-900 font-medium">Reserved in Active Broadcasts:</span>
                  <span className="font-extrabold text-blue-800 text-sm">
                    ₹{kpi.customer_reserved_credits_rupees.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/70 text-xs border border-emerald-200/60">
                  <span className="text-emerald-900 font-medium">Earned VARNAM Messaging Revenue:</span>
                  <span className="font-extrabold text-emerald-800 text-sm">
                    ₹{kpi.varnam_messaging_revenue_rupees.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Meta Invoicing & Settlement Position Card */}
            <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  Meta Invoicing & Settlement Position
                </h3>
                <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  Verified
                </span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Comparison of calculated message transmission costs against official Meta tax invoices and recorded bank payments.
              </p>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 text-xs">
                  <span className="text-stone-600 font-medium">Estimated Meta Costs (Delivered Runs):</span>
                  <span className="font-extrabold text-stone-900 text-sm">
                    ₹{kpi.estimated_meta_messaging_cost_rupees.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 text-xs">
                  <span className="text-stone-600 font-medium">Official Invoiced by Meta:</span>
                  <span className="font-extrabold text-stone-900 text-sm">
                    ₹{kpi.actual_meta_invoiced_rupees.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/70 text-xs border border-emerald-200/60">
                  <span className="text-emerald-900 font-medium">Payments Settled to Meta:</span>
                  <span className="font-extrabold text-emerald-800 text-sm">
                    ₹{kpi.actual_meta_settled_rupees.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-purple-50/70 text-xs border border-purple-200/60">
                  <span className="text-purple-900 font-medium">Outstanding Meta Payable:</span>
                  <span className="font-extrabold text-purple-800 text-sm">
                    ₹{kpi.outstanding_meta_payable_rupees.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STUDIO WALLETS */}
        {activeTab === 'studios' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden animate-in fade-in duration-200">
            <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-stone-50/40">
              <div>
                <h3 className="font-extrabold text-sm text-stone-900">Studio WhatsApp Credit Wallets</h3>
                <p className="text-xs text-stone-500">Live prepaid messaging balances across all active studio tenants</p>
              </div>
              <span className="text-xs font-bold text-stone-700 bg-white border border-stone-200 px-3 py-1.5 rounded-xl self-start sm:self-auto shadow-2xs">
                {studiosRes?.data?.length || 0} Registered Studio Tenants
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50/80 text-stone-500 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="p-4">Studio Details</th>
                    <th className="p-4">Owner & Contact</th>
                    <th className="p-4">Available Balance</th>
                    <th className="p-4">Reserved</th>
                    <th className="p-4">Lifetime Top-Up</th>
                    <th className="p-4">Lifetime Consumed</th>
                    <th className="p-4">Account Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {(studiosRes?.data || []).length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-stone-400">
                        No studio accounts found.
                      </td>
                    </tr>
                  ) : (
                    (studiosRes?.data || []).map((s) => (
                      <tr key={s.id} className="hover:bg-orange-50/30 transition-colors">
                        <td className="p-4">
                          <span className="font-bold text-stone-900 block text-xs">{s.studio_name}</span>
                          <span className="font-mono text-[10px] text-stone-400">/{s.studio_slug}</span>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-stone-800">{s.owner_name || 'Studio Owner'}</div>
                          <div className="text-[11px] text-stone-400 font-mono">{s.owner_email}</div>
                        </td>
                        <td className="p-4">
                          <span className="font-extrabold text-emerald-700 text-sm bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200/80 inline-block">
                            ₹{s.available_rupees.toFixed(2)}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-amber-700">
                          ₹{s.reserved_rupees.toFixed(2)}
                        </td>
                        <td className="p-4 font-medium text-stone-800">
                          ₹{s.lifetime_purchased_rupees.toFixed(2)}
                        </td>
                        <td className="p-4 font-medium text-stone-800">
                          ₹{s.lifetime_spent_rupees.toFixed(2)}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                              s.is_locked
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {s.is_locked ? 'Locked' : 'Active'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CAMPAIGN USAGES */}
        {activeTab === 'usages' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden animate-in fade-in duration-200">
            <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-stone-50/40">
              <div>
                <h3 className="font-extrabold text-sm text-stone-900">Historical Campaign Deductions</h3>
                <p className="text-xs text-stone-500">Audit logs with immutable unit rate snapshots and delivery tallies</p>
              </div>
              <span className="text-xs text-stone-400 italic">Rate snapshots are permanently frozen at dispatch</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50/80 text-stone-500 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="p-4">Campaign & Studio</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Unit Rate</th>
                    <th className="p-4">Recipients</th>
                    <th className="p-4">Delivered</th>
                    <th className="p-4">Charged (INR)</th>
                    <th className="p-4">Est. Meta Cost</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {(usagesRes?.data || []).length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-stone-400">
                        No campaign deductions recorded yet.
                      </td>
                    </tr>
                  ) : (
                    (usagesRes?.data || []).map((u) => (
                      <tr key={u.id} className="hover:bg-orange-50/30 transition-colors">
                        <td className="p-4">
                          <span className="font-bold text-stone-900 block">{u.campaign_name}</span>
                          <span className="text-[11px] text-stone-400">{u.studio_name}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-bold text-[10px]">
                            {u.message_category}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-medium">₹{u.unit_total_rate_rupees.toFixed(4)}</td>
                        <td className="p-4">{u.recipient_count}</td>
                        <td className="p-4 font-bold text-emerald-700">{u.delivered_count}</td>
                        <td className="p-4 font-black text-stone-900">
                          ₹{u.actual_charged_rupees.toFixed(2)}
                        </td>
                        <td className="p-4 text-stone-500 font-mono">
                          ₹{u.meta_estimated_cost_rupees.toFixed(2)}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {u.reconciliation_status || u.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PRICING ENGINE */}
        {activeTab === 'pricing' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
              <div>
                <h3 className="font-extrabold text-sm text-stone-900">Rate Cards & Pricing Rules (India - IN)</h3>
                <p className="text-xs text-stone-500">Meta base rate plus statutory 18% GST calculation</p>
              </div>
              <button
                onClick={() => setIsPricingModalOpen(true)}
                className="text-xs font-bold px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-1.5 shadow-sm shadow-orange-600/20 active:scale-95 transition-all self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Update Rate Card</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(pricingRes?.data || []).map((r) => (
                <div key={r.id} className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs space-y-4 hover:border-orange-300 transition-all">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 uppercase tracking-wide">
                      {r.category || r.message_category}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      {r.verification_status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 text-center pt-1">
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                      <span className="text-[10px] text-stone-400 block uppercase font-bold">Base Rate</span>
                      <span className="font-extrabold text-stone-900 text-sm mt-0.5 block">
                        ₹{parseFloat(r.base_rate_rupees).toFixed(4)}
                      </span>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                      <span className="text-[10px] text-stone-400 block uppercase font-bold">GST Tax %</span>
                      <span className="font-extrabold text-stone-900 text-sm mt-0.5 block">
                        {parseFloat(r.tax_rate_percent)}%
                      </span>
                    </div>
                    <div className="bg-orange-50/70 p-3 rounded-xl border border-orange-200">
                      <span className="text-[10px] text-orange-800 block uppercase font-bold">Total / Msg</span>
                      <span className="font-black text-orange-700 text-sm mt-0.5 block">
                        ₹{parseFloat(r.total_rate_rupees).toFixed(4)}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-100 flex items-center justify-between">
                    <span>Note: {r.source_note || r.verification_notes || 'Official baseline rate card'}</span>
                    <span className="text-stone-400 font-mono text-[10px]">Currency: INR</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: META INVOICES & SETTLEMENTS */}
        {activeTab === 'meta' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
              <div>
                <h3 className="font-extrabold text-sm text-stone-900">Meta Tax Invoices & Bank Settlements</h3>
                <p className="text-xs text-stone-500">Record incoming Meta invoices and log outgoing bank wire settlements</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsInvoiceModalOpen(true)}
                  className="text-xs font-bold px-3.5 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 text-stone-500" />
                  <span>Record Meta Invoice</span>
                </button>
                <button
                  onClick={() => setIsSettlementModalOpen(true)}
                  className="text-xs font-bold px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 shadow-sm shadow-purple-600/20 transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Record Settlement</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Invoices List */}
              <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-stone-500">
                    Official Meta Invoices
                  </h4>
                  <span className="text-[11px] font-bold text-stone-400">
                    {(metaDataRes?.data?.invoices || []).length} Records
                  </span>
                </div>

                {(metaDataRes?.data?.invoices || []).length === 0 ? (
                  <div className="py-12 text-center text-xs text-stone-400">
                    No Meta invoices recorded yet.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {(metaDataRes?.data?.invoices || []).map((inv) => (
                      <div key={inv.id} className="p-3.5 rounded-xl border border-stone-200 text-xs flex justify-between items-center hover:border-stone-300 transition-colors">
                        <div>
                          <div className="font-bold text-stone-900">{inv.invoice_number}</div>
                          <div className="text-[11px] text-stone-400 mt-0.5">
                            Period: {new Date(inv.billing_period_start).toLocaleDateString()} – {new Date(inv.billing_period_end).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-extrabold text-stone-900 text-sm">
                            ₹{inv.invoice_total_rupees.toFixed(2)}
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 mt-1 inline-block">
                            {inv.reconciliation_status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Settlements List */}
              <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-stone-500">
                    Bank Settlements Paid to Meta
                  </h4>
                  <span className="text-[11px] font-bold text-stone-400">
                    {(metaDataRes?.data?.settlements || []).length} Records
                  </span>
                </div>

                {(metaDataRes?.data?.settlements || []).length === 0 ? (
                  <div className="py-12 text-center text-xs text-stone-400">
                    No settlements recorded yet.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {(metaDataRes?.data?.settlements || []).map((set) => (
                      <div key={set.id} className="p-3.5 rounded-xl border border-stone-200 text-xs flex justify-between items-center hover:border-emerald-200 transition-colors">
                        <div>
                          <div className="font-bold text-stone-900 font-mono">{set.settlement_reference}</div>
                          <div className="text-[11px] text-stone-400 mt-0.5">
                            {new Date(set.payment_date).toLocaleDateString()} • {set.payment_method}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-emerald-700 text-sm">
                            ₹{set.amount_paid_rupees.toFixed(2)}
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mt-1 inline-block">
                            {set.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: Record Meta Invoice */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-base text-stone-900">Record Meta Tax Invoice</h3>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Invoice Number *</label>
                <input
                  type="text"
                  placeholder="e.g. META-INV-2026-10"
                  value={invoiceForm.invoice_number}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, invoice_number: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={invoiceForm.billing_period_start}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, billing_period_start: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">End Date *</label>
                  <input
                    type="date"
                    value={invoiceForm.billing_period_end}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, billing_period_end: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Invoice Total (₹) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 1500.00"
                    value={invoiceForm.invoice_total_rupees}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, invoice_total_rupees: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Tax Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 228.81"
                    value={invoiceForm.tax_amount_rupees}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, tax_amount_rupees: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setIsInvoiceModalOpen(false)} className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900">
                Cancel
              </button>
              <button
                onClick={() => recordInvoiceMutation.mutate(invoiceForm)}
                disabled={recordInvoiceMutation.isPending || !invoiceForm.invoice_number || !invoiceForm.invoice_total_rupees}
                className="px-4 py-2 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-xs"
              >
                {recordInvoiceMutation.isPending ? 'Saving...' : 'Save Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Record Settlement */}
      {isSettlementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-base text-stone-900">Record Meta Settlement Payment</h3>
              <button onClick={() => setIsSettlementModalOpen(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Settlement Ref / Bank UTR *</label>
                <input
                  type="text"
                  placeholder="e.g. UTR-994827163"
                  value={settlementForm.settlement_reference}
                  onChange={(e) => setSettlementForm({ ...settlementForm, settlement_reference: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Payment Date *</label>
                <input
                  type="date"
                  value={settlementForm.payment_date}
                  onChange={(e) => setSettlementForm({ ...settlementForm, payment_date: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Amount Paid (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g. 1500.00"
                  value={settlementForm.amount_paid_rupees}
                  onChange={(e) => setSettlementForm({ ...settlementForm, amount_paid_rupees: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setIsSettlementModalOpen(false)} className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900">
                Cancel
              </button>
              <button
                onClick={() => recordSettlementMutation.mutate(settlementForm)}
                disabled={recordSettlementMutation.isPending || !settlementForm.settlement_reference || !settlementForm.amount_paid_rupees}
                className="px-4 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xs"
              >
                {recordSettlementMutation.isPending ? 'Saving...' : 'Save Settlement'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Update Pricing */}
      {isPricingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-base text-stone-900">Update Message Category Pricing</h3>
              <button onClick={() => setIsPricingModalOpen(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Message Category *</label>
                <select
                  value={pricingForm.message_category}
                  onChange={(e) => setPricingForm({ ...pricingForm, message_category: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-white"
                >
                  <option value="MARKETING">MARKETING (Broadcasts & Promotions)</option>
                  <option value="UTILITY">UTILITY (Booking confirmations & Reminders)</option>
                  <option value="AUTHENTICATION">AUTHENTICATION (OTP & Security)</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Base Rate (₹) *</label>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="e.g. 0.7800"
                  value={pricingForm.base_rate_rupees}
                  onChange={(e) => setPricingForm({ ...pricingForm, base_rate_rupees: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">GST Tax Rate (%)</label>
                <input
                  type="number"
                  value={pricingForm.tax_rate_percent}
                  onChange={(e) => setPricingForm({ ...pricingForm, tax_rate_percent: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setIsPricingModalOpen(false)} className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900">
                Cancel
              </button>
              <button
                onClick={() => upsertPricingMutation.mutate(pricingForm)}
                disabled={upsertPricingMutation.isPending || !pricingForm.base_rate_rupees}
                className="px-4 py-2 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-xs"
              >
                {upsertPricingMutation.isPending ? 'Saving...' : 'Save Rate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
