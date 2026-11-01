'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Building2, ShieldAlert } from 'lucide-react';

export function RecentAccounts({ accounts = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-orange-100/80 p-5 sm:p-6 shadow-[0_2px_12px_rgba(249,115,22,0.04)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.08)] transition-all duration-200">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-orange-50">
        <div>
          <h2 className="text-base font-bold text-stone-900 tracking-tight">Recent Registrations</h2>
          <p className="text-xs text-stone-500 mt-0.5">Newly onboarded bridal and makeup businesses</p>
        </div>
        <Link
          href="/accounts"
          className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100/70 border border-orange-200/80 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all"
        >
          <span>View All</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-stone-100">
        {accounts.length === 0 ? (
          <div className="py-8 text-center text-stone-400 text-xs">No registered businesses found</div>
        ) : (
          accounts.map((acc) => {
            const isSuspended = acc.status === 'SUSPENDED';
            return (
              <div key={acc.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm shrink-0">
                    {acc.name ? acc.name[0].toUpperCase() : 'S'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-stone-900 truncate flex items-center gap-2">
                      <span>{acc.name}</span>
                      {isSuspended && (
                        <span className="text-[10px] font-bold uppercase bg-rose-50 text-rose-700 px-1.5 py-0.2 rounded border border-rose-200">
                          Suspended
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-stone-500 truncate">
                      {acc.ownerName} &bull; {acc.ownerEmail}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                    {acc.planName}
                  </span>
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    {acc.createdAt ? new Date(acc.createdAt).toLocaleDateString('en-IN') : '—'}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
