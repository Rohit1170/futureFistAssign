'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MovieData {
  name: string;
  fullName: string;
  revenue: number;
  viewers: number;
  rating: number;
}

export function MoviePerformanceChart() {
  const [data, setData] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/movies')
      .then((r) => r.json())
      .then((d) => { if (!d.error) setData(d); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-75 flex items-center justify-center text-slate-400 animate-pulse">Loading...</div>;
  if (!data.length) return <div className="h-75 flex items-center justify-center text-slate-400">No data available</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '11px' }} />
        <YAxis stroke="#94a3b8" style={{ fontSize: '11px' }} />
        <Tooltip
          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '0.5rem' }}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ''}
          labelStyle={{ color: '#f1f5f9' }}
        />
        <Legend />
        <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (M dollar)" radius={[6, 6, 0, 0]} />
        <Bar dataKey="viewers" fill="#06b6d4" name="Viewers (M)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
