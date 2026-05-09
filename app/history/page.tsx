'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface QueryEntry {
  _id: string;
  queryText: string;
  toolsUsed: string[];
  response: string;
  executionTime: number;
  status: 'success' | 'failed' | 'partial';
  createdAt: string;
}

const statusColor: Record<string, string> = {
  success: 'text-green-400 bg-green-400/10 border-green-500/30',
  partial: 'text-yellow-400 bg-yellow-400/10 border-yellow-500/30',
  failed: 'text-red-400 bg-red-400/10 border-red-500/30',
};

export default function HistoryPage() {
  const [logs, setLogs] = useState<QueryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/history')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setLogs(d); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 bg-slate-950 p-8 overflow-auto">
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Query History</h1>
          <p className="text-slate-400">Your last 50 queries with tool traces</p>
        </div>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Queries</CardTitle>
            <CardDescription className="text-slate-400">{logs.length} queries logged</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 rounded-lg bg-slate-800/50 animate-pulse" />
                ))}
              </div>
            ) : logs.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-slate-400">
                No queries yet. Ask a question in the dashboard.
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log._id}
                    className="rounded-lg border border-slate-700 bg-slate-800/30 overflow-hidden"
                  >
                    <button
                      className="w-full text-left p-4 hover:bg-slate-800/60 transition-colors"
                      onClick={() => setExpanded(expanded === log._id ? null : log._id)}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm text-white font-medium truncate flex-1">{log.queryText}</p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-xs px-2 py-0.5 rounded border ${statusColor[log.status]}`}>
                            {log.status}
                          </span>
                          <span className="text-xs text-slate-500">{log.executionTime}ms</span>
                          <span className="text-xs text-slate-500">
                            {new Date(log.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>

                      {log.toolsUsed.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {log.toolsUsed.map((tool, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded bg-blue-600/20 border border-blue-500/30 text-blue-300">
                              {tool}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>

                    {expanded === log._id && (
                      <div className="border-t border-slate-700 p-4 bg-slate-900/50">
                        <p className="text-xs text-slate-400 mb-1">Response</p>
                        <p className="text-sm text-slate-300">{log.response}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
