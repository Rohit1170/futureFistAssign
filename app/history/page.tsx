'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HistoryPage() {
  return (
    <div className="flex-1 bg-slate-950 p-8 overflow-auto">
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Query History</h1>
          <p className="text-slate-400">Review your previous questions and responses</p>
        </div>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Queries</CardTitle>
            <CardDescription className="text-slate-400">Your last 50 queries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 text-slate-400">
              <p>No queries yet. Start by asking a question in the dashboard.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
