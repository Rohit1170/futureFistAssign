'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RegionData {
  name: string;
  engagement: number;
  completion: number;
}

export function RegionalEngagementChart() {
  const [data, setData] = useState<RegionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/regional')
      .then((r) => r.json())
      .then((d) => { if (!d.error) setData(d); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-75 flex items-center justify-center text-slate-400 animate-pulse">Loading...</div>;
  if (!data.length) return <div className="h-75 flex items-center justify-center text-slate-400">No data available</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
        <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
        <Tooltip
          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '0.5rem' }}
          labelStyle={{ color: '#f1f5f9' }}
        />
        <Legend />
        <Line type="monotone" dataKey="engagement" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} name="Engagement (%)" />
        <Line type="monotone" dataKey="completion" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 4 }} name="Completion (%)" />
      </LineChart>
    </ResponsiveContainer>
  );
}
