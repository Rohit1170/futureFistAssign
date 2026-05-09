'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MoviePerformanceChart } from '@/components/analytics/MoviePerformanceChart';
import { RegionalEngagementChart } from '@/components/analytics/RegionalEngagementChart';
import { MarketingROIChart } from '@/components/analytics/MarketingROIChart';

export default function AnalyticsPage() {
  return (
    <div className="flex-1 bg-slate-950 p-8 overflow-auto">
      <div className="max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-slate-400">Visualize and analyze your business metrics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Movie Performance</CardTitle>
              <CardDescription className="text-slate-400">Revenue and viewers by title</CardDescription>
            </CardHeader>
            <CardContent>
              <MoviePerformanceChart />
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Regional Engagement</CardTitle>
              <CardDescription className="text-slate-400">Completion and engagement rates</CardDescription>
            </CardHeader>
            <CardContent>
              <RegionalEngagementChart />
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Marketing ROI</CardTitle>
              <CardDescription className="text-slate-400">Spend vs revenue correlation</CardDescription>
            </CardHeader>
            <CardContent>
              <MarketingROIChart />
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Channel Performance</CardTitle>
              <CardDescription className="text-slate-400">Marketing channel comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-slate-400">
                <p>Query this data through the AI chat for real-time analysis</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
