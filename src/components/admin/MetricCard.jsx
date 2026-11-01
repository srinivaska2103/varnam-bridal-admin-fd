'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function MetricCard({
  title,
  value,
  subvalue,
  change,
  changeLabel,
  icon: Icon,
  badgeText,
  badgeColor = 'orange',
  tooltip,
  className = '',
}) {
  const isPositive = typeof change === 'number' && change > 0;
  const isNegative = typeof change === 'number' && change < 0;
  const isZero = typeof change === 'number' && change === 0;

  const badgeColorClasses = {
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    stone: 'bg-stone-100 text-stone-700 border-stone-200',
  }[badgeColor] || 'bg-stone-50 text-stone-700 border-stone-200';

  return (
    <div
      className={`bg-white rounded-2xl border border-orange-100/80 p-5 sm:p-6 shadow-[0_2px_12px_rgba(249,115,22,0.04)] hover:shadow-[0_8px_24px_rgba(249,115,22,0.12)] hover:border-orange-300 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group ${className}`}
      title={tooltip}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500 group-hover:text-orange-900 transition-colors">
            {title}
          </p>
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-600 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-all duration-200 flex items-center justify-center shrink-0 shadow-xs">
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>

        <div className="mt-3 flex items-baseline gap-2 flex-wrap">
          <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">{value}</h3>
          {badgeText && (
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${badgeColorClasses}`}
            >
              {badgeText}
            </span>
          )}
        </div>

        {subvalue && <div className="mt-2 text-xs text-stone-600 font-medium leading-relaxed">{subvalue}</div>}
      </div>

      {typeof change === 'number' && (
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-xs">
          {isPositive && (
            <span className="flex items-center text-emerald-600 font-semibold">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />+{change}%
            </span>
          )}
          {isNegative && (
            <span className="flex items-center text-rose-600 font-semibold">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
              {change}%
            </span>
          )}
          {isZero && (
            <span className="flex items-center text-stone-500 font-semibold">
              <Minus className="w-3.5 h-3.5 mr-0.5" />
              0%
            </span>
          )}
          {changeLabel && <span className="text-stone-400">{changeLabel}</span>}
        </div>
      )}
    </div>
  );
}
