'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Stellar Horizon', revenue: 425, viewers: 2.5, rating: 8.5 },
  { name: 'Echoes Tomorrow', revenue: 320, viewers: 1.8, rating: 8.2 },
  { name: 'The Last Guardian', revenue: 580, viewers: 3.2, rating: 8.8 },
  { name: 'Midnight Paris', revenue: 245, viewers: 1.2, rating: 7.9 },
  { name: 'Quantum Entanglement', revenue: 380, viewers: 2.1, rating: 8.4 },
];

export function MoviePerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
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
        <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (M$)" radius={[8, 8, 0, 0]} />
        <Bar dataKey="viewers" fill="#06b6d4" name="Viewers (M)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
