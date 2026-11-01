'use client';

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-white text-stone-800 p-3.5 rounded-xl shadow-xl border border-orange-200 text-xs space-y-1.5 ring-1 ring-orange-500/10">
        <p className="font-bold text-stone-900 pb-1 border-b border-orange-100">{item.name}</p>
        <p className="text-orange-600 font-semibold">Paying Accounts: {item.value}</p>
        <p className="text-stone-600 font-medium">Total Collected: ₹{item.revenue.toLocaleString('en-IN')}</p>
      </div>
    );
  }
  return null;
};

export function SubscriptionChart({ breakdown }) {
  const data = [
    {
      name: 'Starter (₹599/mo)',
      value: breakdown?.starter?.activeSubscribers || 0,
      revenue: breakdown?.starter?.revenueRupees || 0,
      color: '#F97316',
    },
    {
      name: 'Growth (₹999/mo)',
      value: breakdown?.growth?.activeSubscribers || 0,
      revenue: breakdown?.growth?.revenueRupees || 0,
      color: '#3B82F6',
    },
    {
      name: 'Premium (₹29,999)',
      value: breakdown?.premium?.salesCount || 0,
      revenue: breakdown?.premium?.revenueRupees || 0,
      color: '#8B5CF6',
    },
  ];

  const totalAccounts = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm flex flex-col justify-between">
      <div>
        <h2 className="text-base font-bold text-stone-900 tracking-tight">Subscription Plan Distribution</h2>
        <p className="text-xs text-stone-500">Live breakdown of active paid studios across commercial plans</p>
      </div>

      <div className="h-64 w-full my-2">
        {totalAccounts === 0 ? (
          <div className="h-full flex items-center justify-center text-stone-400 text-xs">
            No active subscriptions found
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-100 text-center">
        {data.map((item) => (
          <div key={item.name} className="px-1">
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-[11px] font-medium text-stone-600 truncate">{item.name.split(' ')[0]}</span>
            </div>
            <p className="text-base font-bold text-stone-900">{item.value}</p>
            <p className="text-[10px] text-stone-500">₹{item.revenue.toLocaleString('en-IN')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
