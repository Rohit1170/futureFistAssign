'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'North America', engagement: 78, completion: 72, users: 450 },
  { name: 'Europe', engagement: 82, completion: 75, users: 380 },
  { name: 'Asia', engagement: 76, completion: 68, users: 520 },
  { name: 'South America', engagement: 71, completion: 64, users: 210 },
  { name: 'Australia', engagement: 79, completion: 73, users: 150 },
];

export function RegionalEngagementChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
        <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '0.5rem',
          }}
          labelStyle={{ color: '#f1f5f9' }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="engagement"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', r: 4 }}
          name="Engagement (%)"
        />
        <Line
          type="monotone"
          dataKey="completion"
          stroke="#06b6d4"
          strokeWidth={2}
          dot={{ fill: '#06b6d4', r: 4 }}
          name="Completion (%)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
