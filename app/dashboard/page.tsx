'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { KPIGrid } from '@/components/insights/KPIGrid';

const defaultStats = {
  totalMovies: 0,
  totalViewers: 0,
  totalRevenue: 0,
  avgRating: 0,
  trends: { movies: null, viewers: null, revenue: null, rating: null },
};

export default function DashboardPage() {
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setStats(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 bg-slate-950 p-8 overflow-auto">
      <div className="max-w-full space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-slate-400">Ask questions about your business data and get AI-powered insights</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 rounded-lg bg-slate-800/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <KPIGrid stats={stats} />
        )}

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Ask a Question</CardTitle>
            <CardDescription className="text-slate-400">
              Use natural language to query your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChatPanel />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
