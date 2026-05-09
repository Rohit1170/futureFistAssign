'use client';

import { Card, CardContent } from '@/components/ui/card';

interface DashboardStats {
  totalMovies: number;
  totalViewers: number;
  totalRevenue: number;
  avgRating: number;
  trends: {
    movies: string | null;
    viewers: string | null;
    revenue: string | null;
    rating: string | null;
  };
}

interface KPIGridProps {
  stats: DashboardStats;
}

function formatViewers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function formatRevenue(n: number) {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n}`;
}

function Trend({ value }: { value: string | null }) {
  if (!value || value === '—') return null;
  const num = parseFloat(value);
  const positive = num >= 0;
  return (
    <span className={`text-xs font-semibold ${positive ? 'text-green-400' : 'text-red-400'}`}>
      {positive ? '+' : ''}{value}%
    </span>
  );
}

export function KPIGrid({ stats }: KPIGridProps) {
  const kpis = [
    {
      label: 'Total Titles',
      value: stats.totalMovies.toLocaleString(),
      trend: stats.trends.movies,
      icon: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z',
    },
    {
      label: 'Total Viewers',
      value: formatViewers(stats.totalViewers),
      trend: stats.trends.viewers,
      icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
    },
    {
      label: 'Total Revenue',
      value: formatRevenue(stats.totalRevenue),
      trend: stats.trends.revenue,
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      label: 'Avg Rating',
      value: `${stats.avgRating}/10`,
      trend: stats.trends.rating,
      icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
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
              <Trend value={kpi.trend} />
            </div>
            <p className="text-sm text-slate-400 mb-2">{kpi.label}</p>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
