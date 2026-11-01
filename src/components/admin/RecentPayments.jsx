'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';

export function RecentPayments({ payments = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-orange-100/80 p-5 sm:p-6 shadow-[0_2px_12px_rgba(249,115,22,0.04)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.08)] transition-all duration-200">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-orange-50">
        <div>
          <h2 className="text-base font-bold text-stone-900 tracking-tight">Recent Verified Payments</h2>
          <p className="text-xs text-stone-500 mt-0.5">Live Razorpay subscription transactions collected</p>
        </div>
        <Link
          href="/payments"
          className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100/70 border border-orange-200/80 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all"
        >
          <span>View All</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-stone-100">
        {payments.length === 0 ? (
          <div className="py-8 text-center text-stone-400 text-xs">No verified payments found</div>
        ) : (
          payments.map((p) => (
            <div key={p.id} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stone-900 truncate">{p.businessName}</p>
                  <p className="text-xs text-stone-500 font-mono truncate">{p.paymentReference}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-emerald-600">
                  +₹{p.amountRupees.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  {p.paidAt ? new Date(p.paidAt).toLocaleDateString('en-IN') : 'Just now'} &bull; {p.planName}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
