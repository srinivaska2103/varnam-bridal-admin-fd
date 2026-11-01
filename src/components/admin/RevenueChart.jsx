'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white text-stone-800 p-3.5 rounded-xl shadow-xl border border-orange-200 text-xs space-y-1.5 ring-1 ring-orange-500/10">
        <p className="font-bold text-stone-900 pb-1 border-b border-orange-100">{label}</p>
        <p className="text-orange-600 font-bold flex items-center justify-between gap-4">
          <span>Total Collected:</span>
          <span>₹{(payload[0]?.value || 0).toLocaleString('en-IN')}</span>
        </p>
        {payload[1] && (
          <p className="text-stone-300 flex items-center justify-between gap-4">
            <span>Starter (₹599):</span>
            <span>₹{(payload[1]?.value || 0).toLocaleString('en-IN')}</span>
          </p>
        )}
        {payload[2] && (
          <p className="text-stone-300 flex items-center justify-between gap-4">
            <span>Growth (₹999):</span>
            <span>₹{(payload[2]?.value || 0).toLocaleString('en-IN')}</span>
          </p>
        )}
        {payload[3] && (
          <p className="text-stone-300 flex items-center justify-between gap-4">
            <span>Premium (₹29,999):</span>
            <span>₹{(payload[3]?.value || 0).toLocaleString('en-IN')}</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

export function RevenueChart({ data = [], interval = 'monthly', onIntervalChange }) {
  const formattedData = data.map((d) => ({
    ...d,
    totalFormatted: `₹${d.total.toLocaleString('en-IN')}`,
  }));

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-base font-bold text-stone-900 tracking-tight">Revenue Collections Over Time</h2>
          <p className="text-xs text-stone-500">Verified successful subscription payments (Excludes pending & failed)</p>
        </div>

        {onIntervalChange && (
          <div className="flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200 self-start sm:self-auto">
            {['daily', 'monthly', 'yearly'].map((int) => (
              <button
                key={int}
                onClick={() => onIntervalChange(int)}
                className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-all ${
                  interval === int
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {int}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-72 w-full">
        {formattedData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-stone-400 text-xs">
            No verified payment transactions in this interval
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="totalRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F4" vertical={false} />
              <XAxis dataKey="date" stroke="#A8A29E" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#A8A29E"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#F97316"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#totalRevenueGrad)"
                name="Total Revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
