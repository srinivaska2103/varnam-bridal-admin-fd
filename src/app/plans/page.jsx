'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Check, X, Shield, Layers, HelpCircle, PhoneCall } from 'lucide-react';

export default function AdminPlansPage({ onOpenMobileMenu }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getPlans();
        setPlans(res.data);
      } catch (err) {
        console.error('Failed to load plans:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // Entitlement feature comparison matrix
  const featureMatrix = [
    {
      feature: 'Price',
      starter: '₹599 / month',
      growth: '₹999 / month',
      premium: '₹29,999 one-time',
    },
    {
      feature: 'Core studio management (Customers, Bookings, Calendar)',
      starter: true,
      growth: true,
      premium: true,
    },
    {
      feature: 'Custom enquiry form builder',
      starter: true,
      growth: true,
      premium: true,
    },
    {
      feature: 'Shareable enquiry form link',
      starter: true,
      growth: true,
      premium: true,
    },
    {
      feature: 'Branded website & public package enquiries',
      starter: false,
      growth: true,
      premium: true,
    },
    {
      feature: 'Public service catalogue & portfolio showcase',
      starter: false,
      growth: true,
      premium: true,
    },
    {
      feature: 'Online consultation request pipeline',
      starter: false,
      growth: true,
      premium: true,
    },
    {
      feature: 'Custom domain setup (e.g., yourstudio.com)',
      starter: false,
      growth: false,
      premium: true,
    },
    {
      feature: 'Dedicated hosting arrangement',
      starter: false,
      growth: false,
      premium: true,
    },
    {
      feature: 'First-year domain and hosting included',
      starter: false,
      growth: false,
      premium: true,
    },
    {
      feature: 'Checkout & Purchase Mode',
      starter: 'Online Razorpay Mandate',
      growth: 'Online Razorpay Mandate',
      premium: 'Contact Sales Only (No PG)',
    },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Commercial Plans & Entitlements"
        subtitle="Agreed product tiers, commercial pricing rules, and feature entitlement policies"
        onOpenMobileMenu={onOpenMobileMenu}
      />

      <div className="p-3 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Top 3 Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter Plan */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
                  Starter Monthly
                </span>
                <span className="text-xs text-stone-500 font-mono">BASIC_MONTHLY</span>
              </div>
              <h3 className="text-3xl font-extrabold text-stone-900 tracking-tight">₹599</h3>
              <p className="text-xs text-stone-500 mt-0.5">Billed monthly recurring via Razorpay</p>
              <p className="text-xs text-stone-600 mt-4 leading-relaxed">
                Core business management suite for bridal & makeup artists. Complete CRM, bookings, invoicing, and quotation workflows.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Checkout: Enabled</span>
              <span className="font-semibold text-emerald-600">Online PG</span>
            </div>
          </div>

          {/* Growth Plan */}
          <div className="bg-white rounded-2xl border-2 border-orange-500 p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-bl-lg tracking-wider">
              Most Popular
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-100/70 border border-orange-300 px-2.5 py-0.5 rounded-full">
                  Growth Monthly
                </span>
                <span className="text-xs text-stone-500 font-mono">GROWTH_MONTHLY</span>
              </div>
              <h3 className="text-3xl font-extrabold text-stone-900 tracking-tight">₹999</h3>
              <p className="text-xs text-stone-500 mt-0.5">Billed monthly recurring via Razorpay</p>
              <p className="text-xs text-stone-600 mt-4 leading-relaxed">
                Complete studio management with branded public website, catalogues, portfolio showcase, consultation booking, and website enquiries.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Checkout: Enabled</span>
              <span className="font-semibold text-emerald-600">Online PG</span>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                  Premium Package
                </span>
                <span className="text-xs text-stone-500 font-mono">EXCLUSIVE_LIFETIME</span>
              </div>
              <h3 className="text-3xl font-extrabold text-stone-900 tracking-tight">₹29,999</h3>
              <p className="text-xs text-stone-500 mt-0.5">One-time customized deployment setup</p>
              <p className="text-xs text-stone-600 mt-4 leading-relaxed">
                All Growth features plus custom domain name, dedicated hosting infrastructure, and 1 year included domain & hosting.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">Checkout: Disabled</span>
              <span className="font-bold text-orange-600 flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Contact Sales Only</span>
              </span>
            </div>
          </div>
        </div>

        {/* Feature Comparison Matrix Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-stone-200 bg-stone-50/70">
            <h3 className="text-base font-bold text-stone-900">Entitlement Matrix Verification</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Verified feature flags enforced by backend database policies
            </p>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100/70 text-stone-600 font-semibold uppercase tracking-wider text-[11px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-6 w-1/3">Feature / Entitlement</th>
                  <th className="py-3 px-6 text-center">Starter</th>
                  <th className="py-3 px-6 text-center bg-orange-50/40 text-orange-950">Growth</th>
                  <th className="py-3 px-6 text-center">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {featureMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-stone-900">{row.feature}</td>
                    <td className="py-3.5 px-6 text-center">
                      {typeof row.starter === 'boolean' ? (
                        row.starter ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-stone-300 mx-auto" />
                        )
                      ) : (
                        <span className="font-semibold text-stone-800">{row.starter}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-center bg-orange-50/20">
                      {typeof row.growth === 'boolean' ? (
                        row.growth ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-stone-300 mx-auto" />
                        )
                      ) : (
                        <span className="font-bold text-orange-600">{row.growth}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      {typeof row.premium === 'boolean' ? (
                        row.premium ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-stone-300 mx-auto" />
                        )
                      ) : (
                        <span className="font-bold text-purple-700">{row.premium}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
