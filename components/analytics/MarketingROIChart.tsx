'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChannelData {
  name: string;
  spend: number;
  conversions: number;
  roi: number;
}

export function MarketingROIChart() {
  const [data, setData] = useState<ChannelData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/marketing')
      .then((r) => r.json())
      .then((d) => { if (!d.error) setData(d); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-[300px] flex items-center justify-center text-slate-400 animate-pulse">Loading...</div>;
  if (!data.length) return <div className="h-[300px] flex items-center justify-center text-slate-400">No data available</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
        <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
        <Tooltip
          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '0.5rem' }}
          labelStyle={{ color: '#f1f5f9' }}
        />
        <Legend />
        <Bar dataKey="spend" fill="#3b82f6" name="Spend ($K)" radius={[6, 6, 0, 0]} />
        <Bar dataKey="roi" fill="#10b981" name="ROI Score" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
