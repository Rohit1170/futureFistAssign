'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'TV', spend: 75, revenue: 425 },
  { name: 'Digital', spend: 62, revenue: 320 },
  { name: 'Print', spend: 48, revenue: 245 },
  { name: 'Outdoor', spend: 95, revenue: 580 },
  { name: 'Social', spend: 70, revenue: 380 },
];

export function MarketingROIChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="spend" name="Marketing Spend (M$)" stroke="#94a3b8" />
        <YAxis dataKey="revenue" name="Revenue (M$)" stroke="#94a3b8" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '0.5rem',
          }}
          labelStyle={{ color: '#f1f5f9' }}
          cursor={{ strokeDasharray: '3 3' }}
        />
        <Legend />
        <Scatter name="Campaign Performance" data={data} fill="#3b82f6" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
