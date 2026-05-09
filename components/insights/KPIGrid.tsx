'use client';

import { Card, CardContent } from '@/components/ui/card';

interface Stats {
  totalQueries: number;
  avgResponseTime: number;
  successRate: number;
  activeUsers: number;
}

interface KPIGridProps {
  stats: Stats;
}

export function KPIGrid({ stats }: KPIGridProps) {
  const kpis = [
    {
      label: 'Total Queries',
      value: stats.totalQueries.toLocaleString(),
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      trend: '+12.5%',
    },
    {
      label: 'Avg Response Time',
      value: `${stats.avgResponseTime}s`,
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      trend: '-2.3%',
    },
    {
      label: 'Success Rate',
      value: `${stats.successRate}%`,
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      trend: '+0.8%',
    },
    {
      label: 'Active Users',
      value: stats.activeUsers,
      icon: 'M17 20h5v-2a3 3 0 00-5.856-1.487M15 10h.01M11 20h5v-2a3 3 0 00-5.856-1.487M15 10h.01M6 20h5v-2a3 3 0 00-5.856-1.487M6 10a3 3 0 100-6 3 3 0 000 6zM12 10a3 3 0 100-6 3 3 0 000 6z',
      trend: '+5 users',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => (
        <Card key={idx} className="bg-slate-900/50 border-slate-700/50 hover:border-slate-600 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={kpi.icon} />
                </svg>
              </div>
              <span className="text-xs font-semibold text-green-400">{kpi.trend}</span>
            </div>
            <p className="text-sm text-slate-400 mb-2">{kpi.label}</p>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
